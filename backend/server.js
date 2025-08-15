require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const Job = require('./models/Job');

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// daily cron to mark expired jobs at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily expiry job');
  try {
    await Job.updateMany({ lastDateToApply: { $lt: new Date() } }, { isExpired: true });
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
