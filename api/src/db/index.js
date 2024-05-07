'use strict';

import {MongoClient} from 'mongodb';

// Replace the uri string with your connection string.
const uri = 'mongodb://mongodb:27017';
const COLLECTION = 'weights';

const client = new MongoClient(uri);

const setupCollection = async (database) => {
  try {
  database.createCollection(
    COLLECTION,
    {
      timeseries: {
        timeField: "timestamp",
        metaField: "metadata"
      }
    }
  );
  } catch (err) {
    console.error({err});
  }
};

const initDB = async (fastify) => {
  try {
    const database = client.db('wt');
    // await setupCollection(database);
    const weights = database.collection(COLLECTION);
    console.log({weights});
    fastify.decorate('conf', {
      weights,
    })
  } catch (err) {
    console.error({err});
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export default initDB;
