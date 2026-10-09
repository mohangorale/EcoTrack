const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    mobile: {
      type: String,
      trim: true,
      default: ''
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false // Never returned in default queries
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'COLLECTION_CENTRE', 'TRANSPORTER', 'INSPECTOR', 'RECYCLER', 'ADMIN'],
      default: 'CUSTOMER'
    },
    organizationName: {
      type: String,
      trim: true,
      default: ''
    },
    accountStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, accountStatus: 1 });

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
