'use strict';

import {BASE_API_URI} from '../../constants.js';
import {
  fetch,
  create,
  assertIsValidUserBody,
  hashPassword,
} from './handlers.js';
import {createPreHandler} from '../../utils/index.js';

const USERS_URI = `${BASE_API_URI}/users`;

const applyUsersRoutes = (fastify) => {
  fastify.addHook('preHandler', function (req, res, done) {
    req.users = fastify.conf.users;
    done()
  })
  fastify.get(
    USERS_URI,
    fetch,
  )
  fastify.post(
    USERS_URI,
    createPreHandler([assertIsValidUserBody, hashPassword]),
    create,
  )
};

export default applyUsersRoutes;
