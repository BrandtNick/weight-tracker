'use strict';

import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import MongoStore from 'connect-mongo';

import {DATABASE_NAME} from '../constants.js';

const cookieOpts = {
  maxAge: 14 * 24 * 60 * 60, // 14 days
  secure: false,
};

const mongoStoreOpts = {
  mongoUrl: 'mongodb://mongodb:27017',
  dbName: DATABASE_NAME,
};

const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'R4nDoMs3CreTofSeSioNzH3h3lolMiNThirtyTwo',
  cookie: cookieOpts,
  store: MongoStore.create(mongoStoreOpts),
};

export const applyFastifyPlugins = (fastify) => {
  console.info('Applying Fastify plugins...');
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, sessionOpts);
  fastify.register(fastifyCors, {origin: ["http://localhost:3000", "https://weight-tracker.zirr.dev"], credentials: true});
  console.info('Fastify plugins applied.');
};
