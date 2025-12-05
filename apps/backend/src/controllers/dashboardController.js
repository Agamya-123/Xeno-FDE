const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardData = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const totalCustomers = await prisma.customer.count({ where: { tenantId } });
    const totalOrders = await prisma.order.count({ where: { tenantId } });
    
    // Calculate total revenue
    const orders = await prisma.order.findMany({ where: { tenantId }, select: { totalPrice: true } });
    const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0);

    // Top 5 customers
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { totalSpent: 'desc' },
      take: 5
    });

    // Orders by date (last 7 days for simplicity or all)
    // Grouping by date is tricky in Prisma + SQLite without raw query, so we'll fetch and group in JS for demo
    const allOrders = await prisma.order.findMany({
      where: { tenantId },
      select: { createdAt: true, totalPrice: true }
    });

    const ordersByDate = {};
    allOrders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!ordersByDate[date]) ordersByDate[date] = 0;
      ordersByDate[date]++;
    });

    const chartData = Object.keys(ordersByDate).map(date => ({ date, orders: ordersByDate[date] }));

    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue,
      topCustomers,
      chartData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
