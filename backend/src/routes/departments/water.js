const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../../middleware/auth');
const {
  payWaterBill,
  raiseNoWaterComplaint,
  raiseLowPressureComplaint,
  raiseWaterMeterIssue,
  requestNewWaterConnection,
} = require('../../controllers/departments/water.controller');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  },
});

router.use(authMiddleware);
router.post('/pay-bill', payWaterBill);
router.post(
  '/complaints/no-supply',
  upload.single('photo'),
  raiseNoWaterComplaint
);
router.post('/complaints/low-pressure', raiseLowPressureComplaint);
router.post('/complaints/meter', raiseWaterMeterIssue);
router.post('/requests/new-connection', requestNewWaterConnection);

module.exports = router;
