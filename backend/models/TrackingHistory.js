const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      index: true
    },
    itemRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    status: {
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
      ]
    },
    location: {
      type: String,
      required: [true, 'Checkpoint location is required'],
      trim: true,
      maxlength: 200
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    roleAtEvent: {
      type: String,
      required: true,
      enum: ['CUSTOMER', 'COLLECTION_CENTRE', 'TRANSPORTER', 'INSPECTOR', 'RECYCLER', 'ADMIN']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  { timestamps: false }
);

trackingHistorySchema.index({ itemId: 1, createdAt: 1 });
trackingHistorySchema.index({ performedBy: 1, createdAt: -1 });

module.exports = mongoose.model('TrackingHistory', trackingHistorySchema);
