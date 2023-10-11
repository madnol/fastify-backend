import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt, { JWT } from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';
import 'dotenv/config';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export const server = fastify();
const secret = process.env.MY_SECRET;
server.register(fjwt, {
  secret: secret!,
});

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);

server.get('/healthcheck', async () => {
  return { status: 'OK' };
});

server.addHook('preHandler', (req, reply, next) => {
  req.jwt = server.jwt;
  return next();
});

const main = async () => {
  [...userSchemas, ...productSchemas].forEach((schema) => {
    server.addSchema(schema);
  });

  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products' });

  try {
    // 0.0.0.0 is usefull if we want to deploy inside of docker
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server ready at http://localhost:3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
