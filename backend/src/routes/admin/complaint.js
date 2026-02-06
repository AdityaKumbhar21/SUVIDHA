const express = require('express');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');

const {
  listComplaints,
  getComplaintDetails,
  assignComplaint,
  updateComplaintStatus,
} = require('../../controllers/admin/complaints.controller');

const router = express.Router();

// Admin only
router.use(authMiddleware, adminMiddleware);
router.get('/', listComplaints);
router.get('/:id', getComplaintDetails);
router.put('/:id/assign', assignComplaint);
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
