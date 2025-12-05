const { PrismaClient } = require('@prisma/client');

// Use the remote URL provided by the user
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_qklEQ9fZ1dIT@ep-dry-king-ahwjoh96-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to remote DB...');
  try {
    const tenants = await prisma.tenant.findMany();
    console.log('Tenants found:', tenants);
  } catch (error) {
    console.error('Error connecting or fetching:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
