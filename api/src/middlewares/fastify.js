'use strict';

import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import MongoStore from 'connect-mongo';

import {DATABASE_NAME} from '../constants.js';

const MONGO_URL = 'mongodb://mongodb:27017';
const COOKIE_EXPIRATION_TIME = 2628000000;

const mongoStoreOpts = {
  mongoUrl: MONGO_URL,
  dbName: DATABASE_NAME,
};

const cookieOpts = {
  maxAge: COOKIE_EXPIRATION_TIME,
  secure: false,
};

const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'R4nDoMs3CreTofSeSioNzH3h3lolMiNThirtyTwo',
  cookie: cookieOpts,
  store: MongoStore.create(mongoStoreOpts),
};

export const applyFastifyPlugins = (fastify) => {
  console.info('Applying Fastify plugins...');
  fastify.register(fastifyCookie, cookieOpts);
  fastify.register(fastifySession, sessionOpts);
  fastify.register(fastifyCors, {origin: ["http://localhost:3000", "https://weight-tracker.zirr.dev"], credentials: true});
  console.info('Fastify plugins applied.');
};
