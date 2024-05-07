'use strict';

import Fastify from 'fastify'

import {PORT} from './constants.js';
import initDB from './db/index.js';
import initRoutes from './routes/index.js';

const fastify = Fastify({
  logger: true
})

// Run the server!
try {
  await initDB(fastify);
  initRoutes(fastify);
  await fastify.listen({host: '0.0.0.0', port: PORT})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
