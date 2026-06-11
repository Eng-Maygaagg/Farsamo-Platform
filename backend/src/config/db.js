const mongoose = require('mongoose');
require('dotenv').config();

let memoryServer;

const isAtlasSrvDnsError = (error) =>
  ['ECONNREFUSED', 'ETIMEOUT'].includes(error.code) && error.syscall === 'querySrv';

const getMemoryDbUri = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: 'farsamo' },
    binary: { version: process.env.MONGOMS_VERSION || '6.0.14' },
  });
  console.log('Using in-memory MongoDB for development');
  return memoryServer.getUri();
};

const getConnectionErrorHelp = (error) => {
  if (isAtlasSrvDnsError(error)) {
    return [
      'Atlas SRV DNS lookup failed.',
      'Try switching your computer DNS to 8.8.8.8 or 1.1.1.1, disabling VPN/proxy restrictions, or using the non-SRV Atlas connection string.',
      'Also confirm your current IP address is allowed in MongoDB Atlas Network Access.',
    ].join(' ');
  }

  return null;
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    let uri = process.env.MONGODB_URI;

    if (process.env.USE_MEMORY_DB === 'true') {
      try {
        uri = await getMemoryDbUri();
      } catch (memoryError) {
        if (!uri) throw memoryError;
        process.env.USE_MEMORY_DB = 'false';
        console.warn(`In-memory MongoDB unavailable, using MONGODB_URI instead: ${memoryError.message}`);
      }
    }

    if (!uri) {
      throw new Error('MONGODB_URI is required unless USE_MEMORY_DB=true can start successfully');
    }

    let conn;
    try {
      conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (connectionError) {
      if (process.env.NODE_ENV === 'development' && process.env.USE_MEMORY_DB !== 'true' && isAtlasSrvDnsError(connectionError)) {
        console.warn('Atlas SRV DNS lookup failed; falling back to in-memory MongoDB for local development.');
        uri = await getMemoryDbUri();
        conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      } else {
        throw connectionError;
      }
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    const help = getConnectionErrorHelp(error);
    if (help) {
      console.error(help);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
