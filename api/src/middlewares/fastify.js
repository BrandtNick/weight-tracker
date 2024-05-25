'use strict';

import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

const sessionOpts = {
  secret: 'R4nDoMs3CreTofSeSioNzH3h3lolMiNThirtyTwo',
  cookie: {maxAge: 84000, secure: false},
};

export const applyFastifyPlugins = (fastify) => {
  console.info('Applying Fastify plugins...');
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, sessionOpts);
  fastify.register(fastifyCors, {origin: true, credentials: true});
  console.info('Fastify plugins applied.');
};
