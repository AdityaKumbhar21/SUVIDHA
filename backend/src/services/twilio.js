const twilio = require('twilio');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { BadRequestError } = require('../lib/customError');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Configuration from env
const USE_WHATSAPP = process.env.TWILIO_USE_WHATSAPP === 'true';
const SMS_FALLBACK = process.env.TWILIO_SMS_FALLBACK === 'true';
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || '+14155238886';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

function normalizeMobile(mobile) {
  return mobile.startsWith('+') ? mobile : `+91${mobile}`;
}

async function sendMessage(to, body) {
  const cleanTo = normalizeMobile(to);
  
  if (USE_WHATSAPP) {
    try {
      return await client.messages.create({
        from: `whatsapp:${WHATSAPP_FROM}`,
        to: `whatsapp:${cleanTo}`,
        body,
      });
    } catch (err) {
      if (SMS_FALLBACK) {
        console.log('WhatsApp failed, falling back to SMS:', err.message);
        return await client.messages.create({
          from: WHATSAPP_FROM,
          to: cleanTo,
          body,
        });
      }
      throw err;
    }
  } else {
    return await client.messages.create({
      from: WHATSAPP_FROM,
      to: cleanTo,
      body,
    });
  }
}

async function sendOtp(mobile) {
  const cleanMobile = normalizeMobile(mobile);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  console.log(otp);
  await prisma.otp.deleteMany({ where: { mobile: cleanMobile } });

  await prisma.otp.create({
    data: {
      mobile: cleanMobile,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  await sendMessage(cleanMobile, `SUVIDHA OTP: ${otp} (valid ${OTP_EXPIRY_MINUTES} min)`);
}

async function verifyOtp(mobile, otp) {
  const cleanMobile = normalizeMobile(mobile);

  const record = await prisma.otp.findFirst({
    where: { mobile: cleanMobile },
  });

  if (!record) throw new BadRequestError('OTP not found');

  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw new BadRequestError('OTP expired');
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw new BadRequestError('OTP locked due to too many attempts');
  }

  const valid = await bcrypt.compare(otp, record.otpHash);

  if (!valid) {
    await prisma.otp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.otp.delete({ where: { id: record.id } });
  return true;
}


async function sendNotification(userId, message, type = 'update') {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mobile: true },
  });

  if (!user) return;

  const msg = await sendMessage(user.mobile, message);

  await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      twilioSid: msg.sid,
      status: 'sent',
    },
  });
}

module.exports = { sendOtp, verifyOtp, sendNotification };