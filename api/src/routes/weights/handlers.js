'use strict';

import {weightCreationSchema} from '../../schemas/index.js';

export const fetch = async (req, res) => {
  console.log({session: req.session});
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  const cursor = req.weights
    .find({})
    .toArray();
  return cursor;
};

export const assertIsValidWeightBody = (req, res) => {
  try {
    const {weight, metadata} = req.body;
    weightCreationSchema.parse({weight, metadata});
  } catch (err) {
    res.status(400).send(err.issues);
  }
}

export const create = async (req, res) => {
  const {weight, metadata} = req.body;
  const data = {
    timestamp: new Date(),
    weight,
    metadata,
  };
  const result = await req.weights.insertOne(data);
  return result;
};
