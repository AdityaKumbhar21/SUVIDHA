const prisma = require('../../lib/prisma');


async function getComplaintStats(req, res, next) {
  try {
    const total = await prisma.complaint.count();

    const byStatus = await prisma.complaint.groupBy({
      by: ['status'],
      _count: true,
    });

    const byDepartment = await prisma.complaint.groupBy({
      by: ['department'],
      _count: true,
    });

    const byPriority = await prisma.complaint.groupBy({
      by: ['priority'],
      _count: true,
    });

    res.json({
      total,
      byStatus,
      byDepartment,
      byPriority,
    });
  } catch (err) {
    next(err);
  }
}


async function getSlaStats(req, res, next) {
  try {
    const now = new Date();

    const breached = await prisma.complaint.findMany({
      where: {
        status: { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] },
        createdAt: {
          lt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        department: true,
        priority: true,
        etaMinutes: true,
        createdAt: true,
      },
    });

    res.json({
      breachedCount: breached.length,
      breached,
    });
  } catch (err) {
    next(err);
  }
}

async function getPaymentStats(req, res, next) {
  try {
    const totalPayments = await prisma.payment.count();

    const successfulPayments = await prisma.payment.count({
      where: { status: 'SUCCESS' },
    });

    const failedPayments = await prisma.payment.count({
      where: { status: 'FAILED' },
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amountPaise: true },
    });

    res.json({
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenuePaise: totalRevenue._sum.amountPaise || 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getComplaintStats,
  getSlaStats,
  getPaymentStats,
};
