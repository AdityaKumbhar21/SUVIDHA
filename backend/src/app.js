require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/error');
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaint');
const electricityRoutes = require('./routes/departments/electricity');
const gasRoutes = require('./routes/departments/gas');
const waterRoutes = require('./routes/departments/water');
const wasteRoutes = require('./routes/departments/waste');
const municipalRoutes = require('./routes/departments/municipal');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payment');
const adminComplaintRoutes = require('./routes/admin/complaint');
const adminAnalyticsRoutes = require('./routes/admin/analytics');
const { languageMiddleware } = require('./middleware/language');
const { stripeWebhook } = require('./controllers/payments');



const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
)
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);


app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'SUVIDHA API',
    timestamp: new Date().toISOString(),
  });
});


app.use(languageMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/electricity', electricityRoutes);
app.use('/api/gas', gasRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/municipal', municipalRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SUVIDHA backend running on port ${PORT}`);
});