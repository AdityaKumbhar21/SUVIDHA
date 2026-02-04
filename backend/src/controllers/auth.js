// src/controllers/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { sendOtp, verifyOtp } = require('../services/twilio');
const { sendOtpSchema, verifyOtpSchema, validate } = require('../utils/validators');
const { BadRequestError, UnauthorizedError } = require('../utils/customError');

const sendOtpHandler = [
  validate(sendOtpSchema),
  async (req, res, next) => {
    try {
      const { mobile } = req.validated;
      await sendOtp(mobile);
      res.status(200).json({ message: 'OTP sent successfully' });
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

      const isValid = verifyOtp(mobile, otp);
      if (!isValid) {
        throw new UnauthorizedError('Invalid or expired OTP');
      }

      let user = await prisma.user.findUnique({
        where: { mobile },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            mobile,
            role: 'CITIZEN',
          },
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          mobile: user.mobile,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '60m' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          mobile: user.mobile,
          role: user.role,
        },
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