const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 10000, // 10 seconds
});



function sanitizeMetadata(metadata = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null) continue;
    clean[key] = String(value).slice(0, 500);
  }
  return clean;
}



async function createPaymentIntent(amountPaise, metadata = {}) {
  if (!Number.isInteger(amountPaise) || amountPaise < 100) {
    throw new Error('Invalid amount (must be >= 100 paise)');
  }

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: amountPaise,
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
        metadata: sanitizeMetadata(metadata),
      },
      {
       
        idempotencyKey: `suvidha_${metadata.userId || 'anon'}_${Date.now()}`,
      }
    );

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  } catch (err) {
    console.error('Stripe create intent error:', err.message);
    throw new Error('Failed to create payment intent');
  }
}


function constructWebhookEvent(rawBody, signature) {
  if (!signature) {
    throw new Error('Missing Stripe signature');
  }

  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook verification failed:', err.message);
    throw new Error('Invalid Stripe webhook signature');
  }
}

module.exports = {
  createPaymentIntent,
  constructWebhookEvent,
};
