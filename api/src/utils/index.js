'use strict';

export const createPreHandler = (fns) => {
  return {
    preHandler: fns,
  };
};
