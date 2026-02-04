const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require('../controllers/complaint');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


router.use(authMiddleware);


router.post(
  '/',
  upload.single('photo'),
  createComplaint
);
router.get('/my', getMyComplaints);
router.get('/:id', getComplaintById);

module.exports = router;
