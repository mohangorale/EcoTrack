const bcrypt = require('bcryptjs');

// Pre-seeded demo users with bcrypt hashed passwords ('Password123!')
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

class DataStore {
  constructor() {
    this.counters = { itemId: 125 };
    
    this.users = [
      {
        id: 'usr_customer_1',
        name: 'Rahul Patil',
        email: 'rahul@gmail.com',
        mobile: '+91 9876543210',
        address: 'Pune, Maharashtra',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'CUSTOMER',
        organizationName: 'EcoCitizen',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-01T09:00:00Z'
      },
      {
        id: 'usr_collection_1',
        name: 'Sneha Joshi',
        email: 'sneha@collect.com',
        mobile: '+91 9876543211',
        address: 'Mumbai Central Depot',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'COLLECTION_CENTRE',
        organizationName: 'EcoCollect Depot',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-02T09:00:00Z'
      },
      {
        id: 'usr_transporter_1',
        name: 'Vikram Singh',
        email: 'vikram@transport.com',
        mobile: '+91 9876543212',
        address: 'Fleet Bay 4',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'TRANSPORTER',
        organizationName: 'EcoFreight Logistics Fleet',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-03T09:00:00Z'
      },
      {
        id: 'usr_inspector_1',
        name: 'Amit Kumar',
        email: 'amit@inspect.com',
        mobile: '+91 9876543213',
        address: 'Diagnostics Lab #2',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'INSPECTOR',
        organizationName: 'Inspect Solutions',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-04T09:00:00Z'
      },
      {
        id: 'usr_recycler_1',
        name: 'Priya Sharma',
        email: 'priya@recycle.com',
        mobile: '+91 9876543214',
        address: 'Smelting Hub #1',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'RECYCLER',
        organizationName: 'GreenRecycle Ltd',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-05T09:00:00Z'
      },
      {
        id: 'usr_admin_1',
        name: 'Admin',
        email: 'admin@ecotrack.com',
        mobile: '+91 9876543215',
        address: 'EcoTrack Headquarters',
        passwordHash: DEMO_PASSWORD_HASH,
        role: 'ADMIN',
        organizationName: 'EcoTrack System Authority',
        accountStatus: 'ACTIVE',
        createdAt: '2025-03-01T08:00:00Z'
      }
    ];

    this.items = [
      {
        id: 'item_123',
        itemId: 'EW00123',
        ownerId: 'usr_customer_1',
        deviceName: 'Laptop',
        brand: 'Dell',
        category: 'Computers',
        condition: 'Used',
        weight: '2.5',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: 'Dell Inspiron 15, power supply included, working screen',
        currentStatus: 'IN_TRANSIT',
        qrCodeUrl: '/track/EW00123',
        inspectionDecision: null,
        inspectionNotes: '',
        inspectedAt: null,
        inspectedBy: null,
        photoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-12T10:30:00Z',
        lastUpdatedAt: '2025-03-14T09:20:00Z'
      },
      {
        id: 'item_122',
        itemId: 'EW00122',
        ownerId: 'usr_customer_1',
        deviceName: 'Mobile Phone',
        brand: 'Apple',
        category: 'Mobile',
        condition: 'Damaged',
        weight: '0.4',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: 'iPhone 11 with cracked back glass',
        currentStatus: 'COLLECTED',
        qrCodeUrl: '/track/EW00122',
        inspectionDecision: null,
        inspectionNotes: '',
        inspectedAt: null,
        inspectedBy: null,
        photoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-10T14:15:00Z',
        lastUpdatedAt: '2025-03-13T14:15:00Z'
      },
      {
        id: 'item_121',
        itemId: 'EW00121',
        ownerId: 'usr_customer_1',
        deviceName: 'Monitor',
        brand: 'Dell',
        category: 'Computers',
        condition: 'Scrap',
        weight: '4.2',
        quantity: 1,
        pickupLocation: 'Pune, Maharashtra',
        description: '24 inch LCD monitor, backlight failed',
        currentStatus: 'PROCESSED',
        qrCodeUrl: '/track/EW00121',
        inspectionDecision: 'SEND_FOR_RECYCLING',
        inspectionNotes: 'Panel dead, salvage copper & plastics',
        inspectedAt: '2025-03-09T10:00:00Z',
        inspectedBy: 'usr_inspector_1',
        photoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-08T09:00:00Z',
        lastUpdatedAt: '2025-03-11T16:00:00Z'
      },
      {
        id: 'item_120',
        itemId: 'EW00120',
        ownerId: 'usr_customer_1',
        deviceName: 'Printer',
        brand: 'HP',
        category: 'Peripherals',
        condition: 'Used',
        weight: '5.0',
        quantity: 1,
        pickupLocation: 'Kothrud, Pune',
        description: 'LaserJet monochrome printer, rollers jammed',
        currentStatus: 'UNDER_INSPECTION',
        qrCodeUrl: '/track/EW00120',
        inspectionDecision: null,
        inspectionNotes: '',
        inspectedAt: null,
        inspectedBy: null,
        photoUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-09T11:00:00Z',
        lastUpdatedAt: '2025-03-14T08:00:00Z'
      },
      {
        id: 'item_119',
        itemId: 'EW00119',
        ownerId: 'usr_customer_1',
        deviceName: 'Monitor',
        brand: 'Samsung',
        category: 'Computers',
        condition: 'Damaged',
        weight: '3.8',
        quantity: 1,
        pickupLocation: 'Shivajinagar, Pune',
        description: 'Curved monitor, cracked panel matrix',
        currentStatus: 'SENT_FOR_RECYCLING',
        qrCodeUrl: '/track/EW00119',
        inspectionDecision: 'SEND_FOR_RECYCLING',
        inspectionNotes: 'Irreparable display fault. Routed to smelter.',
        inspectedAt: '2025-03-10T12:00:00Z',
        inspectedBy: 'usr_inspector_1',
        photoUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-08T15:00:00Z',
        lastUpdatedAt: '2025-03-12T11:00:00Z'
      },
      {
        id: 'item_118',
        itemId: 'EW00118',
        ownerId: 'usr_customer_1',
        deviceName: 'Keyboard',
        brand: 'Logitech',
        category: 'Peripherals',
        condition: 'Working',
        weight: '0.8',
        quantity: 1,
        pickupLocation: 'Baner, Pune',
        description: 'Mechanical keyboard with cord',
        currentStatus: 'COLLECTED',
        qrCodeUrl: '/track/EW00118',
        inspectionDecision: null,
        inspectionNotes: '',
        inspectedAt: null,
        inspectedBy: null,
        photoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        createdAt: '2025-03-07T10:00:00Z',
        lastUpdatedAt: '2025-03-08T14:00:00Z'
      }
    ];

    this.trackingHistory = [
      // EW00123
      {
        id: 'hist_123_1',
        itemId: 'EW00123',
        status: 'REGISTERED',
        location: 'Pune, Maharashtra',
        notes: 'Item registered by customer',
        roleAtEvent: 'CUSTOMER',
        performedBy: 'usr_customer_1',
        createdAt: '2025-03-12T10:30:00Z'
      },
      {
        id: 'hist_123_2',
        itemId: 'EW00123',
        status: 'COLLECTED',
        location: 'Picked up from location',
        notes: 'Intake confirmed at Pune Hub',
        roleAtEvent: 'COLLECTION_CENTRE',
        performedBy: 'usr_collection_1',
        createdAt: '2025-03-13T14:15:00Z'
      },
      {
        id: 'hist_123_3',
        itemId: 'EW00123',
        status: 'IN_TRANSIT',
        location: 'On the way to recycling facility',
        notes: 'Dispatched with logistics van',
        roleAtEvent: 'TRANSPORTER',
        performedBy: 'usr_transporter_1',
        createdAt: '2025-03-14T09:20:00Z'
      },

      // EW00122
      {
        id: 'hist_122_1',
        itemId: 'EW00122',
        status: 'REGISTERED',
        location: 'Pune, Maharashtra',
        notes: 'Item registered by customer',
        roleAtEvent: 'CUSTOMER',
        performedBy: 'usr_customer_1',
        createdAt: '2025-03-10T14:15:00Z'
      },
      {
        id: 'hist_122_2',
        itemId: 'EW00122',
        status: 'COLLECTED',
        location: 'EcoCollect Depot',
        notes: 'Received at collection center',
        roleAtEvent: 'COLLECTION_CENTRE',
        performedBy: 'usr_collection_1',
        createdAt: '2025-03-13T14:15:00Z'
      },

      // EW00121
      {
        id: 'hist_121_1',
        itemId: 'EW00121',
        status: 'REGISTERED',
        location: 'Pune, Maharashtra',
        notes: 'Item registered by customer',
        roleAtEvent: 'CUSTOMER',
        performedBy: 'usr_customer_1',
        createdAt: '2025-03-08T09:00:00Z'
      },
      {
        id: 'hist_121_2',
        itemId: 'EW00121',
        status: 'COLLECTED',
        location: 'Pune Kiosk',
        notes: 'Collected scrap',
        roleAtEvent: 'COLLECTION_CENTRE',
        performedBy: 'usr_collection_1',
        createdAt: '2025-03-08T11:00:00Z'
      },
      {
        id: 'hist_121_3',
        itemId: 'EW00121',
        status: 'IN_TRANSIT',
        location: 'Transit Route 14',
        notes: 'Cargo dispatched',
        roleAtEvent: 'TRANSPORTER',
        performedBy: 'usr_transporter_1',
        createdAt: '2025-03-08T16:00:00Z'
      },
      {
        id: 'hist_121_4',
        itemId: 'EW00121',
        status: 'UNDER_INSPECTION',
        location: 'Diagnostics Hub',
        notes: 'Tested scrap',
        roleAtEvent: 'INSPECTOR',
        performedBy: 'usr_inspector_1',
        createdAt: '2025-03-09T10:00:00Z'
      },
      {
        id: 'hist_121_5',
        itemId: 'EW00121',
        status: 'SENT_FOR_RECYCLING',
        location: 'Diagnostics Hub',
        notes: 'Sent for recycling',
        roleAtEvent: 'INSPECTOR',
        performedBy: 'usr_inspector_1',
        createdAt: '2025-03-09T14:00:00Z'
      },
      {
        id: 'hist_121_6',
        itemId: 'EW00121',
        status: 'PROCESSED',
        location: 'GreenRecycle Smelter',
        notes: 'Recycled & shredded successfully',
        roleAtEvent: 'RECYCLER',
        performedBy: 'usr_recycler_1',
        createdAt: '2025-03-11T16:00:00Z'
      }
    ];
  }

