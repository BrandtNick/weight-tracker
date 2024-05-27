'use strict';

import {weightCreationSchema} from '../../schemas/index.js';

export const fetch = async (req, res) => {
  const cursor = req.weights
    .find({})
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
      user: req.session.user,
    },
  };
  const result = await req.weights.insertOne(data);
  return result;
};
