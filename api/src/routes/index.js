'use strict';

import {BASE_API_URI} from '../constants.js';
import {
  fetch,
  create,
} from './handlers.js';

const initRoutes = (fastify) => {
  fastify.addHook('preHandler', function (req, reply, done) {
    req.weights = fastify.conf.weights;
    done()
  })
  fastify.get(`${BASE_API_URI}/weights`, fetch)
  fastify.post(`${BASE_API_URI}/weights`, create)
};

export default initRoutes;
