require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SS Developers database...');

  // ─── Admin ─────────────────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ssdevelopers.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'SS Developers Admin',
    },
  });
  console.log('✅ Admin created/updated:', admin.email);

  // ─── Project 1: SS Industrial Park 1 ────────────────────────
  const project1 = await prisma.project.upsert({
    where: { slug: 'ss1' },
    update: {},
    create: {
      name: 'SS1',
      slug: 'ss1',
      tagline: 'Prime Industrial Land on Ubhrat Road',
      description:
        'SS Industrial Park 1 is strategically located on Ubhraṭ Road, Maroli, offering government-approved industrial plots with exceptional highway connectivity. Designed for modern manufacturing, warehousing and logistics operations, this park provides all essential infrastructure including wide heavy-vehicle roads, underground utility lines, and 24/7 gated security. This premium master-planned industrial park provides a comprehensive ecosystem for businesses to scale. Featuring a dedicated commercial zone, robust power supply substations, advanced water treatment facilities, and wide 60-feet internal concrete roads. SS1 is the ideal choice for heavy engineering, textile manufacturing, and large-scale warehousing. Companies benefit from streamlined logistics, ample parking for heavy trailers, and proximity to major rail and sea freight terminals. Secure your future in an industrial hub that\'s built for tomorrow.',
      location: 'Ubhraṭ Road, Maroli',
      address: 'Ubhraṭ Road, Maroli, Surat District, Gujarat',
      lat: 21.1702,
      lng: 72.8311,
      highlights: JSON.stringify([
        'Direct highway connectivity',
        'Spacious heavy-vehicle roads',
        'Underground utility lines',
        'Gated security setup',
        'Government approved zone',
        'Plug-and-play utilities',
      ]),
      connectivity: JSON.stringify([
        'NH-48 National Highway access',
        'Heavy freight road connectivity',
        'Close to Hazira industrial belt',
        'Easy logistics access',
      ]),
      infrastructure: JSON.stringify([
        'Wide internal roads (30 ft)',
        'Underground electricity',
        'Water supply',
        'Drainage system',
        '24/7 security',
      ]),
      amenities: JSON.stringify([
        'Boundary wall',
        'Security cabin',
        'Common facilities',
        'Utility connections',
      ]),
      isActive: true,
    },
  });
  console.log('✅ Project 1 created:', project1.name);

  // Add images for SS1
  await prisma.projectImage.deleteMany({ where: { projectId: project1.id } });
  await prisma.projectImage.createMany({
    data: [
      { projectId: project1.id, url: '/images/ss1-hero.png', type: 'HERO', order: 1 },
      { projectId: project1.id, url: 'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=2079', type: 'GALLERY', order: 2 },
      { projectId: project1.id, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069', type: 'GALLERY', order: 3 },
      { projectId: project1.id, url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072', type: 'INFRASTRUCTURE', order: 4 },
    ]
  });

  // ─── Project 2: SS Industrial Land 3 ────────────────────────
  const project2 = await prisma.project.upsert({
    where: { slug: 'ss3' },
    update: {},
    create: {
      name: 'SS3',
      slug: 'ss3',
      tagline: 'Industrial Corridor Land at Hojwala',
      description:
        'SS Industrial Land 3 at Hojwala is a government-approved industrial development positioned within 1 km of the Palsana-Hazira industrial belt. The property offers excellent freight road connectivity, secured campus infrastructure, and easy access to the expanding industrial corridor making it an ideal choice for manufacturers and logistics operators. Spread across a sprawling landscape, this industrial corridor project is engineered for high-capacity logistics and advanced manufacturing. It offers state-of-the-art infrastructure including uninterrupted industrial-grade power, high-speed fiber connectivity, and dedicated effluent treatment plants. The strategic positioning near the Palsana-Hazira belt ensures seamless supply chain operations and quick access to raw materials and markets. Designed with multiple large-scale buildings and built-to-suit shed options, this park provides maximum flexibility for growing enterprises to customize their operations perfectly.',
      location: 'Hojwala',
      address: 'Hojwala, Surat District, Gujarat',
      lat: 21.2500,
      lng: 72.7800,
      highlights: JSON.stringify([
        'Government approved',
        'Heavy freight roads',
        '1 km to Palsana-Hazira belt',
        'Industrial corridor connectivity',
        'Secured campus',
        'Easy bank financing',
      ]),
      connectivity: JSON.stringify([
        '1 km to Palsana-Hazira industrial belt',
        'State highway connectivity',
        'Industrial corridor access',
        'Freight road network',
      ]),
      infrastructure: JSON.stringify([
        'Wide freight roads',
        'Boundary compound',
        '24/7 security',
        'Utility infrastructure',
      ]),
      amenities: JSON.stringify([
        'Secured perimeter',
        'Entry gate',
        'Security cabin',
        'Flexible plot options',
      ]),
      isActive: true,
    },
  });
  console.log('✅ Project 2 created:', project2.name);

  // Add images for SS3
  await prisma.projectImage.deleteMany({ where: { projectId: project2.id } });
  await prisma.projectImage.createMany({
    data: [
      { projectId: project2.id, url: '/images/ss3-hero.png', type: 'HERO', order: 1 },
      { projectId: project2.id, url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=2070', type: 'GALLERY', order: 2 },
      { projectId: project2.id, url: 'https://images.unsplash.com/photo-1553456558-bef63debc0ad?q=80&w=2070', type: 'INFRASTRUCTURE', order: 3 },
    ]
  });

  // ─── Plots for Project 1 ─────────────────────────────────────
  const plotsP1 = [
    { plotNumber: 'A-101', area: 2400, facing: 'East', roadWidth: '30 ft', status: 'AVAILABLE' },
    { plotNumber: 'A-102', area: 2600, facing: 'East', roadWidth: '30 ft', status: 'AVAILABLE' },
    { plotNumber: 'A-103', area: 3000, facing: 'North', roadWidth: '30 ft', status: 'HOLD' },
    { plotNumber: 'A-104', area: 2400, facing: 'West', roadWidth: '24 ft', status: 'SOLD' },
    { plotNumber: 'A-105', area: 2800, facing: 'South', roadWidth: '24 ft', status: 'AVAILABLE' },
    { plotNumber: 'B-101', area: 5000, facing: 'East', roadWidth: '40 ft', status: 'AVAILABLE' },
    { plotNumber: 'B-102', area: 5000, facing: 'East', roadWidth: '40 ft', status: 'BOOKED' },
    { plotNumber: 'B-103', area: 4800, facing: 'North', roadWidth: '40 ft', status: 'AVAILABLE' },
    { plotNumber: 'B-104', area: 5200, facing: 'West', roadWidth: '40 ft', status: 'SOLD' },
    { plotNumber: 'C-101', area: 10000, facing: 'East', roadWidth: '60 ft', status: 'AVAILABLE' },
    { plotNumber: 'C-102', area: 12000, facing: 'East', roadWidth: '60 ft', status: 'AVAILABLE' },
    { plotNumber: 'C-103', area: 8500, facing: 'North', roadWidth: '60 ft', status: 'SOLD' },
  ];

  for (const plot of plotsP1) {
    await prisma.plot.upsert({
      where: { projectId_plotNumber: { projectId: project1.id, plotNumber: plot.plotNumber } },
      update: {},
      create: {
        projectId: project1.id,
        plotNumber: plot.plotNumber,
        area: plot.area,
        areaUnit: 'sqft',
        facing: plot.facing,
        roadWidth: plot.roadWidth,
        status: plot.status,
      },
    });
  }
  console.log('✅ Plots for Project 1 created');

  // ─── Plots for Project 2 ─────────────────────────────────────
  const plotsP2 = [
    { plotNumber: 'P-201', area: 3000, facing: 'East', roadWidth: '30 ft', status: 'AVAILABLE' },
    { plotNumber: 'P-202', area: 3500, facing: 'East', roadWidth: '30 ft', status: 'AVAILABLE' },
    { plotNumber: 'P-203', area: 4000, facing: 'North', roadWidth: '30 ft', status: 'HOLD' },
    { plotNumber: 'P-204', area: 3200, facing: 'West', roadWidth: '24 ft', status: 'AVAILABLE' },
    { plotNumber: 'P-205', area: 6000, facing: 'South', roadWidth: '40 ft', status: 'SOLD' },
    { plotNumber: 'P-206', area: 5500, facing: 'East', roadWidth: '40 ft', status: 'AVAILABLE' },
    { plotNumber: 'P-207', area: 8000, facing: 'North', roadWidth: '40 ft', status: 'BOOKED' },
    { plotNumber: 'P-208', area: 7500, facing: 'West', roadWidth: '40 ft', status: 'AVAILABLE' },
  ];

  for (const plot of plotsP2) {
    await prisma.plot.upsert({
      where: { projectId_plotNumber: { projectId: project2.id, plotNumber: plot.plotNumber } },
      update: {},
      create: {
        projectId: project2.id,
        plotNumber: plot.plotNumber,
        area: plot.area,
        areaUnit: 'sqft',
        facing: plot.facing,
        roadWidth: plot.roadWidth,
        status: plot.status,
      },
    });
  }
  console.log('✅ Plots for Project 2 created');

  // ─── Sample Customers + Leads ─────────────────────────────────
  const customers = [
    { name: 'Rajesh Patel', mobile: '9876543210', email: 'rajesh@example.com' },
    { name: 'Suresh Shah', mobile: '9898989898', email: null },
    { name: 'Manish Kumar', mobile: '9712345678', email: 'manish@business.com' },
  ];

  for (const cust of customers) {
    const customer = await prisma.customer.create({
      data: {
        name: cust.name,
        mobile: cust.mobile,
        email: cust.email,
      },
    });

    await prisma.lead.create({
      data: {
        customerId: customer.id,
        projectId: project1.id,
        source: 'WEBSITE',
        message: 'Interested in available industrial plots. Please share details.',
        status: 'NEW',
      },
    });
  }
  console.log('✅ Sample customers and leads created');

  // ─── Sample Site Visit ────────────────────────────────────────
  const firstCustomer = await prisma.customer.findFirst();
  if (firstCustomer) {
    await prisma.siteVisit.create({
      data: {
        customerId: firstCustomer.id,
        projectId: project1.id,
        preferredDate: '2026-10-15',
        preferredTime: '10:00 AM',
        message: 'Would like to visit the project site and understand plot options.',
        status: 'REQUESTED',
      },
    });
  }
  console.log('✅ Sample site visit created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@ssdevelopers.com');
  console.log('🔑 Admin password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
