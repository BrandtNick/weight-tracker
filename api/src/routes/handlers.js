'use strict';

const fetch = async (req, res) => {
  const cursor = req.weights
    .find({})
    .toArray();
  return cursor;
};

const create = async (req, res) => {
  const {weight} = req.body;
  const data = {
    timestamp: new Date(),
    weight,
  };
  console.log({data});
  const result = await req.weights.insertOne(data);
  return result;
};

export {
  fetch,
  create,
};
