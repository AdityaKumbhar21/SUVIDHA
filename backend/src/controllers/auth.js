const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { sendOtp, verifyOtp } = require('../services/otp');
const { validate, sendOtpSchema, verifyOtpSchema } = require('../lib/validators');
const { UnauthorizedError } = require('../lib/customError');

const sendOtpHandler = [
  validate(sendOtpSchema),
  async (req, res, next) => {
    try {
      await sendOtp(req.validated.mobile);
      res.json({ 
        success: true,
        message: 'OTP sent successfully' 
      });
    } catch (err) {
      next(err);
    }
  },
];

const verifyOtpHandler = [
  validate(verifyOtpSchema),
  async (req, res, next) => {
    try {
      const { mobile, otp } = req.validated;

      const isValid = await verifyOtp(mobile, otp);
      if (!isValid) throw new UnauthorizedError('Invalid OTP');

      let user = await prisma.user.findUnique({
        where: { mobile },
        select: {
          id: true,
          mobile: true,
          name: true,
          address: true,
          cityWard: true,
          role: true,
        },
      });

      let isNewUser = false;
      if (!user) {
        user = await prisma.user.create({
          data: { mobile, role: 'CITIZEN' },
        });
        isNewUser = true;
      }

      const isProfileComplete = !!(user.name && user.address);

      const token = jwt.sign(
        { id: user.id, role: user.role, mobile: user.mobile },
        process.env.JWT_SECRET,
        { expiresIn: '60m' }
      );

      res.json({
        success: true,
        token,
        userId: user.id,
        isNewUser,
        isProfileComplete,
        user: {
          name: user.name,
          mobile: user.mobile,
          address: user.address,
          cityWard: user.cityWard,
          role: user.role,
        },
        message: 'Authentication successful',
      });
    } catch (err) {
      next(err);
    }
  },
];

module.exports = {
  sendOtpHandler,
  verifyOtpHandler,
};
