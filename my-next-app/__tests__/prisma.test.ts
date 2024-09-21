import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Prisma Test', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should fetch customer data', async () => {
    const customers = await prisma.customer.findMany();
    
    expect(customers).toBeInstanceOf(Array);
    expect(customers.length).toBeGreaterThan(0);  // Assumes you have some dummy data in your database
    
    // Check if the first customer has certain fields
    if (customers.length > 0) {
      const customer = customers[0];
      expect(customer).toHaveProperty('Customer_ID');
      expect(customer).toHaveProperty('Name');
      expect(customer).toHaveProperty('Email');
    }
  });

  it('should fetch product data', async () => {
    const products = await prisma.product.findMany();
    
    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);  // Assumes you have some dummy data in your database
    
    // Check if the first product has certain fields
    if (products.length > 0) {
      const product = products[0];
      expect(product).toHaveProperty('Product_ID');
      expect(product).toHaveProperty('Product_Name');
      expect(product).toHaveProperty('Price');
    }
  });
});
