const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../../middleware/auth');
const {
  raiseMissedPickupComplaint,
  raiseOverflowingBinComplaint,
  requestBulkWastePickup,
  reportDeadAnimal,
} = require('../../controllers/departments/waste');

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
router.post(
  '/complaints/missed-pickup',
  upload.single('photo'),
  raiseMissedPickupComplaint
);
router.post(
  '/complaints/overflow',
  upload.single('photo'),
  raiseOverflowingBinComplaint
);

router.post(
  '/complaints/dead-animal',
  upload.single('photo'),
  reportDeadAnimal
);
router.post('/requests/bulk-pickup', requestBulkWastePickup);

module.exports = router;
