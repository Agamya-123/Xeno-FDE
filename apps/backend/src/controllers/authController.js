const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { tenantId, password } = req.body;
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    
    if (!tenant) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, compare hashed password
    if (tenant.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', tenantId: tenant.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: 'Login failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
