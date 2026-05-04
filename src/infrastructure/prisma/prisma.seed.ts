import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const db_url = process.env.DATABASE_URL;

console.log('DEBUG, prisma seed db_url:', db_url);

const adapter = new PrismaPg({
  connectionString: db_url as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Створюємо компанію
  const company = await prisma.company.upsert({
    where: { edrpou: '12345678' },
    update: {},
    create: {
      id: 'c0a80121-7ac0-4e1d-8b0d-1234567890ab',
      name: 'Меблі Опт Захід',
      edrpou: '12345678',
      address: 'м. Чернівці, вул. Головна, 100',
    },
  });

  // 2. Створюємо користувача (Client)
  const user = await prisma.user.upsert({
    where: { email: 'max@example.com' },
    update: {},
    create: {
      id: 'u0a80121-7ac0-4e1d-8b0d-1234567890ab',
      email: 'max@example.com',
      password: 'hashed_password_123', // В лабі поки можна так
      firstName: 'Макс',
      lastName: 'Розробник',
      role: 'CLIENT',
      companyId: company.id,
    },
  });

  // 3. Створюємо категорії
  const catHinges = await prisma.category.upsert({
    where: { name: 'Завіси' },
    update: {},
    create: { id: 'cat-1', name: 'Завіси' },
  });

  // 4. Створюємо товари
  const product1 = await prisma.product.upsert({
    where: { sku: 'HINGE-001' },
    update: {},
    create: {
      id: 'p0a80121-1111-4e1d-8b0d-000000000001',
      sku: 'HINGE-001',
      name: 'Завіса накладна 110°',
      description: 'Якісна металева завіса для кухонних фасадів',
      price: 25.5,
      stock: 500,
      categoryId: catHinges.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: 'HANDLE-002' },
    update: {},
    create: {
      id: 'p0a80121-2222-4e1d-8b0d-000000000002',
      sku: 'HANDLE-002',
      name: 'Ручка меблева чорна 128мм',
      description: 'Стильна алюмінієва ручка в стилі лофт',
      price: 85.0,
      stock: 150,
      categoryId: catHinges.id,
    },
  });

  console.log({
    message: '✅ Seed data created successfully',
    testUser: user.id,
    testProducts: [product1.id, product2.id],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
