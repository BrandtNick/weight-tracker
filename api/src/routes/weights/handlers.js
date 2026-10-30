'use strict';

import {ObjectId} from 'mongodb';

import {weightCreationSchema} from '../../schemas/index.js';

const getUserWeightFilter = (sessionUser) => {
  const userId = sessionUser._id.toString();
  const legacyUserIds = [userId];

  if (ObjectId.isValid(userId)) {
    legacyUserIds.push(new ObjectId(userId));
  }

  return {
    $or: [
      {'metadata.userId': userId},
      {'metadata.user': userId},
      {'metadata.user._id': {$in: legacyUserIds}},
    ],
  };
};

export const fetch = async (req, res) => {
  const cursor = req.weights
    .find(getUserWeightFilter(req.session.user), {projection: {metadata: 0}})
    .sort({timestamp: 1})
    .toArray();
  return cursor;
};

export const assertIsValidWeightBody = (req, res, next) => {
  try {
    req.body.timestamp = new Date(req.body.timestamp);
    const {weight, timestamp} = req.body;
    weightCreationSchema.parse({weight, timestamp});
    next();
  } catch (err) {
    res.status(400).send(err.issues);
  }
};

export const create = async (req, res) => {
  const {weight, timestamp} = req.body;
  const data = {
    timestamp: timestamp,
    weight,
    metadata: {
      userId: req.session.user._id.toString(),
    },
  };
  const result = await req.weights.insertOne(data);
  return result;
};