  // Normalize ID (EW-00123 -> EW00123, EW-0001 -> EW0001)
  normalizeId(id) {
    if (!id) return '';
    return id.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  // --- MongoDB Synchronization ---
  async syncWithMongo() {
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) return;

      const User = require('../models/User');
      const Item = require('../models/Item');
      const TrackingHistory = require('../models/TrackingHistory');

      const mongoUsers = await User.find({}).lean();
      if (mongoUsers && mongoUsers.length > 0) {
        mongoUsers.forEach(u => {
          const idx = this.users.findIndex(x => x.email.toLowerCase() === u.email.toLowerCase());
          const userObj = {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            mobile: u.mobile || '',
            address: u.address || '',
            passwordHash: u.passwordHash,
            role: u.role,
            organizationName: u.organizationName || '',
            accountStatus: u.accountStatus || 'ACTIVE',
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
          };
          if (idx >= 0) {
            this.users[idx] = { ...this.users[idx], ...userObj };
          } else {
            this.users.push(userObj);
          }
        });
      }

      const mongoItems = await Item.find({}).lean();
      if (mongoItems && mongoItems.length > 0) {
        mongoItems.forEach(i => {
          const idx = this.items.findIndex(x => this.normalizeId(x.itemId) === this.normalizeId(i.itemId));
          const itemObj = {
            id: i._id.toString(),
            itemId: i.itemId,
            ownerId: i.ownerId ? i.ownerId.toString() : 'usr_customer_1',
            deviceName: i.deviceName,
            brand: i.brand || '',
            category: i.category,
            condition: i.condition,
            weight: i.weight ? String(i.weight) : '1.0',
            quantity: i.quantity || 1,
            pickupLocation: i.pickupLocation,
            description: i.description || '',
            currentStatus: i.currentStatus,
            qrCodeUrl: i.qrCodeUrl || `/track/${i.itemId}`,
            inspectionDecision: i.inspectionDecision || null,
            inspectionNotes: i.inspectionNotes || '',
            inspectedAt: i.inspectedAt ? new Date(i.inspectedAt).toISOString() : null,
            inspectedBy: i.inspectedBy ? i.inspectedBy.toString() : null,
            photoUrl: i.photoUrl || '',
            createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : new Date().toISOString(),
            lastUpdatedAt: i.lastUpdatedAt ? new Date(i.lastUpdatedAt).toISOString() : new Date().toISOString()
          };
          if (idx >= 0) {
            this.items[idx] = { ...this.items[idx], ...itemObj };
          } else {
            this.items.push(itemObj);
          }
        });
      }

      const mongoHistory = await TrackingHistory.find({}).sort({ createdAt: 1 }).lean();
      if (mongoHistory && mongoHistory.length > 0) {
        mongoHistory.forEach(h => {
          const exists = this.trackingHistory.some(x => 
            this.normalizeId(x.itemId) === this.normalizeId(h.itemId) && 
            x.status === h.status
          );
          if (!exists) {
            this.trackingHistory.push({
              id: h._id.toString(),
              itemId: h.itemId,
              status: h.status,
              location: h.location,
              notes: h.notes || '',
              roleAtEvent: h.roleAtEvent,
              performedBy: h.performedBy ? h.performedBy.toString() : 'usr_staff_1',
              createdAt: h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString()
            });
          }
        });
      }

      console.log(`📦 DataStore synchronized with MongoDB Atlas (${this.users.length} users, ${this.items.length} items, ${this.trackingHistory.length} checkpoints)`);
    } catch (err) {
      console.warn('MongoDB store sync warning:', err.message);
    }
  }

  // --- Sequences ---
  getNextItemId() {
    this.counters.itemId += 1;
    const padded = String(this.counters.itemId).padStart(5, '0');
    return `EW${padded}`;
  }

  // --- Users ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      mobile: userData.mobile || '',
      address: userData.address || '',
      passwordHash: userData.passwordHash,
      role: userData.role || 'CUSTOMER',
      organizationName: userData.organizationName || '',
      accountStatus: userData.accountStatus || 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);

    // Asynchronously persist to MongoDB Atlas if connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        const User = require('../models/User');
        User.create({
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          passwordHash: newUser.passwordHash,
          role: newUser.role,
          organizationName: newUser.organizationName,
          accountStatus: newUser.accountStatus
        }).catch(err => console.warn('Atlas user persist warning:', err.message));
      } catch (err) {
        console.warn('Atlas user persist error:', err.message);
      }
    }

    return newUser;
  }

  updateUserProfile(userId, { name, mobile, address, organizationName }) {
    const user = this.findUserById(userId);
    if (!user) return null;
    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (address !== undefined) user.address = address;
    if (organizationName !== undefined) user.organizationName = organizationName;
    return user;
  }

  updateUserStatus(userId, accountStatus) {
    const user = this.findUserById(userId);
    if (!user) return null;
    user.accountStatus = accountStatus;
    return user;
  }

  getAllUsers() {
    return this.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      address: u.address,
      role: u.role,
      organizationName: u.organizationName,
      accountStatus: u.accountStatus,
      createdAt: u.createdAt
    }));
  }

  // --- Items ---
  findItemByItemId(itemId) {
    if (!itemId) return null;
    const norm = this.normalizeId(itemId);
    return this.items.find(i => this.normalizeId(i.itemId) === norm);
  }

  createItem(itemData, ownerId) {
    const itemId = this.getNextItemId();
    const now = new Date().toISOString();
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      itemId,
      ownerId,
      deviceName: itemData.deviceName || itemData.name || 'Electronic Item',
      brand: itemData.brand || '',
      category: itemData.category || 'Computers',
      condition: itemData.condition || 'Used',
      weight: itemData.weight ? String(itemData.weight) : '1.0',
      quantity: Number(itemData.quantity) || 1,
      pickupLocation: itemData.pickupLocation || 'Pickup Address',
      description: itemData.description || '',
      currentStatus: 'REGISTERED',
      qrCodeUrl: `/track/${itemId}`,
      inspectionDecision: null,
      inspectionNotes: '',
      inspectedAt: null,
      inspectedBy: null,
      photoUrl: itemData.photoUrl || '',
      createdAt: now,
      lastUpdatedAt: now
    };
    this.items.unshift(newItem);

    // Append initial history
    this.appendHistory({
      itemId,
      status: 'REGISTERED',
      location: newItem.pickupLocation,
      notes: newItem.description || 'Item registered by customer',
      roleAtEvent: 'CUSTOMER',
      performedBy: ownerId,
      createdAt: now
    });

    // Asynchronously persist to MongoDB Atlas if connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        const Item = require('../models/Item');
        const User = require('../models/User');
        User.findOne({ email: 'rahul@gmail.com' }).then(u => {
          const ownerMongoId = (u && u._id) || (mongoose.Types.ObjectId.isValid(ownerId) ? ownerId : new mongoose.Types.ObjectId());
          return Item.create({
            itemId,
            ownerId: ownerMongoId,
            deviceName: newItem.deviceName,
            category: newItem.category === 'Computers' ? 'LAPTOP' : (['LAPTOP', 'MOBILE', 'DESKTOP', 'TABLET', 'ACCESSORIES', 'APPLIANCE'].includes(newItem.category) ? newItem.category : 'OTHER'),
            condition: newItem.condition === 'Used' ? 'PARTIALLY_WORKING' : (['WORKING', 'PARTIALLY_WORKING', 'NON_WORKING', 'DAMAGED_SCRAP'].includes(newItem.condition) ? newItem.condition : 'NON_WORKING'),
            quantity: newItem.quantity,
            pickupLocation: newItem.pickupLocation,
            description: newItem.description,
            currentStatus: 'REGISTERED',
            qrCodeUrl: newItem.qrCodeUrl
          });
        }).catch(err => console.warn('Atlas item persist warning:', err.message));
      } catch (err) {
        console.warn('Atlas item persist error:', err.message);
      }
    }

    return newItem;
  }

  getItemsByOwner(ownerId, { status, page = 1, limit = 50 } = {}) {
    let filtered = this.items.filter(i => i.ownerId === ownerId);
    if (status) {
      filtered = filtered.filter(i => i.currentStatus === status);
    }
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    return { items, total };
  }

  getAllItems({ status, category, page = 1, limit = 50 } = {}) {
    let filtered = [...this.items];
    if (status) {
      filtered = filtered.filter(i => i.currentStatus === status);
    }
    if (category) {
      filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    return { items, total };
  }

  updateItemStatus(itemId, newStatus, location, notes, actor) {
    const item = this.findItemByItemId(itemId);
    if (!item) return null;

    const now = new Date().toISOString();
    item.currentStatus = newStatus;
    item.lastUpdatedAt = now;

    const historyEvent = this.appendHistory({
      itemId: item.itemId,
      status: newStatus,
      location: location || 'EcoTrack Hub',
      notes: notes || '',
      roleAtEvent: actor.role,
      performedBy: actor.id,
      createdAt: now
    });

    // Asynchronously persist to MongoDB Atlas if connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        const Item = require('../models/Item');
        const TrackingHistory = require('../models/TrackingHistory');
        Item.findOneAndUpdate(
          { itemId: item.itemId },
          { currentStatus: newStatus, lastUpdatedAt: new Date(now) }
        ).then(foundItem => {
          if (foundItem) {
            TrackingHistory.create({
              itemId: item.itemId,
              itemRef: foundItem._id,
              status: newStatus,
              location: location || 'EcoTrack Hub',
              notes: notes || '',
              roleAtEvent: actor.role || 'ADMIN',
              performedBy: (mongoose.Types.ObjectId.isValid(actor.id) ? actor.id : foundItem.ownerId),
              createdAt: new Date(now)
            }).catch(e => console.warn('Atlas history write warning:', e.message));
          }
        }).catch(e => console.warn('Atlas status update warning:', e.message));
      } catch (err) {
        console.warn('Atlas status update error:', err.message);
      }
    }

    return { item, historyEvent };
  }

  recordInspection(itemId, decision, notes, actor) {
    const item = this.findItemByItemId(itemId);
    if (!item) return null;

    const now = new Date().toISOString();
    item.inspectionDecision = decision;
    item.inspectionNotes = notes || '';
    item.inspectedAt = now;
    item.inspectedBy = actor.id;

    let resultingStatus = item.currentStatus;
    if (decision === 'SEND_FOR_RECYCLING') {
      resultingStatus = 'SENT_FOR_RECYCLING';
      item.currentStatus = resultingStatus;
    }
    item.lastUpdatedAt = now;

    this.appendHistory({
      itemId: item.itemId,
      status: resultingStatus,
      location: 'Diagnostics Hub',
      notes: `Inspection Decision: ${decision}. ${notes || ''}`,
      roleAtEvent: actor.role,
      performedBy: actor.id,
      createdAt: now
    });

    // Asynchronously persist to MongoDB Atlas if connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        const Item = require('../models/Item');
        const TrackingHistory = require('../models/TrackingHistory');
        Item.findOneAndUpdate(
          { itemId: item.itemId },
          {
            currentStatus: resultingStatus,
            inspectionDecision: decision,
            inspectionNotes: notes || '',
            inspectedAt: new Date(now),
            lastUpdatedAt: new Date(now)
          }
        ).then(foundItem => {
          if (foundItem) {
            TrackingHistory.create({
              itemId: item.itemId,
              itemRef: foundItem._id,
              status: resultingStatus,
              location: 'Diagnostics Hub',
              notes: `Inspection Decision: ${decision}. ${notes || ''}`,
              roleAtEvent: actor.role || 'INSPECTOR',
              performedBy: (mongoose.Types.ObjectId.isValid(actor.id) ? actor.id : foundItem.ownerId),
              createdAt: new Date(now)
            }).catch(e => console.warn('Atlas inspection history warning:', e.message));
          }
        }).catch(e => console.warn('Atlas inspection write warning:', e.message));
      } catch (err) {
        console.warn('Atlas inspection write error:', err.message);
      }
    }

    return item;
  }

  // --- Tracking History ---
  appendHistory({ itemId, status, location, notes, roleAtEvent, performedBy, createdAt }) {
    const historyEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      itemId,
      status,
      location,
      notes,
      roleAtEvent,
      performedBy,
      createdAt: createdAt || new Date().toISOString()
    };
    this.trackingHistory.push(historyEntry);
    return historyEntry;
  }

  getHistoryByItemId(itemId) {
    const norm = this.normalizeId(itemId);
    return this.trackingHistory
      .filter(h => this.normalizeId(h.itemId) === norm)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // --- Statistics ---
  getDashboardStats() {
    const counts = {
      totalItems: 3256, // Mockup aggregate or live items
      actualCount: this.items.length,
      registered: 20,
      collected: 18,
      inTransit: 1280,
      underInspection: 13,
      refurbished: 12,
      sentForRecycling: 18,
      processed: 980,
      totalUsers: 25
    };

    // Calculate real status distribution from current memory
    this.items.forEach(item => {
      switch (item.currentStatus) {
        case 'REGISTERED': counts.registered++; break;
        case 'COLLECTED': counts.collected++; break;
        case 'IN_TRANSIT': counts.inTransit++; break;
        case 'UNDER_INSPECTION': counts.underInspection++; break;
        case 'REFURBISHED': counts.refurbished++; break;
        case 'SENT_FOR_RECYCLING': counts.sentForRecycling++; break;
        case 'PROCESSED': counts.processed++; break;
      }
    });

    return counts;
  }
}

// Singleton in-memory store
const store = new DataStore();

module.exports = store;
