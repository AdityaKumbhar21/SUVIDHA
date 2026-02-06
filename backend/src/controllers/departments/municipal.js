const prisma = require('../../lib/prisma');
const { createPaymentIntent } = require('../../services/stripe');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');
const { z } = require('zod');

const Department = 'MUNICIPAL';



const propertyTaxSchema = z.object({
  propertyId: z.string(),
  amountPaise: z.number().int().positive(),
});

const grievanceSchema = z.object({
  description: z.string().min(10),
  location: z.string().optional(),
});



async function payPropertyTax(req, res, next) {
  try {
    const { propertyId, amountPaise } = propertyTaxSchema.parse(req.body);

    const { clientSecret, paymentIntentId } =
      await createPaymentIntent(amountPaise, {
        userId: req.user.id,
        propertyId,
        service: 'PROPERTY_TAX',
      });

    res.json({ clientSecret, paymentIntentId });
  } catch (err) {
    next(err);
  }
}

async function submitMunicipalGrievance(req, res, next) {
  try {
    const { description, location } = grievanceSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/municipal/grievance'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'GENERAL',
        description,
        location,
        photoUrl,
        priority: 'MEDIUM',
        etaMinutes: 2880,
      },
    });

    await sendNotification(
      req.user.id,
      `Municipal grievance submitted (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  payPropertyTax,
  submitMunicipalGrievance,
};
