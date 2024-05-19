'use strict';

import {BASE_API_URI} from '../../constants.js';
import {createPreHandler} from '../../utils/index.js';
import {
  authenticate,
  assertIsValidAuthBody,
  assertUserExists,
  comparePassword,
} from './handlers.js';

const AUTH_URI = `${BASE_API_URI}/auth`;

const applyAuthRoutes = (fastify) => {
  fastify.addHook('preHandler', function (req, reply, done) {
    done()
  })
  fastify.post(
    AUTH_URI,
    createPreHandler([assertIsValidAuthBody, assertUserExists, comparePassword]),
    authenticate,
  )
};

export default applyAuthRoutes;
