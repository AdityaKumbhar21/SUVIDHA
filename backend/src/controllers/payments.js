const prisma = require('../lib/prisma');
const { createPaymentIntent, constructWebhookEvent } = require('../services/stripe');
const { sendNotification } = require('../services/twilio');
const { z } = require('zod');

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

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;

      // 1) Update payment
      const payment = await prisma.payment.update({
        where: { stripePaymentIntentId: intent.id },
        data: {
          status: 'SUCCESS',
          invoiceUrl: `https://example.com/invoice/${intent.id}`, 
        },
      });

      
      if (payment.complaintId) {
        await prisma.complaint.update({
          where: { id: payment.complaintId },
          data: { status: 'IN_PROGRESS' },
        });
      }

      
      if (intent.metadata?.userId) {
        await sendNotification(
          intent.metadata.userId,
          `Payment successful!\nAmount: ₹${(intent.amount / 100).toFixed(2)}.\nThank you for using SUVIDHA.`,
          'payment_success'
        );
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object;

      await prisma.payment.update({
        where: { stripePaymentIntentId: intent.id },
        data: { status: 'FAILED' },
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
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}


module.exports = {
  createPaymentIntentHandler,
  getMyPayments,
  stripeWebhook,
};
