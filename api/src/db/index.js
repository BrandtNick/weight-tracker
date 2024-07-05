'use strict';

import {MongoClient} from 'mongodb';

import {DATABASE_NAME} from '../constants.js';

// Replace the uri string with your connection string.
const MONGO_URL = 'mongodb://mongodb:27017';
const WEIGHTS_COLLECTION = 'weights';
const USERS_COLLECTION = 'users';

const client = new MongoClient(MONGO_URL);

const setupCollection = async (db) => {
  console.info('Setting up collections');
  const collections = await db 
    .listCollections()
    .toArray();
  const collectionNames = collections.map(({name}) => name);
  const weightCollectionExists = collectionNames.includes(WEIGHTS_COLLECTION);
  const userCollectionExists = collectionNames.includes(USERS_COLLECTION);
  if (!weightCollectionExists) {
    try {
      db.createCollection(
        WEIGHTS_COLLECTION,
        {
          timeseries: {
            timeField: "timestamp",
            metaField: "metadata"
          }
        }
      );
    } catch (err) {
      console.error(`Error creating collection ${WEIGHTS_COLLECTION}`, err);
    }
  }
  if (!userCollectionExists) {
    try {
      db.createCollection(USERS_COLLECTION);
    } catch (err) {
      console.error(`Error creating collection ${USERS_COLLECTION}`, err);
    }
  }

  console.info('Collections setup complete');
};

const initDB = async (fastify) => {
  try {
    const db = client.db(DATABASE_NAME);
    await setupCollection(db);
    const weights = db.collection(WEIGHTS_COLLECTION);
    const users = db.collection(USERS_COLLECTION);
    users.createIndex('username', {unique: true})
    fastify.decorate('conf', {weights, users});
  } catch (err) {
    console.error('Error connecting to DB', err);
    await client.close();
  }
}

export default initDB;
