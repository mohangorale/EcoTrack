const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    deviceName: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      maxlength: 150
    },
    category: {
      type: String,
      required: true,
      enum: ['LAPTOP', 'MOBILE', 'DESKTOP', 'TABLET', 'ACCESSORIES', 'APPLIANCE', 'OTHER'],
      default: 'OTHER'
    },
    condition: {
      type: String,
      required: true,
      enum: ['WORKING', 'PARTIALLY_WORKING', 'NON_WORKING', 'DAMAGED_SCRAP'],
      default: 'NON_WORKING'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
      maxlength: 250
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    weight: {
      type: Number,
      default: 1.0
    },
    photoUrl: {
      type: String,
      default: ''
    },
    currentStatus: {
      type: String,
      required: true,
      enum: [
        'REGISTERED',
        'COLLECTED',
        'IN_TRANSIT',
        'UNDER_INSPECTION',
        'REFURBISHED',
        'SENT_FOR_RECYCLING',
        'PROCESSED'
      ],
      default: 'REGISTERED',
      index: true
    },
    qrCodeUrl: {
      type: String,
      required: true
    },
    inspectionDecision: {
      type: String,
      enum: ['APPROVE_REFURBISHMENT', 'SEND_FOR_RECYCLING', null],
      default: null
    },
    inspectionNotes: {
      type: String,
      default: ''
    },
    inspectedAt: {
      type: Date,
      default: null
    },
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

itemSchema.index({ ownerId: 1, createdAt: -1 });
itemSchema.index({ currentStatus: 1, category: 1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
