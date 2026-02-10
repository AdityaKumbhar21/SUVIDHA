const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.utilityConnection.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      mobile: '+919028432689',
      name: 'Aditya Kumar',
      address: 'Flat 12, Green Valley Society, Kothrud',
      cityWard: 'Pune - Ward 8',
      role: 'CITIZEN',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      mobile: '+919999888877',
      name: 'Rahul Sharma',
      address: '45, Shivaji Nagar, Near Station Road',
      cityWard: 'Pune - Ward 3',
      role: 'CITIZEN',
    },
  });

  await prisma.utilityConnection.createMany({
    data: [
      {
        userId: user1.id,
        type: 'ELECTRICITY',
        consumerNumber: '202456789012',
      },
      {
        userId: user2.id,
        type: 'ELECTRICITY',
        consumerNumber: '202456789013',
      },
      {
        userId: user1.id,
        type: 'WATER',
        consumerNumber: '5566778899',
      },
      {
        userId: user1.id,
        type: 'GAS',
        consumerNumber: '900284326890',
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        userId: user1.id,
        consumerNumber: '202456789012',
        amountPaise: 186500,
        status: 'PENDING',
      },
      {
        userId: user2.id,
        consumerNumber: '202456789013',
        amountPaise: 243000,
        status: 'PENDING',
      },
      {
        userId: user1.id,
        consumerNumber: '5566778899',
        amountPaise: 42000,
        status: 'PENDING',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
