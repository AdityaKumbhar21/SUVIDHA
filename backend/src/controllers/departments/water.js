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
        connectionId,
        service: 'WATER_BILL',
      });

    res.json({ clientSecret, paymentIntentId });
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

module.exports = {
  payWaterBill,
  raiseNoWaterComplaint,
};
