const prisma = require('../../lib/prisma');
const { classifyComplaint } = require('../../services/gemini');
const { createPaymentIntent } = require('../../services/stripe');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');
const { z } = require('zod');

const Department = 'WATER';



const billSchema = z.object({
  connectionId: z.string().min(5),
  amountPaise: z.number().int().positive().optional(),
});

const complaintSchema = z.object({
  description: z.string().min(10),
  location: z.string().optional(),
});



async function payWaterBill(req, res, next) {
  try {
    const { connectionId, amountPaise } = billSchema.parse(req.body);
    const finalAmount = amountPaise || 25000;

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(finalAmount, {
        userId: req.user.id,
        consumerNumber: connectionId,
        service: 'WATER_BILL',
      });

    // Check for existing seeded pending payment
    let payment;
    const existingPending = await prisma.payment.findFirst({
      where: {
        userId: req.user.id,
        consumerNumber: connectionId,
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
          consumerNumber: connectionId,
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
      `Water bill payment initiated for consumer ${connectionId}. Amount: ₹${(finalAmount / 100).toFixed(0)}.`,
      'payment_initiated'
    ).catch(() => {});
  } catch (err) {
    next(err);
  }
}



async function raiseNoWaterComplaint(req, res, next) {
  try {
    const { description, location } = complaintSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/water/no-supply'
      );
    }

    const ai = await classifyComplaint(description);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'NO_SUPPLY',
        description,
        location,
        photoUrl,
        priority: ai.priority || 'HIGH',
        etaMinutes: ai.etaMinutes || 180,
      },
    });

    await sendNotification(
      req.user.id,
      `Water supply complaint registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function raiseLowPressureComplaint(req, res, next) {
  try {
    const { description, location } = complaintSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'LOW_PRESSURE',
        description,
        location,
        priority: 'MEDIUM',
        etaMinutes: 240,
      },
    });

    await sendNotification(
      req.user.id,
      `Low pressure complaint registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function raiseWaterMeterIssue(req, res, next) {
  try {
    const { description, location } = complaintSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'METER_ISSUE',
        description,
        location,
        priority: 'MEDIUM',
        etaMinutes: 480,
      },
    });

    await sendNotification(
      req.user.id,
      `Water meter issue registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function requestNewWaterConnection(req, res, next) {
  try {
    const addressSchema = z.object({ address: z.string().min(10) });
    const { address } = addressSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'GENERAL',
        description: `New water connection requested at ${address}`,
        location: address,
        priority: 'MEDIUM',
        etaMinutes: 10080,
      },
    });

    await sendNotification(
      req.user.id,
      `New water connection request submitted (#${complaint.id}).`,
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
      where: { userId, type: 'WATER' },
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

module.exports = {
  payWaterBill,
  raiseNoWaterComplaint,
  raiseLowPressureComplaint,
  raiseWaterMeterIssue,
  requestNewWaterConnection,
  getPendingBills,
};
