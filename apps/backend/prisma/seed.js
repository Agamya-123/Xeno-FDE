const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { shopifyDomain: 'test-store.myshopify.com' },
    update: {},
    create: {
      name: 'Test Store',
      shopifyDomain: 'test-store.myshopify.com',
      accessToken: 'test_token_123'
    },
  });
  console.log({ tenant });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
