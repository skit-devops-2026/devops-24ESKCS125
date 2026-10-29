const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner';
    console.log(`[MongoDB] Connecting to: ${connStr.replace(/:([^@]+)@/, ':****@')}`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Could not connect: ${error.message}`);
    console.warn(`[MongoDB] Running in fallback mode. When MongoDB is ready, connect via .env (MONGODB_URI)`);
  }
};

module.exports = connectDB;
