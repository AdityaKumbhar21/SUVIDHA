// src/controllers/profile.js
const prisma = require('../lib/prisma');
const { NotFoundError, ConflictError } = require('../utils/customError');
const {
  profileUpdateSchema,
  addConnectionSchema,
  validate,
} = require('../utils/validators');


async function getMyProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        mobile: true,
        name: true,
        address: true,
        cityWard: true,
        createdAt: true,
        updatedAt: true,
        utilityConnections: {
          select: {
            id: true,
            type: true,
            consumerNumber: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('Profile not found');
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}


const updateProfile = [
  validate(profileUpdateSchema),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, address, cityWard } = req.validated;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          address,
          cityWard,
        },
        select: {
          id: true,
          mobile: true,
          name: true,
          address: true,
          cityWard: true,
          updatedAt: true,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  },
];


const addUtilityConnection = [
  validate(addConnectionSchema),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { type, consumerNumber } = req.validated;

      const existing = await prisma.utilityConnection.findUnique({
        where: {
          userId_type_consumerNumber: {
            userId,
            type,
            consumerNumber,
          },
        },
      });

      if (existing) {
        throw new ConflictError('This utility connection is already linked');
      }

      const connection = await prisma.utilityConnection.create({
        data: {
          userId,
          type,
          consumerNumber,
        },
        select: {
          id: true,
          type: true,
          consumerNumber: true,
          createdAt: true,
        },
      });

      return res.status(201).json(connection);
    } catch (err) {
      next(err);
    }
  },
];

module.exports = {
  getMyProfile,
  updateProfile,
  addUtilityConnection,
};
