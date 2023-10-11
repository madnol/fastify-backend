import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail, findUsers } from './user.service';
import { CreateUserInput, LoginInput } from './user.schema';
import { verifyPassword } from '../../utils/hash';
import { server } from '../../app';

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
};

export const loginHandler = async (
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  // Find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    });
  }
  // Verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...rest } = user;
    // Generate access token
    return { accessToken: server.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });

  // Respond
};

export const getUsersHandler = async () => {
  const users = await findUsers();

  return users;
};
