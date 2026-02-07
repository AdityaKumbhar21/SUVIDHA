const prisma = require('../../lib/prisma');
const { NotFoundError, BadRequestError } = require('../../lib/customError');
const { assignSchema, statusSchema } = require('../../lib/validators');


async function listComplaints(req, res, next) {
  try {
    const { status, department, priority } = req.query;

    const complaints = await prisma.complaint.findMany({
      where: {
        status: status || undefined,
        department: department || undefined,
        priority: priority || undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, mobile: true } },
      },
    });

    res.json({ complaints });
  } catch (err) {
    next(err);
  }
}



async function getComplaintDetails(req, res, next) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, mobile: true } },
        payment: true,
        feedback: true,
      },
    });

    if (!complaint) throw new NotFoundError('Complaint not found');

    res.json(complaint);
  } catch (err) {
    next(err);
  }
}



async function assignComplaint(req, res, next) {
  try {
    const { officerName } = assignSchema.parse(req.body);

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        status: 'ASSIGNED',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'COMPLAINT_ASSIGNED',
        details: { complaintId: complaint.id, officerName },
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}



async function updateComplaintStatus(req, res, next) {
  try {
    const { status, remarks } = statusSchema.parse(req.body);

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'COMPLAINT_STATUS_UPDATED',
        details: { complaintId: complaint.id, status, remarks },
      },
    });

    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listComplaints,
  getComplaintDetails,
  assignComplaint,
  updateComplaintStatus,
};
