import {MongoClient} from 'mongodb';

// Replace the uri string with your connection string.
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

const initDB = async (fastify) => {
  
  try {
    const database = client.db('wt');
    const weights = database.collection('weight');
    fastify.decorate('conf', {
      coll: weights,
    })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export default initDB;
