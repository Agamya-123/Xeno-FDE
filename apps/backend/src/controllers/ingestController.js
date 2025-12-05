const { PrismaClient } = require('@prisma/client');
const ShopifyService = require('../services/shopifyService');

const prisma = new PrismaClient();

exports.ingestData = async (req, res) => {
  const { tenantId } = req.body; // In a real app, this might come from auth token
  
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  try {
    // 1. Fetch Tenant Config
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const shopify = new ShopifyService(tenant.shopifyDomain, tenant.accessToken);

    // 2. Ingest Products
    const products = await shopify.getProducts();
    for (const prod of products) {
      await prisma.product.upsert({
        where: { tenantId_shopifyId: { tenantId, shopifyId: prod.shopifyId } },
        update: { title: prod.title, vendor: prod.vendor, productType: prod.productType },
        create: {
          tenantId,
          shopifyId: prod.shopifyId,
          title: prod.title,
          vendor: prod.vendor,
          productType: prod.productType
        }
      });
    }

    // 3. Ingest Customers
    const customers = await shopify.getCustomers();
    for (const cust of customers) {
      await prisma.customer.upsert({
        where: { tenantId_shopifyId: { tenantId, shopifyId: cust.shopifyId } },
        update: { 
          firstName: cust.firstName, 
          lastName: cust.lastName, 
          email: cust.email, 
          totalSpent: cust.totalSpent, 
          ordersCount: cust.ordersCount 
        },
        create: {
          tenantId,
          shopifyId: cust.shopifyId,
          firstName: cust.firstName,
          lastName: cust.lastName,
          email: cust.email,
          totalSpent: cust.totalSpent,
          ordersCount: cust.ordersCount
        }
      });
    }

    // 4. Ingest Orders
    const orders = await shopify.getOrders();
    for (const ord of orders) {
      // Find local customer ID if exists
      let localCustomerId = null;
      if (ord.customerId) {
        const localCustomer = await prisma.customer.findFirst({
          where: { tenantId, shopifyId: ord.customerId }
        });
        if (localCustomer) localCustomerId = localCustomer.id;
      }

      await prisma.order.upsert({
        where: { tenantId_shopifyId: { tenantId, shopifyId: ord.shopifyId } },
        update: { 
          orderNumber: ord.orderNumber, 
          totalPrice: ord.totalPrice, 
          currency: ord.currency,
          customerId: localCustomerId,
          createdAt: ord.createdAt // Update timestamp if changed
        },
        create: {
          tenantId,
          shopifyId: ord.shopifyId,
          orderNumber: ord.orderNumber,
          totalPrice: ord.totalPrice,
          currency: ord.currency,
          customerId: localCustomerId,
          createdAt: ord.createdAt // Use timestamp from source
        }
      });
    }

    res.json({ message: 'Ingestion completed successfully', stats: { products: products.length, customers: customers.length, orders: orders.length } });

  } catch (error) {
    console.error('Ingestion failed:', error);
    res.status(500).json({ error: 'Ingestion failed', details: error.message });
  }
};
