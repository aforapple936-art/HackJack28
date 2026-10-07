const express = require('express');
const cors = require('cors');
const config = require('./config');
const repository = require('./db/repository');

// Import Route Handlers
const decisionsRouter = require('./routes/decisions');
const aiRouter = require('./routes/ai');
const researchRouter = require('./routes/research');
const nearbyRouter = require('./routes/nearby');
const preferencesRouter = require('./routes/preferences');
const usageRouter = require('./routes/usage');
const alertsRouter = require('./routes/alerts');
const exportRouter = require('./routes/export');

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// Root discovery route
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Choosy Decision Intelligence Platform API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      decisions: '/api/decisions',
      ai: '/api/ai'
    }
  });
});

// Healthcheck Route
app.get('/api/health', async (req, res) => {
  const isSupabaseLive = await repository.checkSupabaseTables();
  res.json({
    status: 'healthy',
    platform: 'Choosy Decision Intelligence Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      supabasePostgres: isSupabaseLive ? 'connected' : 'fallback_store_ready',
      geminiAi: Boolean(config.gemini.apiKey) ? 'configured' : 'missing_key',
      realWorldPlaces: 'OpenStreetMap Nominatim active'
    }
  });
});

// Mount Routes
app.use('/api/decisions', decisionsRouter);
app.use('/api/decisions', exportRouter); // For /api/decisions/:id/export
app.use('/api/ai', aiRouter);
app.use('/api/research', researchRouter);
app.use('/api/nearby', nearbyRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/usage', usageRouter);
app.use('/api/alerts', alertsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 CHOOSY API SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
  await repository.checkSupabaseTables();
});
