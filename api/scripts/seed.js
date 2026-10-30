'use strict';

import bcrypt from 'bcryptjs';
import {MongoClient} from 'mongodb';

import {DATABASE_NAME} from '../src/constants.js';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const TEST_USERNAME = 'test';
const TEST_PASSWORD = 'test';
const SEED_ID = 'test-user-v3';
const MANAGED_SEED_IDS = ['test-user-v1', 'test-user-v2', SEED_ID];
const TOTAL_MEASUREMENTS = 157;
const START_WEIGHT = 106.2;
const END_WEIGHT = 82.7;

// A deterministic long-term trend with overlapping waves creates realistic
// plateaus and rebounds without making the development data change each run.
const makeTestWeights = () => {
  const lastIndex = TOTAL_MEASUREMENTS - 1;
  const waveAt = (week) => (
    1.6 * Math.sin(week * 0.19)
    + 0.7 * Math.sin(week * 0.61)
    + 0.35 * Math.cos(week * 1.17)
  );
  const firstWave = waveAt(0);
  const lastWave = waveAt(lastIndex);

  return Array.from({length: TOTAL_MEASUREMENTS}, (_, week) => {
    const progress = week / lastIndex;
    const trend = START_WEIGHT + (END_WEIGHT - START_WEIGHT) * progress;
    const endpointAdjustment = firstWave + (lastWave - firstWave) * progress;
    const weight = trend + waveAt(week) - endpointAdjustment;
    return Number(weight.toFixed(1));
  });
};

const makeTestWeightDocuments = (userId) => {
  const firstMeasurement = new Date('2023-10-27T07:30:00.000Z');

  return makeTestWeights().map((weight, week) => ({
    weight,
    timestamp: new Date(firstMeasurement.getTime() + week * 7 * 24 * 60 * 60 * 1000),
    metadata: {
      userId: userId.toString(),
      username: TEST_USERNAME,
      seed: SEED_ID,
    },
  }));
};

const client = new MongoClient(MONGO_URL);

try {
  await client.connect();

  const db = client.db(DATABASE_NAME);
  const collectionNames = new Set(
    (await db.listCollections({}, {nameOnly: true}).toArray()).map(({name}) => name),
  );

  if (!collectionNames.has('users')) {
    await db.createCollection('users');
  }
  if (!collectionNames.has('weights')) {
    await db.createCollection('weights', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
      },
    });
  }

  const users = db.collection('users');
  const weights = db.collection('weights');
  await users.createIndex({username: 1}, {unique: true});

  const password = await bcrypt.hash(TEST_PASSWORD, 10);
  const userResult = await users.findOneAndUpdate(
    {username: TEST_USERNAME},
    {$set: {username: TEST_USERNAME, password}},
    {upsert: true, returnDocument: 'after'},
  );

  const existingSeedData = await weights.countDocuments({
    'metadata.seed': SEED_ID,
    $or: [
      {'metadata.userId': userResult._id.toString()},
      {'metadata.user': userResult._id.toString()},
    ],
  });

  const documents = makeTestWeightDocuments(userResult._id);

  if (existingSeedData !== documents.length) {
    const deleteResult = await weights.deleteMany({
      'metadata.seed': {$in: MANAGED_SEED_IDS},
    });
    await weights.insertMany(documents);
    console.info(
      `Replaced ${deleteResult.deletedCount} seeded measurements with ${documents.length} measurements.`,
    );
  } else {
    console.info(`Test weight data already exists (${existingSeedData} measurements).`);
  }

  console.info(`Test login: ${TEST_USERNAME} / ${TEST_PASSWORD}`);
} catch (error) {
  console.error('Unable to seed the database:', error);
  process.exitCode = 1;
} finally {
  await client.close();
}
