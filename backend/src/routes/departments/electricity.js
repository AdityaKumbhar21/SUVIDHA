const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../../middleware/auth');
const {
  payBill,
  raiseOutageComplaint,
  raiseMeterIssue,
  requestLoadChange,
  requestNewConnection,
} = require('../../controllers/departments/electricity.controller');

const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});


router.use(authMiddleware);


router.post('/pay-bill', payBill);
router.post(
  '/complaints/outage',
  upload.single('photo'),
  raiseOutageComplaint
);


router.post('/complaints/meter', raiseMeterIssue);
router.post('/requests/load-change', requestLoadChange);
router.post('/requests/new-connection', requestNewConnection);

module.exports = router;
