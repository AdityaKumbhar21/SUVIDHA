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

async function requestBirthCertificate(req, res, next) {
  try {
    const certSchema = z.object({
      childName: z.string().min(2),
      dateOfBirth: z.string(),
      placeOfBirth: z.string(),
    });
    const { childName, dateOfBirth, placeOfBirth } = certSchema.parse(req.body);

    let documentUrl = null;
    if (req.file?.buffer) {
      documentUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/municipal/birth-cert'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'CERTIFICATE',
        description: `Birth certificate request for ${childName}, DOB: ${dateOfBirth}, Place: ${placeOfBirth}`,
        photoUrl: documentUrl,
        priority: 'LOW',
        etaMinutes: 10080,
      },
    });

    await sendNotification(
      req.user.id,
      `Birth certificate request submitted (#${complaint.id}).`,
      'request_submitted'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function requestDeathCertificate(req, res, next) {
  try {
    const certSchema = z.object({
      deceasedName: z.string().min(2),
      dateOfDeath: z.string(),
      placeOfDeath: z.string(),
    });
    const { deceasedName, dateOfDeath, placeOfDeath } = certSchema.parse(req.body);

    let documentUrl = null;
    if (req.file?.buffer) {
      documentUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/municipal/death-cert'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'CERTIFICATE',
        description: `Death certificate request for ${deceasedName}, Date: ${dateOfDeath}, Place: ${placeOfDeath}`,
        photoUrl: documentUrl,
        priority: 'LOW',
        etaMinutes: 10080,
      },
    });

    await sendNotification(
      req.user.id,
      `Death certificate request submitted (#${complaint.id}).`,
      'request_submitted'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  payPropertyTax,
  submitMunicipalGrievance,
  requestBirthCertificate,
  requestDeathCertificate,
};
