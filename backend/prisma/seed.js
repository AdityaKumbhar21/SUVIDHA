const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_MOBILE = '+919876543210';

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { mobile: DEMO_MOBILE },
  });

  if (existingUser) {
    await prisma.feedback.deleteMany({ where: { userId: existingUser.id } });
    await prisma.notification.deleteMany({ where: { userId: existingUser.id } });
    await prisma.payment.deleteMany({ where: { userId: existingUser.id } });
    await prisma.complaint.deleteMany({ where: { userId: existingUser.id } });
    await prisma.utilityConnection.deleteMany({ where: { userId: existingUser.id } });
    await prisma.auditLog.deleteMany({ where: { userId: existingUser.id } });
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  const user = await prisma.user.create({
    data: {
      mobile: DEMO_MOBILE,
      name: 'Aditya Kumar',
      address: 'B-42, Shivaji Nagar, Near City Hospital',
      cityWard: 'Pune - Ward 15',
      role: 'CITIZEN',
    },
  });

  await prisma.utilityConnection.create({
    data: {
      userId: user.id,
      type: 'ELECTRICITY',
      consumerNumber: 'MHEB-2024-567890',
    },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      amountPaise: 186500,
      status: 'PENDING',
      stripePaymentIntentId: null,
      invoiceUrl: null,
    },
  });

  console.log("Data seeded successfully");
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
