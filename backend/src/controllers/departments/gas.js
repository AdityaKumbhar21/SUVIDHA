const prisma = require('../../lib/prisma');
const { classifyComplaint } = require('../../services/gemini');
const { createPaymentIntent } = require('../../services/stripe');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');
const { z } = require('zod');

const Department = 'GAS';
const ComplaintType = {
  LEAKAGE: 'LEAKAGE',
  BILLING: 'BILLING',
  CYLINDER: 'GENERAL',
  NEW_CONNECTION: 'NEW_CONNECTION',
};



const billSchema = z.object({
  consumerNumber: z.string().min(5),
  amountPaise: z.number().int().positive().optional(),
});

const leakageSchema = z.object({
  description: z.string().min(10),
  location: z.string().optional(),
});

const newConnectionSchema = z.object({
  address: z.string().min(10),
});

const bookCylinderSchema = z.object({
  consumerNumber: z.string().min(5),
  provider: z.enum(['indane', 'hp', 'bharat']),
  deliveryAddress: z.string().min(5),
  cylinderType: z.string().optional(),
  paymentMode: z.enum(['PAY_ON_DELIVERY', 'PAY_NOW']),
});

const mobileSchema = z.object({
  mobile: z.string()
    .regex(/^\+?\d{10,13}$/, 'Invalid mobile number')
    .transform((val) => (val.startsWith('+') ? val : `+91${val}`)),
});



