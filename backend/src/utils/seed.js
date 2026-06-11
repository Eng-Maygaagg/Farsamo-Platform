require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Category = require('../models/Category');
const Service = require('../models/Service');
const PlatformSettings = require('../models/PlatformSettings');
const { ROLES } = require('../config/constants');

const seedDatabase = async ({ skipConnect = false } = {}) => {
  if (!skipConnect) {
    await connectDB();
  }

  await Promise.all([
    User.deleteMany({}),
    Provider.deleteMany({}),
    Category.deleteMany({}),
    Service.deleteMany({}),
    PlatformSettings.deleteMany({}),
  ]);

  await User.create([
    {
      fullName: 'Admin User',
      email: 'admin@farsamo.com',
      phone: '+252610000001',
      password: 'admin123',
      role: ROLES.ADMIN,
      isVerified: true,
    },
    {
      fullName: 'Cabdiraxmaan Ibraahim Cali',
      email: 'cabdiraxmaanibraahimcali245@gmail.com',
      phone: '+252610000002',
      password: 'Admin245',
      role: ROLES.ADMIN,
      isVerified: true,
    },
  ]);

  const categories = await Category.insertMany([
    { name: 'Plumbing', slug: 'plumbing', icon: '🔧', description: 'Professional plumbing services', sortOrder: 1 },
    { name: 'Electrical', slug: 'electrical', icon: '⚡', description: 'Electrical installation and repair', sortOrder: 2 },
    { name: 'Carpentry', slug: 'carpentry', icon: '🪚', description: 'Custom woodwork and repairs', sortOrder: 3 },
    { name: 'Cleaning', slug: 'cleaning', icon: '🧹', description: 'Home and office cleaning', sortOrder: 4 },
    { name: 'Painting', slug: 'painting', icon: '🎨', description: 'Interior and exterior painting', sortOrder: 5 },
    { name: 'IT Support', slug: 'it-support', icon: '💻', description: 'Computer and network support', sortOrder: 6 },
    { name: 'AC Repair', slug: 'ac-repair', icon: '❄️', description: 'Air conditioning services', sortOrder: 7 },
    { name: 'Mechanics', slug: 'mechanics', icon: '🔩', description: 'Vehicle repair services', sortOrder: 8 },
  ]);

  const services = await Service.insertMany([
    { name: 'Pipe Repair', slug: 'pipe-repair', categoryId: categories[0]._id, basePrice: 50, description: 'Fix leaking or broken pipes' },
    { name: 'Drain Cleaning', slug: 'drain-cleaning', categoryId: categories[0]._id, basePrice: 40, description: 'Clear blocked drains' },
    { name: 'Wiring Installation', slug: 'wiring-installation', categoryId: categories[1]._id, basePrice: 80, description: 'Electrical wiring for homes' },
    { name: 'Light Fixture Setup', slug: 'light-fixture', categoryId: categories[1]._id, basePrice: 35, description: 'Install lights and fixtures' },
    { name: 'Furniture Assembly', slug: 'furniture-assembly', categoryId: categories[2]._id, basePrice: 45, description: 'Assemble furniture items' },
    { name: 'Door Installation', slug: 'door-installation', categoryId: categories[2]._id, basePrice: 60, description: 'Install interior and exterior doors' },
    { name: 'Deep Cleaning', slug: 'deep-cleaning', categoryId: categories[3]._id, basePrice: 70, description: 'Thorough home cleaning' },
    { name: 'Office Cleaning', slug: 'office-cleaning', categoryId: categories[3]._id, basePrice: 90, description: 'Commercial space cleaning' },
    { name: 'Interior Painting', slug: 'interior-painting', categoryId: categories[4]._id, basePrice: 120, description: 'Paint interior walls and ceilings' },
    { name: 'Computer Repair', slug: 'computer-repair', categoryId: categories[5]._id, basePrice: 55, description: 'Fix hardware and software issues' },
    { name: 'Network Setup', slug: 'network-setup', categoryId: categories[5]._id, basePrice: 75, description: 'Home and office networking' },
    { name: 'AC Maintenance', slug: 'ac-maintenance', categoryId: categories[6]._id, basePrice: 65, description: 'AC servicing and maintenance' },
  ]);

  const providerData = [
    { fullName: 'Ahmed Hassan', email: 'ahmed@farsamo.com', profession: 'Plumber', experience: 8, location: 'Mogadishu', rating: 4.8 },
    { fullName: 'Fatima Ali', email: 'fatima@farsamo.com', profession: 'Electrician', experience: 6, location: 'Hargeisa', rating: 4.9 },
    { fullName: 'Omar Yusuf', email: 'omar@farsamo.com', profession: 'Carpenter', experience: 10, location: 'Mogadishu', rating: 4.7 },
    { fullName: 'Amina Mohamed', email: 'amina@farsamo.com', profession: 'Cleaner', experience: 4, location: 'Bosaso', rating: 4.6 },
    { fullName: 'Hassan Ibrahim', email: 'hassan@farsamo.com', profession: 'Painter', experience: 7, location: 'Mogadishu', rating: 4.5 },
    { fullName: 'Layla Abdi', email: 'layla@farsamo.com', profession: 'IT Technician', experience: 5, location: 'Hargeisa', rating: 4.9 },
  ];

  for (let i = 0; i < providerData.length; i++) {
    const p = providerData[i];
    const user = await User.create({
      fullName: p.fullName,
      email: p.email,
      phone: `+2526100000${i + 10}`,
      password: 'provider123',
      role: ROLES.PROVIDER,
      isVerified: true,
    });

    const serviceIndices = [i % services.length, (i + 1) % services.length];
    await Provider.create({
      userId: user._id,
      profession: p.profession,
      experience: p.experience,
      location: p.location,
      nationalId: `NID${100000 + i}`,
      bio: `Experienced ${p.profession.toLowerCase()} with ${p.experience} years of professional service.`,
      services: serviceIndices.map((idx) => services[idx]._id),
      pricing: serviceIndices.map((idx) => ({ serviceId: services[idx]._id, price: services[idx].basePrice + i * 5 })),
      rating: p.rating,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      totalJobs: Math.floor(Math.random() * 100) + 20,
      verificationStatus: 'approved',
      isAvailable: true,
    });
  }

  await User.create({
    fullName: 'Demo Customer',
    email: 'customer@farsamo.com',
    phone: '+252610000099',
    password: 'customer123',
    role: ROLES.CUSTOMER,
    isVerified: true,
  });

  await PlatformSettings.create({
    siteName: 'Farsamo Platform',
    contactEmail: 'contact@farsamo.com',
    contactPhone: '+252 61 000 0000',
    address: 'Wadajir District, Mogadishu, Somalia',
  });

  console.log('Database seeded successfully!');
  console.log('Admin: admin@farsamo.com / admin123');
  console.log('Admin: cabdiraxmaanibraahimcali245@gmail.com / Admin245');
  console.log('Customer: customer@farsamo.com / customer123');
  console.log('Providers: *@farsamo.com / provider123');
};

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
