const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createPaymentIntentHandler,
  confirmPayment,
  getMyPayments,
} = require('../controllers/payments');

const router = express.Router();


router.use(authMiddleware);
router.post('/create-intent', createPaymentIntentHandler);
router.post('/confirm', confirmPayment);
router.get('/my', getMyPayments);

module.exports = router;
