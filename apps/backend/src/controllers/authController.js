const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  let { tenantId, password } = req.body;
  tenantId = tenantId?.trim();
  password = password?.trim();
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    
    if (!tenant) {
      console.log('Login failed: Tenant not found', { receivedId: tenantId });
      return res.status(401).json({ 
        error: `Tenant not found for ID: '${tenantId}'`,
        receivedId: tenantId
      });
    }

    // In a real app, compare hashed password
    if (tenant.password !== password) {
      console.log('Login failed: Password mismatch', { 
        receivedPass: password, 
        dbPass: tenant.password 
      });
      return res.status(401).json({ 
        error: `Password mismatch. Received: '${password}', Expected: '${tenant.password}'`,
        receivedPass: password
      });
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
