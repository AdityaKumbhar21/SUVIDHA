const prisma = require('../../lib/prisma');
const { classifyComplaint } = require('../../services/gemini');
const { createPaymentIntent } = require('../../services/stripe');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');

const {
  billPaymentSchema,
  outageComplaintSchema,
  meterIssueSchema,
  loadChangeSchema,
  newConnectionSchema,
} = require('../../lib/validators');

const { Department, ComplaintType } = require('../../constants/enums');



async function payBill(req, res, next) {
  try {
    const { consumerNumber, amountPaise } = billPaymentSchema.parse(req.body);
    const finalAmount = amountPaise || 45000;

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(finalAmount, {
        userId: req.user.id,
        service: 'ELECTRICITY_BILL',
        consumerNumber,
      });

    await sendNotification(
      req.user.id,
      `Electricity bill payment initiated for ${consumerNumber}.`,
      'payment_initiated'
    );

    res.json({ clientSecret, paymentIntentId });
  } catch (err) {
    next(err);
  }
}


async function raiseOutageComplaint(req, res, next) {
  try {
    const { description, location } =
      outageComplaintSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        `suvidha/electricity/outages`
      );
    }

    const ai = await classifyComplaint(description);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department.ELECTRICITY,
        complaintType: ComplaintType.OUTAGE,
        description,
        location,
        photoUrl,
        priority: ai.priority || 'CRITICAL',
        etaMinutes: ai.etaMinutes || 120,
      },
    });

    await sendNotification(
      req.user.id,
      `Power outage complaint registered (#${complaint.id})`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────────────────────────

async function raiseMeterIssue(req, res, next) {
  try {
    const { description, consumerNumber } =
      meterIssueSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department.ELECTRICITY,
        complaintType: ComplaintType.METER_ISSUE,
        description,
        location: consumerNumber
          ? `Consumer: ${consumerNumber}`
          : undefined,
        priority: 'MEDIUM',
        etaMinutes: 1440,
      },
    });

    await sendNotification(
      req.user.id,
      `Meter issue complaint submitted (#${complaint.id})`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}


async function requestLoadChange(req, res, next) {
  try {
    const { requestedLoad, currentLoad, reason } = loadChangeSchema.parse(req.body);

    const description = `Load change request: from ${currentLoad || 'unknown'} kW to ${requestedLoad} kW. Reason: ${reason}`;

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: 'ELECTRICITY',
        complaintType: 'LOAD_CHANGE',
        description,
        priority: 'LOW',
        etaMinutes: 4320, // ~3 days
        status: 'SUBMITTED',
      },
    });

    await sendNotification(
      req.user.id,
      `Load change request #${complaint.id} submitted.\n` +
      `Requested: ${requestedLoad} kW`,
      'request_submitted'
    );

    res.status(201).json({ success: true, complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function requestNewConnection(req, res, next) {
  try {
    const { address, loadRequired } = newConnectionSchema.parse(req.body);

    const description = `New electricity connection request at ${address}. Required load: ${loadRequired} kW`;

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: 'ELECTRICITY',
        complaintType: 'NEW_CONNECTION',
        description,
        location: address,
        priority: 'MEDIUM',
        etaMinutes: 10080, 
        status: 'SUBMITTED',
      },
    });

    await sendNotification(
      req.user.id,
      `New connection request #${complaint.id} registered.\n` +
      `Location: ${address}\nEstimated processing: ~7 days`,
      'request_submitted'
    );

    res.status(201).json({ success: true, complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  payBill,
  raiseOutageComplaint,
  raiseMeterIssue,
  requestLoadChange,
  requestNewConnection,
};