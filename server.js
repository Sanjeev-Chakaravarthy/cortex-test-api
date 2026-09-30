const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Track server health state — can be toggled for testing
let isHealthy = true;

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'cortex-test-api',
    version: '1.0.0',
    status: isHealthy ? 'ok' : 'failing',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health endpoint — returns 200 when healthy, 500 when failing
app.get('/health', (req, res) => {
  if (isHealthy) {
    res.status(200).json({
      status: 'healthy',
      checks: {
        memory: process.memoryUsage().heapUsed < 100 * 1024 * 1024 ? 'ok' : 'warning',
        uptime: process.uptime() > 0 ? 'ok' : 'fail'
      },
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Service is in failure mode',
      timestamp: new Date().toISOString()
    });
  }
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Cortex test API is working',
    data: { items: [1, 2, 3] },
    timestamp: new Date().toISOString()
  });
});

// Toggle health — POST /admin/fail to simulate failure, POST /admin/recover to restore
app.post('/admin/fail', (req, res) => {
  isHealthy = false;
  console.log('[ADMIN] Health state set to FAILING');
  res.json({ status: 'failing', message: 'Service is now in failure mode' });
});

app.post('/admin/recover', (req, res) => {
  isHealthy = true;
  console.log('[ADMIN] Health state set to HEALTHY');
  res.json({ status: 'healthy', message: 'Service has recovered' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`cortex-test-api listening on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
});
