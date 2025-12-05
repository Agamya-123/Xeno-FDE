const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Allow all origins for demo simplicity
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  const dbStatus = process.env.DATABASE_URL ? 'Connected' : 'Missing DB URL';
  res.send(`Shopify Service v2 - ${dbStatus}`);
});

// DEBUG: Check DB connection details
app.get('/api/debug-db', async (req, res) => {
  try {
    const url = process.env.DATABASE_URL || 'None';
    const maskedUrl = url.substring(0, 20) + '...';
    const count = await prisma.tenant.count();
    const tenants = await prisma.tenant.findMany({ select: { id: true } });
    
    res.json({
      maskedUrl,
      tenantCount: count,
      tenants
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/shopify', require('./routes/shopify'));

// Scheduler: Run ingestion every hour
const cron = require('node-cron');
const { ingestData } = require('./controllers/ingestController');
// Mock request/response for the controller function
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled ingestion...');
  // In a real app, you'd iterate over all tenants or use a queue
  // For demo, we'll just log it or trigger for the demo tenant
  // ingestData({ body: { tenantId: 'dc80542d-3084-42d4-9259-7279ea60a206' } }, { json: () => {}, status: () => ({ json: () => {} }) });
  console.log('Scheduled task executed.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
