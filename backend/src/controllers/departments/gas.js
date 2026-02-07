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
  NEW_CONNECTION: 'GENERAL',
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

    res.json({ clientSecret, paymentIntentId });
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
    const pendingPayments = await prisma.payment.findMany({
      where: { userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, amountPaise: true, status: true, createdAt: true },
    });
    res.json({
      connections: connections.map(c => c.consumerNumber),
      pendingBills: pendingPayments.map(p => ({
        id: p.id,
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
  payGasBill,
  raiseGasLeakageComplaint,
  raiseCylinderIssue,
  requestNewGasConnection,
  getPendingBills,
};
