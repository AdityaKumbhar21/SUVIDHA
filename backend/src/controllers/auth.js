const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { sendOtp, verifyOtp } = require('../services/otp');
const { validate, sendOtpSchema, verifyOtpSchema } = require('../utils/validators');
const { UnauthorizedError } = require('../utils/customError');

const sendOtpHandler = [
  validate(sendOtpSchema),
  async (req, res, next) => {
    try {
      await sendOtp(req.validated.mobile);
      res.json({ message: 'OTP sent successfully' });
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

      let user = await prisma.user.findUnique({ where: { mobile } });

      if (!user) {
        user = await prisma.user.create({
          data: { mobile, role: 'CITIZEN' },
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, mobile: user.mobile },
        process.env.JWT_SECRET,
        { expiresIn: '60m' }
      );

      res.json({
        token,
        user: { id: user.id, mobile: user.mobile, role: user.role },
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
