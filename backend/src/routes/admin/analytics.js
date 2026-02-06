const express = require('express');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');
const {
  getComplaintStats,
  getSlaStats,
  getPaymentStats,
} = require('../../controllers/admin/analytics.controller');

const router = express.Router();

// Admin only
router.use(authMiddleware, adminMiddleware);


router.get('/complaints', getComplaintStats);


router.get('/sla', getSlaStats);


router.get('/payments', getPaymentStats);

module.exports = router;
