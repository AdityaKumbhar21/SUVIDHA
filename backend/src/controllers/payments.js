const prisma = require('../lib/prisma');
const { createPaymentIntent, constructWebhookEvent } = require('../services/stripe');
const { sendNotification } = require('../services/twilio');
const { z } = require('zod');
const { generateReceipt } = require('../services/receipt');

const createIntentSchema = z.object({
  amountPaise: z.number().int().positive(),
  complaintId: z.string().uuid().optional(),
  description: z.string().max(100).optional(),
});


async function createPaymentIntentHandler(req, res, next) {
  try {
    const { amountPaise, complaintId, description } =
      createIntentSchema.parse(req.body);

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(amountPaise, {
        userId: req.user.id,
        complaintId: complaintId || '',
        description: description || 'SUVIDHA service payment',
      });

    await prisma.payment.create({
      data: {
        userId: req.user.id,
        complaintId: complaintId || null,
        amountPaise,
        stripePaymentIntentId: paymentIntentId,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      clientSecret,
      paymentIntentId,
    });
  } catch (err) {
    next(err);
  }
}


async function getMyPayments(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amountPaise: true,
        status: true,
        invoiceUrl: true,
        createdAt: true,
        complaintId: true,
      },
    });

    res.json({ payments });
  } catch (err) {
    next(err);
  }
}


async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  try {
    
    const event = constructWebhookEvent(req.rawBody, sig);

    
    if (!event?.data?.object) {
      return res.sendStatus(200);
    }

    const intent = event.data.object;

    
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: intent.id },
    });

    
    if (!payment) {
      console.warn(`Payment not found for intent ${intent.id}`);
      return res.sendStatus(200);
    }

    if (event.type === 'payment_intent.succeeded') {
      

      if (payment.status === 'SUCCESS') {
        return res.sendStatus(200);
      }

     
      const updatedPayment = await prisma.payment.update({
        where: { stripePaymentIntentId: intent.id },
        data: { status: 'SUCCESS' },
      });

      
      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });

      if (!updatedPayment.invoiceUrl && user) {
        const receiptUrl = await generateReceipt(updatedPayment, user);

        await prisma.payment.update({
          where: { id: updatedPayment.id },
          data: { invoiceUrl: receiptUrl },
        });
      }

     
      if (updatedPayment.complaintId) {
        await prisma.complaint.update({
          where: { id: updatedPayment.complaintId },
          data: { status: 'IN_PROGRESS' },
        });
      }

      
      await prisma.auditLog.create({
        data: {
          userId: updatedPayment.userId,
          action: 'PAYMENT_SUCCESS',
          details: {
            stripeIntentId: intent.id,
            amountPaise: intent.amount,
          },
        },
      });

     
      if (intent.metadata?.userId) {
        await sendNotification(
          intent.metadata.userId,
          `Payment successful!\nAmount: ₹${(intent.amount / 100).toFixed(
            2
          )}\nReceipt is available for download.`,
          'payment_success'
        );
      }
    }


    if (event.type === 'payment_intent.payment_failed') {
      // Idempotency guard
      if (payment.status === 'FAILED') {
        return res.sendStatus(200);
      }

      await prisma.payment.update({
        where: { stripePaymentIntentId: intent.id },
        data: { status: 'FAILED' },
      });

      await prisma.auditLog.create({
        data: {
          userId: payment.userId,
          action: 'PAYMENT_FAILED',
          details: {
            stripeIntentId: intent.id,
            reason: intent.last_payment_error?.message,
          },
        },
      });

      if (intent.metadata?.userId) {
        await sendNotification(
          intent.metadata.userId,
          'Payment failed. Please retry from the kiosk/app.',
          'payment_failed'
        );
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}


module.exports = {
  createPaymentIntentHandler,
  getMyPayments,
  stripeWebhook,
};
