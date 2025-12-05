const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCustomers = async (req, res) => {
  const { tenantId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const minSpent = parseFloat(req.query.minSpent) || 0;
  const skip = (page - 1) * limit;

  console.log('Fetching customers:', { tenantId, page, search, minSpent });

  const where = {
    tenantId,
    totalSpent: { gte: minSpent },
    OR: [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } }
    ]
  };

  try {
    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        orderBy: { totalSpent: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.createCustomer = async (req, res) => {
  const { tenantId, firstName, lastName, email } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: {
        tenantId,
        shopifyId: `manual_${Date.now()}`, // Generate a manual ID
        firstName,
        lastName,
        email,
        totalSpent: 0,
        ordersCount: 0
      }
    });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};
