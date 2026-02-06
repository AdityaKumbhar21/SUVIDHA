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

module.exports = {
  raiseMissedPickupComplaint,
};
