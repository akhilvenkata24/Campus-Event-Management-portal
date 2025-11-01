const mongoose = require('mongoose');

let isConnected = false; // Track connection status for serverless

const connectDB = async () => {
  // If already connected (for serverless reuse), return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-events';
  const options = {
    serverSelectionTimeoutMS: 10000, // Increased for serverless
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000
  };

  try {
    const conn = await mongoose.connect(uri, options);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connect
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    // Only close on SIGINT if not in serverless environment
    if (!process.env.VERCEL) {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    }

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnected = false;
    // Don't exit in serverless - let the function handle the error
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err; // Throw error for proper handling
  }
};

module.exports = connectDB;
