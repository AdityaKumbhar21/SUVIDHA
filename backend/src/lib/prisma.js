const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
  if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
} else {
  prisma = global.prisma;
}

module.exports = prisma;