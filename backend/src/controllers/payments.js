const prisma = require('../lib/prisma');
const { createPaymentIntent, constructWebhookEvent, confirmStripePayment } = require('../services/stripe');
const { sendNotification } = require('../services/twilio');
const { z } = require('zod');
const { generateReceipt } = require('../services/receipt');

const createIntentSchema = z.object({
  amountPaise: z.number().int().positive(),
  consumerNumber: z.string().min(1).max(50),
  complaintId: z.string().uuid().optional(),
  description: z.string().max(100).optional(),
});


async function createPaymentIntentHandler(req, res, next) {
  try {
    const { amountPaise, consumerNumber, complaintId, description } =
      createIntentSchema.parse(req.body);

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(amountPaise, {
        userId: req.user.id,
        consumerNumber,
        complaintId: complaintId || '',
        description: description || 'SUVIDHA service payment',
      });

    await prisma.payment.create({
      data: {
        userId: req.user.id,
        consumerNumber,
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


/**
 * Confirm a payment by paymentIntentId.
 * For kiosk flow: marks the PENDING payment as SUCCESS and returns receipt data.
 * In production this would be handled exclusively by the Stripe webhook.
 */
async function confirmPayment(req, res, next) {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'paymentIntentId is required' });
    }

    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (payment.status === 'SUCCESS') {
      return res.json({
        payment: {
          id: payment.id,
          amountPaise: Number(payment.amountPaise),
          status: payment.status,
          invoiceUrl: payment.invoiceUrl,
          createdAt: payment.createdAt,
          stripePaymentIntentId: payment.stripePaymentIntentId,
        },
      });
    }

    // Actually confirm the payment on Stripe using a test payment method
    try {
      await confirmStripePayment(paymentIntentId);
    } catch (stripeErr) {
      console.error('Stripe confirmation failed:', stripeErr.message);
      return res.status(400).json({ message: 'Payment confirmation failed with Stripe: ' + stripeErr.message });
    }

    // Mark payment as SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: 'SUCCESS' },
    });

    // Generate receipt
    const user = await prisma.user.findUnique({
      where: { id: updatedPayment.userId },
    });

    let invoiceUrl = null;
    if (user) {
      try {
        invoiceUrl = await generateReceipt(updatedPayment, user);
        await prisma.payment.update({
          where: { id: updatedPayment.id },
          data: { invoiceUrl },
        });
      } catch (receiptErr) {
        console.error('Receipt generation failed:', receiptErr.message);
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: updatedPayment.userId,
        action: 'PAYMENT_SUCCESS',
        details: {
          stripeIntentId: paymentIntentId,
          amountPaise: Number(updatedPayment.amountPaise),
        },
      },
    });

    // Notify user
    await sendNotification(
      updatedPayment.userId,
      `Payment successful! Amount: ₹${(Number(updatedPayment.amountPaise) / 100).toFixed(2)}`,
      'payment_success'
    );

    res.json({
      payment: {
        id: updatedPayment.id,
        amountPaise: Number(updatedPayment.amountPaise),
        status: 'SUCCESS',
        invoiceUrl,
        createdAt: updatedPayment.createdAt,
        stripePaymentIntentId: paymentIntentId,
      },
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

    // Convert BigInt to Number for JSON serialization
    const serialized = payments.map(p => ({
      ...p,
      amountPaise: Number(p.amountPaise),
    }));

    res.json({ payments: serialized });
  } catch (err) {
    next(err);
  }
}


async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  try {
    
    const event = constructWebhookEvent(req.body, sig);

    
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
  confirmPayment,
  getMyPayments,
  stripeWebhook,
};
