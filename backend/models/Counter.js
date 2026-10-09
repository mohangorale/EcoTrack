const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextItemId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'itemId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const paddedNumber = String(counter.seq).padStart(4, '0');
  return `EW-${paddedNumber}`;
}

module.exports = { Counter, getNextItemId };
