const prisma = require('../../lib/prisma');
const { createPaymentIntent } = require('../../services/stripe');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');
const { classifyComplaint } = require('../../services/gemini');
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

    sendNotification(
      req.user.id,
      `Property tax payment initiated for ${propertyId}. Amount: ₹${(amountPaise / 100).toFixed(0)}.`,
      'payment_initiated'
    ).catch(() => {});

    res.json({ clientSecret, paymentIntentId });
  } catch (err) {
    next(err);
  }
}

async function submitMunicipalGrievance(req, res, next) {
  try {
    const { description, location } = grievanceSchema.parse(req.body);
    const language = req.headers['x-language'] || 'en';

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/municipal/grievance'
      );
    }

    // AI Classification
    const ai = await classifyComplaint(description, language);

    const finalDepartment = ai.department || Department;
    const finalType = ai.complaintType || 'GENERAL';
    const finalPriority = ai.priority || 'MEDIUM';
    const finalEta = ai.etaMinutes || 2880;

    // Check for duplicate
    const recentSimilar = await prisma.complaint.findFirst({
      where: {
        userId: req.user.id,
        department: finalDepartment,
        complaintType: finalType,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    if (recentSimilar || ai.isDuplicateLikely) {
      return res.status(409).json({
        error: 'Possible duplicate complaint detected',
        existingComplaintId: recentSimilar?.id,
      });
    }

    let finalLocation = location;
    if (!finalLocation) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { address: true },
      });
      finalLocation = user?.address ?? 'Unknown';
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: finalDepartment,
        complaintType: finalType,
        description,
        location: finalLocation,
        photoUrl,
        priority: finalPriority,
        etaMinutes: finalEta,
        status: 'SUBMITTED',
      },
    });

    await sendNotification(
      req.user.id,
      `Municipal grievance submitted (#${complaint.id}). Priority: ${finalPriority}. ETA: ${Math.ceil(finalEta / 60)} hours.`,
      'complaint_created'
    );

    res.status(201).json({
      complaintId: complaint.id,
      complaint: {
        id: complaint.id,
        department: complaint.department,
        complaintType: complaint.complaintType,
        status: complaint.status,
        priority: complaint.priority,
        etaMinutes: complaint.etaMinutes,
        createdAt: complaint.createdAt,
      },
    });
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
