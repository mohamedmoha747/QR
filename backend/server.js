const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const { redirectDynamicQr } = require('./controllers/qrController');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();

connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((error) => {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
  });

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://qr-1-gq4t.onrender.com',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({ message: 'QR SaaS API running' });
});

app.get('/qr/:shortCode', redirectDynamicQr);

app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/public', express.static('public'));

const frontendBuildPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/public')) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
