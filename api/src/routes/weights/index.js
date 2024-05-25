'use strict';

import {BASE_API_URI} from '../../constants.js';
import {createPreHandler} from '../../utils/index.js';
import {
  fetch,
  create,
  assertIsValidWeightBody,
} from './handlers.js';
import {assertIsAuthorized} from '../../middlewares/index.js';

const WEIGHTS_URI = `${BASE_API_URI}/weights`;

const applyWeightsRoutes = (fastify) => {
  fastify.addHook('preHandler', function (req, res, done) {
    req.weights = fastify.conf.weights;
    done()
  })
  fastify.get(
    WEIGHTS_URI,
    createPreHandler([assertIsAuthorized]),
    fetch,
  )
  fastify.post(
    WEIGHTS_URI,
    createPreHandler([assertIsValidWeightBody]),
    create,
  )
};

export default applyWeightsRoutes;
