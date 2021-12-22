import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replset;

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  replset = await MongoMemoryReplSet.create();
  const uri = replset.getUri();

  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  if (replset) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await replset.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  if (replset) {
    const { collections } = mongoose.connection;

    Object.values(collections).forEach(async (collection) => {
      await collection.deleteMany();
    });
  }
};

const clearCollection = async (collection) => {
  if (replset) {
    await mongoose.connection.collections[collection].deleteMany();
  }
};

export default {
  connect,
  closeDatabase,
  clearDatabase,
  clearCollection,
};
