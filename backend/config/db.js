const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // 1. Try to connect to provided MONGO_URI if explicitly set
  if (uri && uri !== 'mongodb://127.0.0.1:27017/resume_ai') {
    try {
      console.log(`[DB] Attempting connection to custom MongoDB URI...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB] Failed to connect to specified MONGO_URI (${err.message}). Trying fallback...`);
    }
  }

  // 2. Try default local MongoDB
  try {
    const localUri = uri || 'mongodb://127.0.0.1:27017/resume_ai';
    console.log(`[DB] Attempting local MongoDB connection at ${localUri}...`);
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Connected to local MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[DB] Local MongoDB not reachable (${localErr.message}).`);
    console.log(`[DB] Initializing embedded MongoDB engine (mongodb-memory-server)...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[DB] Successfully connected to Embedded MongoDB at: ${memoryUri}`);
      console.log(`[DB] Ready for all operations (User, Resume, Analysis models active).`);
      return conn;
    } catch (memErr) {
      console.error(`[DB] Critical Error: Unable to initialize embedded MongoDB: ${memErr.message}`);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (e) {
    console.error('Error disconnecting DB:', e);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
