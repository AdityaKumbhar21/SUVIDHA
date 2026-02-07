const prisma = require('../../lib/prisma');
const { sendNotification } = require('../../services/twilio');
const { uploadToCloudinary } = require('../../services/upload');
const { z } = require('zod');

const Department = 'WASTE';



const wasteSchema = z.object({
  description: z.string().min(5),
  location: z.string().optional(),
});



async function raiseMissedPickupComplaint(req, res, next) {
  try {
    const { description, location } = wasteSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/waste/missed-pickup'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'MISSED_PICKUP',
        description,
        location,
        photoUrl,
        priority: 'MEDIUM',
        etaMinutes: 1440,
      },
    });

    await sendNotification(
      req.user.id,
      `Garbage pickup complaint registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function raiseOverflowingBinComplaint(req, res, next) {
  try {
    const { description, location } = wasteSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/waste/overflow'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'OVERFLOW',
        description,
        location,
        photoUrl,
        priority: 'HIGH',
        etaMinutes: 720,
      },
    });

    await sendNotification(
      req.user.id,
      `Overflowing bin complaint registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function reportDeadAnimal(req, res, next) {
  try {
    const { description, location } = wasteSchema.parse(req.body);

    let photoUrl = null;
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        'suvidha/waste/dead-animal'
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'GENERAL',
        description: `Dead animal report: ${description}`,
        location,
        photoUrl,
        priority: 'CRITICAL',
        etaMinutes: 180,
      },
    });

    await sendNotification(
      req.user.id,
      `Dead animal report registered (#${complaint.id}).`,
      'complaint_created'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

async function requestBulkWastePickup(req, res, next) {
  try {
    const bulkSchema = z.object({
      address: z.string().min(10),
      description: z.string().min(5),
    });
    const { address, description } = bulkSchema.parse(req.body);

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        department: Department,
        complaintType: 'GENERAL',
        description: `Bulk waste pickup: ${description}`,
        location: address,
        priority: 'LOW',
        etaMinutes: 2880,
      },
    });

    await sendNotification(
      req.user.id,
      `Bulk waste pickup request submitted (#${complaint.id}).`,
      'request_submitted'
    );

    res.status(201).json({ complaintId: complaint.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  raiseMissedPickupComplaint,
  raiseOverflowingBinComplaint,
  reportDeadAnimal,
  requestBulkWastePickup,
};
