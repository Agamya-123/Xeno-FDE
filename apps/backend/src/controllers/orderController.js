const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getOrders = async (req, res) => {
  const { tenantId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const minTotal = parseFloat(req.query.minTotal) || 0;
  const skip = (page - 1) * limit;

  console.log('Fetching orders:', { tenantId, page, search, minTotal });

  const where = {
    tenantId,
    totalPrice: { gte: minTotal },
    OR: [
      { orderNumber: { contains: search } },
      { customer: { firstName: { contains: search } } },
      { customer: { lastName: { contains: search } } }
    ]
  };

  try {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.createOrder = async (req, res) => {
  const { tenantId, customerId, totalPrice } = req.body;
  try {
    // Verify customer belongs to tenant
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.tenantId !== tenantId) {
      return res.status(400).json({ error: 'Invalid customer' });
    }

    const order = await prisma.order.create({
      data: {
        tenantId,
        shopifyId: `manual_${Date.now()}`,
        orderNumber: `MAN-${Date.now().toString().slice(-4)}`,
        totalPrice: parseFloat(totalPrice),
        currency: 'USD',
        customerId,
        createdAt: new Date()
      }
    });

    // Update customer stats
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalSpent: { increment: parseFloat(totalPrice) },
        ordersCount: { increment: 1 }
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
