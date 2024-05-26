'use strict';

import bcrypt from 'bcryptjs';

import {userCreationSchema} from '../../schemas/index.js';

export const authenticate = async (req, res) => {
  req.session.user = req.user;
  return {message: 'Successfully logged in'};
};

export const signOut = async (req, res) => {
  req.session.destroy();
  req.session.user = null;
  return {message: 'Successfully logged out'};
}

export const assertIsValidAuthBody = async (req, res) => {
  try {
    const {username, password} = req.body;
    userCreationSchema.parse({username, password});
  } catch (err) {
    res.status(400).send(err.issues);
  }
};

export const assertUserExists = async (req, res) => {
  const {username} = req.body;
  req.user = await req.users.findOne({username});
  if (!req.user) {
    return res.status(401).send('Wrong username');
  }
};

export const assertIsLoggedIn = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Not logged in');
  }
};

export const comparePassword = async (req, res) => {
  const {password} = req.body;
  const isValid = await bcrypt.compare(password, req.user.password);
  if (!isValid) {
    return res.status(401).send('Wrong password');;
  }
};
