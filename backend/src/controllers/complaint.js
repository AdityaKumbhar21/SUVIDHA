const prisma = require('../lib/prisma');
const { classifyComplaint } = require('../services/gemini');
const { sendNotification } = require('../services/notification');
const { uploadToCloudinary } = require('../services/upload');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/customError');
const {
  createComplaintSchema,
  getComplaintParams,
  validate,
} = require('../utils/validators');


async function createComplaint(req, res, next) {
  try {
    const validated = createComplaintSchema.parse(req.body);
    const {
      description,
      location,
      department,
      complaintType,
      language = 'en',
    } = validated;

    if (!description || description.length < 10) {
      throw new BadRequestError('Complaint description is too short');
    }

    // ---------------------------
    // Photo Upload (Cloudinary)
    // ---------------------------
    let photoUrl = null;

    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        `suvidha/complaints/${req.user.id}`
      );
    }

   
    const ai = await classifyComplaint(description, language);

    const finalDepartment = department ?? ai.department;
    const finalType = complaintType ?? ai.complaintType;

    if (!finalDepartment || !finalType) {
      throw new BadRequestError('Unable to classify complaint');
    }

  
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
        priority: ai.priority,
        etaMinutes: ai.etaMinutes,
        status: 'SUBMITTED',
      },
    });


    await sendNotification(
      req.user.id,
      `Complaint registered successfully.
ID: ${complaint.id}
Department: ${complaint.department}
ETA: ${Math.ceil(complaint.etaMinutes / 60)} hours`,
      'complaint_created'
    );

    return res.status(201).json({
      message: 'Complaint created successfully',
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


async function getMyComplaints(req, res, next) {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        department: true,
        complaintType: true,
        description: true,
        status: true,
        priority: true,
        etaMinutes: true,
        location: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(complaints);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /complaints/:id
 */
const getComplaintById = [
  validate(getComplaintParams),
  async (req, res, next) => {
    try {
      const { id } = req.validated;

      const complaint = await prisma.complaint.findUnique({
        where: { id },
        include: {
          payment: {
            select: {
              status: true,
              amountPaise: true,
            },
          },
        },
      });

      if (!complaint) {
        throw new NotFoundError('Complaint not found');
      }

      if (
        complaint.userId !== req.user.id &&
        req.user.role !== 'ADMIN'
      ) {
        throw new ForbiddenError(
          'You are not allowed to view this complaint'
        );
      }

      res.status(200).json(complaint);
    } catch (err) {
      next(err);
    }
  },
];

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
};
