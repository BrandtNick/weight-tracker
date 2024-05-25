'use strict';

import bcrypt from 'bcryptjs';

import {userCreationSchema} from '../../schemas/index.js';

const saltRounds = 10;

export const fetch = async (req, res) => {
  const cursor = req.users
    .find({})
    .toArray();
  return cursor;
};

export const fetchMe = async (req, res) => {
  return req.session.user;
};

export const create = async (req, res) => {
  const {username, password} = req.body;
  const result = await req.users.insertOne({username, password});
  return result;
};

export const assertIsValidUserBody = async (req, res) => {
  try {
    const {username, password} = req.body;
    userCreationSchema.parse({username, password});
  } catch (err) {
    res.status(400).send(err.issues);
  }
};

export const hashPassword = async (req, res) => {
  const {password} = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  req.body.password = hashedPassword;
  console.log({body: req.body});
};
