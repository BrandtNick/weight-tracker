'use strict';

import {BASE_API_URI} from '../../constants.js';
import {createPreHandler} from '../../utils/index.js';
import {
  authenticate,
  signOut,
  assertIsValidAuthBody,
  assertUserExists,
  assertIsLoggedIn,
  comparePassword,
} from './handlers.js';

const AUTH_URI = `${BASE_API_URI}/auth`;

const applyAuthRoutes = (fastify) => {
  fastify.post(
    AUTH_URI,
    createPreHandler([assertIsValidAuthBody, assertUserExists, comparePassword]),
    authenticate,
  );
  fastify.delete(
    AUTH_URI,
    createPreHandler([assertIsLoggedIn]),
    signOut,
  );
};

export default applyAuthRoutes;
