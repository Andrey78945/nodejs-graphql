import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      return userEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntityToCreate = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
      };
      if (userEntityToCreate === null) throw reply.code(404);
      const userEntity = await fastify.db.users.create(userEntityToCreate);

      return userEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      await fastify.db.users.delete(request.params.id);
      return userEntity;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      return userEntity;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      return userEntity;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      return userEntity;
    }
  );
};

export default plugin;
