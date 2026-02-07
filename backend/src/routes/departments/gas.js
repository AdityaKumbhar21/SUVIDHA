const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../../middleware/auth');
const {
  payGasBill,
  raiseGasLeakageComplaint,
  raiseCylinderIssue,
  requestNewGasConnection,
  getPendingBills,
} = require('../../controllers/departments/gas');

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

router.get('/pending-bills', getPendingBills);
router.post('/pay-bill', payGasBill);


router.post(
  '/complaints/leakage',
  upload.single('photo'),
  raiseGasLeakageComplaint
);


router.post('/complaints/cylinder', raiseCylinderIssue);
router.post('/requests/new-connection', requestNewGasConnection);

module.exports = router;
