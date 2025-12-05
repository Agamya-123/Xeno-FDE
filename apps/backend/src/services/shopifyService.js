const axios = require('axios');

// Helper to generate random data
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const productTypes = ['Apparel', 'Accessories', 'Home', 'Electronics', 'Beauty'];

const generateMockData = () => {
  const products = [];
  for (let i = 1; i <= 20; i++) {
    products.push({
      id: `prod_${i}`,
      shopifyId: `prod_${i}`,
      title: `Product ${i}`,
      vendor: 'Xeno Store',
      productType: productTypes[getRandomInt(0, productTypes.length - 1)]
    });
  }

  const customers = [];
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    customers.push({
      id: `cust_${i}`,
      shopifyId: `cust_${i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      totalSpent: 0, // Will calculate from orders
      ordersCount: 0
    });
  }

  const orders = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3); // Last 3 months

  for (let i = 1; i <= 150; i++) {
    const customerIndex = getRandomInt(0, customers.length - 1);
    const customer = customers[customerIndex];
    const price = getRandomInt(20, 200) + 0.99;
    
    orders.push({
      id: `ord_${i}`,
      shopifyId: `ord_${i}`,
      orderNumber: `${1000 + i}`,
      totalPrice: price.toFixed(2),
      currency: 'USD',
      customerId: customer.shopifyId,
      createdAt: getRandomDate(startDate, new Date())
    });

    customer.totalSpent += price;
    customer.ordersCount++;
  }

  // Fix float precision for totalSpent
  customers.forEach(c => c.totalSpent = parseFloat(c.totalSpent.toFixed(2)));

  return { products, customers, orders };
};

const MOCK_DATA = generateMockData();

class ShopifyService {
  constructor(shopDomain, accessToken) {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
    this.baseUrl = `https://${shopDomain}/admin/api/2023-10`;
  }

  async getProducts() {
    if (!this.accessToken) return MOCK_DATA.products;
    return MOCK_DATA.products;
  }

  async getCustomers() {
    if (!this.accessToken) return MOCK_DATA.customers;
    return MOCK_DATA.customers;
  }

  async getOrders() {
    if (!this.accessToken) return MOCK_DATA.orders;
    return MOCK_DATA.orders;
  }
}

module.exports = ShopifyService;
