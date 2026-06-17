import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ToyCraze database...');

  // Clean existing data
  await prisma.inventoryLog.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@toycraze.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Alice Wonder',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log(`  ✓ Customer: ${customer.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Lego & Blocks', slug: 'lego-blocks', description: 'Building sets and construction toys', iconUrl: '🧱', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Dolls & Plush', slug: 'dolls-plush', description: 'Soft toys, dolls, and stuffed animals', iconUrl: '🧸', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Cars & Vehicles', slug: 'cars-vehicles', description: 'Toy cars, trucks, and vehicles', iconUrl: '🚗', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'Puzzles', slug: 'puzzles', description: 'Jigsaw puzzles and brain teasers', iconUrl: '🧩', sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: 'Outdoor Fun', slug: 'outdoor', description: 'Outdoor games and sports equipment', iconUrl: '⚽', sortOrder: 5 },
    }),
    prisma.category.create({
      data: { name: 'Arts & Crafts', slug: 'arts-crafts', description: 'Art supplies and craft kits', iconUrl: '🎨', sortOrder: 6 },
    }),
  ]);
  console.log(`  ✓ ${categories.length} categories created`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Galaxy Explorer Lego Set',
        slug: 'galaxy-explorer-lego',
        description: 'Build your own galaxy with this 800-piece space exploration Lego set. Includes astronauts, rockets, and alien figures! Recommended for ages 6+.',
        shortDesc: '800-piece space Lego set',
        price: 4999,
        compareAtPrice: 5999,
        categoryId: categories[0].id,
        stockQty: 25,
        imageUrls: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80'],
        isFeatured: true,
        tags: ['lego', 'space', 'building', 'stem'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Rainbow Unicorn Plush',
        slug: 'rainbow-unicorn-plush',
        description: 'A super-soft rainbow unicorn plush toy with sparkly mane and tail. Machine washable and hypoallergenic.',
        shortDesc: 'Soft rainbow unicorn plush',
        price: 2499,
        compareAtPrice: 3499,
        categoryId: categories[1].id,
        stockQty: 50,
        imageUrls: ['https://images.unsplash.com/photo-1559454403-dd90fc27e1b7?w=600&q=80'],
        isFeatured: true,
        tags: ['unicorn', 'plush', 'soft', 'cute'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Speed Racer RC Car',
        slug: 'speed-racer-rc-car',
        description: 'Remote control race car that reaches speeds up to 15mph. Rechargeable battery with 30min runtime.',
        shortDesc: 'Fast RC race car',
        price: 3999,
        categoryId: categories[2].id,
        stockQty: 15,
        imageUrls: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80'],
        isFeatured: true,
        tags: ['rc', 'car', 'racing', 'remote'],
      },
    }),
    prisma.product.create({
      data: {
        name: '1000-Piece Dino Puzzle',
        slug: 'dino-puzzle-1000',
        description: 'A challenging 1000-piece dinosaur puzzle featuring detailed illustrations of prehistoric creatures.',
        shortDesc: '1000-piece dinosaur puzzle',
        price: 1899,
        categoryId: categories[3].id,
        stockQty: 40,
        imageUrls: ['https://images.unsplash.com/photo-1610465299993-e6675c9f9cfa?w=600&q=80'],
        isFeatured: true,
        tags: ['puzzle', 'dinosaur', 'challenge'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Soccer Star Training Set',
        slug: 'soccer-star-training',
        description: 'Complete soccer training set with ball, cones, and goal. Perfect for backyard practice.',
        shortDesc: 'Complete soccer training kit',
        price: 2999,
        categoryId: categories[4].id,
        stockQty: 30,
        imageUrls: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80'],
        tags: ['soccer', 'outdoor', 'sports'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Creative Art Studio Set',
        slug: 'creative-art-studio',
        description: 'Deluxe art set with 120 pieces including crayons, markers, paints, and paper. In a portable carrying case.',
        shortDesc: '120-piece art set',
        price: 3499,
        compareAtPrice: 4499,
        categoryId: categories[5].id,
        stockQty: 20,
        imageUrls: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80'],
        tags: ['art', 'crafts', 'creative', 'drawing'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Robot Builder Kit',
        slug: 'robot-builder-kit',
        description: 'Build your own programmable robot! Learn coding and robotics with this STEM kit. Includes motors, sensors, and app control.',
        shortDesc: 'Programmable robot kit',
        price: 5999,
        categoryId: categories[0].id,
        stockQty: 12,
        imageUrls: ['https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=600&q=80'],
        tags: ['robot', 'stem', 'coding', 'programming'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Princess Castle Play Set',
        slug: 'princess-castle-play-set',
        description: 'A majestic 3-story castle play set with furniture, royal figures, and a working drawbridge.',
        shortDesc: '3-story castle playset',
        price: 4499,
        compareAtPrice: 5499,
        categoryId: categories[1].id,
        stockQty: 8,
        imageUrls: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80'],
        tags: ['castle', 'princess', 'dollhouse', 'fantasy'],
      },
    }),
  ]);
  console.log(`  ✓ ${products.length} products created`);

  console.log('\n✅ Seeding complete!');
  console.log('   Admin: admin@toycraze.com / admin123');
  console.log('   Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
