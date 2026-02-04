
const { z } = require('zod');

const sendOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^\+?\d{10,13}$/, 'Invalid mobile number format')
    .transform((val) => (val.startsWith('+') ? val : `+91${val}`)),
});

const verifyOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^\+?\d{10,13}$/, 'Invalid mobile number format')
    .transform((val) => (val.startsWith('+') ? val : `+91${val}`)),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/),
});



const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120).optional(),
  address: z.string().min(5, 'Address too short').max(500).optional(),
  cityWard: z.string().max(100).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

const addConnectionSchema = z.object({
  type: z.enum([
    'ELECTRICITY',
    'GAS',
    'WATER',
    'WASTE',
    'MUNICIPAL',
  ]),
  consumerNumber: z.string().min(5).max(100),
});



function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (err) {
      const issues = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: issues,
      });
    }
  };
}


const createComplaintSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  location: z.string().max(200).optional(),
  department: z.enum([
    'ELECTRICITY',
    'GAS',
    'WATER',
    'WASTE',
    'MUNICIPAL'
  ]).optional(), 
  complaintType: z.enum([
    'BILLING',
    'OUTAGE',
    'LEAKAGE',
    'NO_SUPPLY',
    'LOW_PRESSURE',
    'METER_ISSUE',
    'MISSED_PICKUP',
    'OVERFLOW',
    'CERTIFICATE',
    'GENERAL'
  ]).optional(), 
  language: z.string().default('en').optional(),
});

const getComplaintParams = z.object({
  id: z.string().uuid('Invalid complaint ID'),
});



module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
  profileUpdateSchema,
  addConnectionSchema,
  validate,
  createComplaintSchema,
  getComplaintParams,
};