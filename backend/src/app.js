const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const providerRoutes = require('./routes/providerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((o) => o.trim());
  if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
    return callback(null, true);
  }
  if (allowed.includes(origin)) return callback(null, true);
  callback(new Error('Not allowed by CORS'));
};

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Farsamo API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
