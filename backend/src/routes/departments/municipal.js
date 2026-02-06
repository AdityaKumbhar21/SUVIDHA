const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../../middleware/auth');
const {
  payPropertyTax,
  requestBirthCertificate,
  requestDeathCertificate,
  submitMunicipalGrievance,
} = require('../../controllers/departments/municipal');

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
router.post('/pay-property-tax', payPropertyTax);
router.post(
  '/certificates/birth',
  upload.single('document'),
  requestBirthCertificate
);
router.post(
  '/certificates/death',
  upload.single('document'),
  requestDeathCertificate
);

router.post(
  '/complaints/grievance',
  upload.single('photo'),
  submitMunicipalGrievance
);

module.exports = router;
