const twilio = require('twilio');
const prisma = require('../lib/prisma');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = new Map();

async function sendOtp(mobile) {
  const cleanMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;

  let entry = otpStore.get(cleanMobile) || { attempts: 0 };
  if (entry.attempts >= 5) throw new Error('Too many OTP requests');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;

  await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${cleanMobile}`,
    body: `SUVIDHA OTP: ${otp} (valid 5 min)`,
  });

  otpStore.set(cleanMobile, { otp, expires, attempts: entry.attempts + 1 });
  setTimeout(() => otpStore.delete(cleanMobile), 6 * 60 * 1000);
}

function verifyOtp(mobile, otp) {
  const clean = mobile.startsWith('+') ? mobile : `+91${mobile}`;
  const entry = otpStore.get(clean);
  if (!entry || entry.expires < Date.now() || entry.otp !== otp) return false;

  otpStore.delete(clean);
  return true;
}

async function sendNotification(userId, message, type = 'update') {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mobile: true },
  });

  if (!user) return;

  const cleanMobile = user.mobile.startsWith('+') ? user.mobile : `+91${user.mobile}`;

  const msg = await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${cleanMobile}`,
    body: message,
  });

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