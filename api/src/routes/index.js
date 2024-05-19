'use strict';

import applyWeightsRoutes from './weights/index.js';
import applyUsersRoutes from './users/index.js';
import applyAuthRoutes from './auth/index.js';

const applyRoutes = (fastify) => {
  console.info('Applying routes...');
  applyWeightsRoutes(fastify);
  applyUsersRoutes(fastify);
  applyAuthRoutes(fastify);
  console.info('Routes applied.');
};

export default applyRoutes;
