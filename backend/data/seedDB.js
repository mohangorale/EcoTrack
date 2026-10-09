require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Item = require('../models/Item');
const TrackingHistory = require('../models/TrackingHistory');
const { Counter } = require('../models/Counter');

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

const seedUsers = [
  {
    name: 'Rahul Patil',
    email: 'rahul@gmail.com',
    mobile: '+91 9876543210',
    address: 'Pune, Maharashtra',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'CUSTOMER',
    organizationName: 'EcoCitizen',
    accountStatus: 'ACTIVE'
  },
  {
    name: 'Sneha Joshi',
    email: 'sneha@collect.com',
    mobile: '+91 9876543211',
    address: 'Mumbai Central Depot',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'COLLECTION_CENTRE',
    organizationName: 'EcoCollect Depot',
    accountStatus: 'ACTIVE'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@transport.com',
    mobile: '+91 9876543212',
    address: 'Fleet Bay 4',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'TRANSPORTER',
    organizationName: 'EcoFreight Logistics Fleet',
    accountStatus: 'ACTIVE'
  },
  {
    name: 'Amit Kumar',
    email: 'amit@inspect.com',
    mobile: '+91 9876543213',
    address: 'Diagnostics Lab #2',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'INSPECTOR',
    organizationName: 'Inspect Solutions',
    accountStatus: 'ACTIVE'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@recycle.com',
    mobile: '+91 9876543214',
    address: 'Smelting Hub #1',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'RECYCLER',
    organizationName: 'GreenRecycle Ltd',
    accountStatus: 'ACTIVE'
  },
  {
    name: 'System Admin',
    email: 'admin@ecotrack.com',
    mobile: '+91 9876543215',
    address: 'EcoTrack Headquarters',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'ADMIN',
    organizationName: 'EcoTrack System Authority',
    accountStatus: 'ACTIVE'
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in backend/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected! Resetting existing collections for clean seed...');

    await User.deleteMany({});
    await Item.deleteMany({});
    await TrackingHistory.deleteMany({});
    await Counter.deleteMany({});

    // Seed users
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`✅ Seeded ${createdUsers.length} users`);

    const customerUser = createdUsers.find(u => u.email === 'rahul@gmail.com');
    const collectionUser = createdUsers.find(u => u.role === 'COLLECTION_CENTRE');
    const transporterUser = createdUsers.find(u => u.role === 'TRANSPORTER');
    const inspectorUser = createdUsers.find(u => u.role === 'INSPECTOR');
    const recyclerUser = createdUsers.find(u => u.role === 'RECYCLER');

    // Seed items
    const seedItems = [
      {
        itemId: 'EW00123',
        ownerId: customerUser._id,
        deviceName: 'Dell Laptop Inspiron 15',
        category: 'LAPTOP',
        condition: 'PARTIALLY_WORKING',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: 'Dell Inspiron 15, power supply included, working screen',
        currentStatus: 'IN_TRANSIT',
        qrCodeUrl: '/track/EW00123'
      },
      {
        itemId: 'EW00122',
        ownerId: customerUser._id,
        deviceName: 'iPhone 11 Mobile Phone',
        category: 'MOBILE',
        condition: 'DAMAGED_SCRAP',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: 'iPhone 11 with cracked back glass',
        currentStatus: 'COLLECTED',
        qrCodeUrl: '/track/EW00122'
      },
      {
        itemId: 'EW00121',
        ownerId: customerUser._id,
        deviceName: 'Dell 24 inch LCD Monitor',
        category: 'DESKTOP',
        condition: 'NON_WORKING',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: '24 inch LCD monitor, backlight failed',
        currentStatus: 'PROCESSED',
        qrCodeUrl: '/track/EW00121',
        inspectionDecision: 'SEND_FOR_RECYCLING',
        inspectionNotes: 'Panel dead, salvage copper & plastics',
        inspectedAt: new Date('2025-03-09T10:00:00Z'),
        inspectedBy: inspectorUser._id
      },
      {
        itemId: 'EW00120',
        ownerId: customerUser._id,
        deviceName: 'HP LaserJet Printer',
        category: 'APPLIANCE',
        condition: 'PARTIALLY_WORKING',
        quantity: 1,
        pickupLocation: 'Kothrud, Pune',
        description: 'LaserJet monochrome printer, rollers jammed',
        currentStatus: 'UNDER_INSPECTION',
        qrCodeUrl: '/track/EW00120'
      }
    ];

    const createdItems = await Item.insertMany(seedItems);
    console.log(`✅ Seeded ${createdItems.length} items`);

    // Seed tracking histories
    const item123 = createdItems.find(i => i.itemId === 'EW00123');
    const trackingEvents = [
      {
        itemId: 'EW00123',
        itemRef: item123._id,
        status: 'REGISTERED',
        location: 'Pune, Maharashtra',
        notes: 'Citizen registered item online for pickup.',
        roleAtEvent: 'CUSTOMER',
        performedBy: customerUser._id,
        createdAt: new Date('2025-03-12T10:30:00Z')
      },
      {
        itemId: 'EW00123',
        itemRef: item123._id,
        status: 'COLLECTED',
        location: 'Kothrud Collection Hub, Pune',
        notes: 'Handover complete. Unit verified against QR manifest.',
        roleAtEvent: 'COLLECTION_CENTRE',
        performedBy: collectionUser._id,
        createdAt: new Date('2025-03-13T11:00:00Z')
      },
      {
        itemId: 'EW00123',
        itemRef: item123._id,
        status: 'IN_TRANSIT',
        location: 'Express Logistics Van #4, Mumbai Highway',
        notes: 'En route to Western Diagnostic Inspection Centre.',
        roleAtEvent: 'TRANSPORTER',
        performedBy: transporterUser._id,
        createdAt: new Date('2025-03-14T09:20:00Z')
      }
    ];

    await TrackingHistory.insertMany(trackingEvents);
    console.log(`✅ Seeded ${trackingEvents.length} tracking checkpoints`);

    // Initialize sequence counter
    await Counter.create({ _id: 'itemId', seq: 125 });
    console.log('✅ Sequence counter initialized to 125');

    console.log('\n🎉 MongoDB Atlas successfully populated with EcoTrack seed data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding MongoDB Atlas:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
