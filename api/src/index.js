// Import the framework and instantiate it
import Fastify from 'fastify'

import initDB from './db/index.js';
import initRoutes from './routes/index.js';

const fastify = Fastify({
  logger: true
})

// Run the server!
try {
  await initDB(fastify);
  initRoutes(fastify);
  await fastify.listen({port: 3000})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
