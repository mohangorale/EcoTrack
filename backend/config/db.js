const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  No MONGODB_URI found in backend/.env — operating with fast in-memory persistence adapter.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('⚠️  Falling back to in-memory persistence so application remains active.');
    return null;
  }
}

module.exports = connectDB;
