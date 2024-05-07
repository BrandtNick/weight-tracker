const initRoutes = (fastify) => {
  fastify.get('/', async function handler (request, reply) {
    return { hello: 'world' }
  })
};

export default initRoutes;
