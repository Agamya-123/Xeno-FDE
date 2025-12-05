const express = require('express');
const router = express.Router();

// GET /api/shopify/auth?shop=example.myshopify.com
router.get('/auth', (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).send('Missing shop parameter');

  // In a real app, you would redirect to Shopify's OAuth URL
  // const redirectUri = 'http://localhost:4000/api/shopify/callback';
  // const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_customers,read_orders&redirect_uri=${redirectUri}`;
  
  // For demo, we'll just simulate a successful redirect
  res.send(`Redirecting to Shopify OAuth for ${shop}... (Simulated)`);
});

// GET /api/shopify/callback
router.get('/callback', (req, res) => {
  const { shop, code } = req.query;
  // In a real app, you would exchange the code for an access token
  // and store it in the database for the tenant.
  
  res.send('Shopify OAuth Callback Received. App installed successfully! (Simulated)');
});

module.exports = router;
