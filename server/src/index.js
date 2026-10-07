const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.options('*', cors());
app.use(express.json());

// Request logging in development/production
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Locate client build directory across various deployment environments
const clientDistCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'dist')
];

const clientDistPath = clientDistCandidates.find(p => fs.existsSync(p));
if (clientDistPath) {
  console.log(`📦 Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
}

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

// Mount API Routes
app.use('/api/decisions', decisionsRouter);
app.use('/api/decisions', exportRouter); // For /api/decisions/:id/export
app.use('/api/ai', aiRouter);
app.use('/api/research', researchRouter);
app.use('/api/nearby', nearbyRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/usage', usageRouter);
app.use('/api/alerts', alertsRouter);

// SPA client fallback for all non-API GET routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `API route not found: ${req.path}` });
  }

  if (clientDistPath && fs.existsSync(path.join(clientDistPath, 'index.html'))) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }

  // Fallback API discovery if client dist has not been built
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = parseInt(process.env.PORT || config.port || 4000, 10);
const HOST = '0.0.0.0';
app.listen(PORT, HOST, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 CHOOSY API SERVER IS RUNNING ON http://${HOST}:${PORT}`);
  console.log(`🌐 Health endpoint: http://${HOST}:${PORT}/api/health`);
  console.log(`=======================================================`);
  await repository.checkSupabaseTables();
});
