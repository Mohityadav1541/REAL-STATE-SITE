const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const plotRoutes = require('./routes/plot.routes');
const leadRoutes = require('./routes/lead.routes');
const siteVisitRoutes = require('./routes/siteVisit.routes');
const adminRoutes = require('./routes/admin.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      /^http:\/\/localhost:\d+$/,
    ],
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many submissions. Please try again later.' },
});

app.use('/api/', apiLimiter);
app.use('/api/leads', leadLimiter);
app.use('/api/site-visits', leadLimiter);

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SS Developers API', timestamp: new Date().toISOString() });
});

// ─── Public Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/site-visits', siteVisitRoutes);
app.use('/api/chat', chatRoutes);

// ─── Admin Routes ─────────────────────────────────────────────
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

module.exports = app;
