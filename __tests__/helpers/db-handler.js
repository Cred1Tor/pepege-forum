import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  if (mongod) {
    const { collections } = mongoose.connection;

    Object.values(collections).forEach(async (collection) => {
      await collection.deleteMany();
    });
  }
};

const clearCollection = async (collection) => {
  if (mongod) {
    await mongoose.connection.collections[collection].deleteMany();
  }
};

export default {
  connect,
  closeDatabase,
  clearDatabase,
  clearCollection,
};
