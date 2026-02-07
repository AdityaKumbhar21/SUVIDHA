const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createPaymentIntentHandler,
  confirmPayment,
  getMyPayments,
  stripeWebhook,
} = require('../controllers/payments');

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

router.use(authMiddleware);
router.post('/create-intent', createPaymentIntentHandler);
router.post('/confirm', confirmPayment);
router.get('/my', getMyPayments);

module.exports = router;
