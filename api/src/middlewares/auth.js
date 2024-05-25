'use strict';

export const assertIsAuthorized = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

