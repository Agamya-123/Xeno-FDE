const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getInsights = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const customers = await prisma.customer.findMany({
      where: { tenantId },
      include: { orders: true }
    });

    // Simple "AI" Segmentation Logic
    const segments = {
      vip: [],
      loyal: [],
      atRisk: [],
      new: []
    };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    customers.forEach(customer => {
      // VIP: Spent > $500
      if (customer.totalSpent > 500) {
        segments.vip.push(customer);
      }

      // Loyal: > 5 orders
      if (customer.ordersCount > 5) {
        segments.loyal.push(customer);
      }

      // At Risk: No orders in last 30 days (and has ordered before)
      const lastOrder = customer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      if (lastOrder && new Date(lastOrder.createdAt) < thirtyDaysAgo) {
        segments.atRisk.push(customer);
      }

      // New: Created in last 7 days (Mock data might need adjustment for this to show up)
      // For demo, let's say "New" is anyone with < 2 orders
      if (customer.ordersCount < 2) {
        segments.new.push(customer);
      }
    });

    // Calculate LTV (Lifetime Value)
    const totalRevenue = customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0);
    const avgLTV = customers.length ? (totalRevenue / customers.length).toFixed(2) : 0;

    res.json({
      segments: {
        vip: segments.vip.length,
        loyal: segments.loyal.length,
        atRisk: segments.atRisk.length,
        new: segments.new.length
      },
      metrics: {
        avgLTV,
        totalCustomers: customers.length
      },
      recommendations: [
        { title: 'Target VIPs', description: `You have ${segments.vip.length} VIP customers. Send them an exclusive offer.` },
        { title: 'Win Back Risk', description: `${segments.atRisk.length} customers haven't ordered recently. Launch a re-engagement campaign.` },
        { title: 'Boost Loyalty', description: 'Create a loyalty program to convert new customers into loyal ones.' }
      ]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