async function payGasBill(req, res, next) {
  try {
    const { consumerNumber, amountPaise } = billSchema.parse(req.body);
    const finalAmount = amountPaise || 35000;

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(finalAmount, {
        userId: req.user.id,
        consumerNumber,
        service: 'GAS_BILL',
      });

    // Check for existing seeded pending payment
    let payment;
    const existingPending = await prisma.payment.findFirst({
      where: {
        userId: req.user.id,
        consumerNumber,
        status: 'PENDING',
        stripePaymentIntentId: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPending) {
      payment = await prisma.payment.update({
        where: { id: existingPending.id },
        data: {
          amountPaise: finalAmount,
          stripePaymentIntentId: paymentIntentId,
        },
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          userId: req.user.id,
          consumerNumber,
          amountPaise: finalAmount,
          stripePaymentIntentId: paymentIntentId,
          status: 'PENDING',
        },
      });
    }

    res.json({
      clientSecret,
      paymentIntentId,
      paymentId: payment.id,
      amountPaise: Number(finalAmount),
    });

    // Fire-and-forget notification
    sendNotification(
      req.user.id,
      `Gas bill payment initiated for consumer ${consumerNumber}. Amount: ₹${(finalAmount / 100).toFixed(0)}.`,
      'payment_initiated'
    ).catch(() => {});
  } catch (err) {
    next(err);
  }
}



async function raiseGasLeakageComplaint(req, res, next) {
  try {
    const { description, location } = leakageSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/gas/leakage'
      );
    }

    const ai = await classifyComplaint(description);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: ComplaintType.LEAKAGE,
        description,
        location,
        photoUrl,
        priority: 'CRITICAL',
        etaMinutes: ai.etaMinutes || 60,
      },
    });

    await sendNotification(
      req.user.id,
      `Gas leakage complaint registered (#${complaint.id}). Emergency team alerted.`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function raiseCylinderIssue(req, res, next) {
  try {
    const cylinderSchema = z.object({
      description: z.string().min(10),
      consumerNumber: z.string().min(5).optional(),
    });
    const { description, consumerNumber } = cylinderSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: ComplaintType.CYLINDER,
        description: `${description}${consumerNumber ? ` (Consumer: ${consumerNumber})` : ''}`,
        priority: 'MEDIUM',
        etaMinutes: 480,
      },
    });

    await sendNotification(
      req.user.id,
      `Cylinder issue complaint registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}


async function requestNewGasConnection(req, res, next) {
  try {
    const { address } = newConnectionSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: ComplaintType.NEW_CONNECTION,
        description: `New gas connection requested at ${address}`,
        location: address,
        priority: 'MEDIUM',
        etaMinutes: 10080,
      },
    });

    await sendNotification(
      req.user.id,
      `New gas connection request submitted (#${complaint.id}).`,
      'request_submitted'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function getPendingBills(req, res, next) {
  try {
    const userId = req.user.id;
    const connections = await prisma.utilityConnection.findMany({
      where: { userId, type: 'GAS' },
      select: { consumerNumber: true },
    });
    const consumerNumbers = connections.map(c => c.consumerNumber);
    const pendingPayments = await prisma.payment.findMany({
      where: {
        userId,
        status: 'PENDING',
        consumerNumber: { in: consumerNumbers.length > 0 ? consumerNumbers : ['__none__'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, amountPaise: true, consumerNumber: true, status: true, createdAt: true },
    });
    res.json({
      connections: consumerNumbers,
      pendingBills: pendingPayments.map(p => ({
        id: p.id,
        consumerNumber: p.consumerNumber,
        amountPaise: Number(p.amountPaise),
        amountRupees: (Number(p.amountPaise) / 100).toFixed(2),
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function lookupByMobile(req, res, next) {
  try {
    const { mobile } = mobileSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { mobile },
      select: {
        id: true,
        name: true,
        mobile: true,
        address: true,
        utilityConnections: {
          where: { type: 'GAS' },
          select: { consumerNumber: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'No account found for this mobile number' });
    }

    if (user.utilityConnections.length === 0) {
      return res.status(404).json({ message: 'No gas connection linked to this account' });
    }

    res.json({
      name: user.name,
      mobile: user.mobile,
      address: user.address,
      gasConnections: user.utilityConnections.map(c => c.consumerNumber),
    });
  } catch (err) {
    next(err);
  }
}


async function bookCylinder(req, res, next) {
  try {
    const { consumerNumber, provider, deliveryAddress, cylinderType, paymentMode } =
      bookCylinderSchema.parse(req.body);

    const type = cylinderType || '14.2kg';
    const priceMap = { '14.2kg': 90300, '5kg': 45500, '19kg': 175000 };
    const amountPaise = priceMap[type] || 90300;

    const booking = await prisma.cylinderBooking.create({
      data: {
        userId: req.user.id,
        consumerNumber,
        provider,
        deliveryAddress,
        cylinderType: type,
        amountPaise,
        paymentMode,
        status: 'BOOKED',
      },
    });

    // If pay now, create a Stripe payment intent
    if (paymentMode === 'PAY_NOW') {
      const { clientSecret, paymentIntentId } = await createPaymentIntent(amountPaise, {
        userId: req.user.id,
        consumerNumber,
        service: 'GAS_CYLINDER',
      });

      await prisma.payment.create({
        data: {
          userId: req.user.id,
          consumerNumber,
          amountPaise,
          stripePaymentIntentId: paymentIntentId,
          status: 'PENDING',
        },
      });

      sendNotification(
        req.user.id,
        `Cylinder booked (#${booking.id}). ${provider.toUpperCase()} ${type} — Payment of ₹${(amountPaise / 100).toFixed(0)} processing online.`,
        'booking_confirmed'
      ).catch(() => {});

      return res.status(201).json({
        bookingId: booking.id,
        paymentMode: 'PAY_NOW',
        clientSecret,
        paymentIntentId,
        amountPaise: Number(amountPaise),
      });
    }

    // Pay on delivery — no Stripe needed
    await sendNotification(
      req.user.id,
      `Cylinder booking confirmed (#${booking.id}). ${provider.toUpperCase()} ${type} will be delivered to ${deliveryAddress}. Payment: ₹${(amountPaise / 100).toFixed(0)} on delivery.`,
      'booking_confirmed'
    );

    res.status(201).json({
      bookingId: booking.id,
      paymentMode: 'PAY_ON_DELIVERY',
      amountPaise: Number(amountPaise),
      estimatedDelivery: '2-3 days',
    });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  payGasBill,
  raiseGasLeakageComplaint,
  raiseCylinderIssue,
  requestNewGasConnection,
  getPendingBills,
  lookupByMobile,
  bookCylinder,
};
