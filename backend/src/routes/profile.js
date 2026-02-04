const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getMyProfile,
  updateProfile,
  addUtilityConnection,
} = require('../controllers/profile');

const router = express.Router();

router.use(authMiddleware); 

router.get('/', getMyProfile);
router.patch('/', ...updateProfile);
router.post('/connections', ...addUtilityConnection);

module.exports = router;