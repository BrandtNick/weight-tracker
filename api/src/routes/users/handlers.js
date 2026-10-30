'use strict';

import bcrypt from 'bcryptjs';

import {userCreationSchema} from '../../schemas/index.js';

const saltRounds = 10;

export const fetch = async (req, res) => {
  const cursor = req.users
    .find({}, {projection: {password: 0}})
    .toArray();
  return cursor;
};

export const fetchMe = async (req, res) => {
  return {
    _id: req.session.user._id.toString(),
    username: req.session.user.username,
  };
};

export const create = async (req, res) => {
  const {username, password} = req.body;
  const result = await req.users.insertOne({username, password});
  return result;
};

export const assertIsValidUserBody = (req, res, next) => {
  try {
    const {username, password} = req.body;
    userCreationSchema.parse({username, password});
    next();
  } catch (err) {
    res.status(400).send(err.issues);
  }
};

export const hashPassword = async (req, res) => {
  const {password} = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  req.body.password = hashedPassword;
};
