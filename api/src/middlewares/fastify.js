'use strict';

import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

export const applyFastifyPlugins = (fastify) => {
  console.info('Applying Fastify plugins...');
  fastify.register(fastifyCookie, {secret: 'C0oOkiiIiiIezZz125', secure: false});
  fastify.register(fastifySession, {secret: 'R4nDoMs3CreTofSeSioNzH3h3lolMiNThirtyTwo'});
  fastify.register(fastifyCors, {origin: true, credentials: true});
  console.info('Fastify plugins applied.');
};
