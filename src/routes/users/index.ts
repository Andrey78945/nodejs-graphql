import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import isUUID from '../../utils/validate';

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
      if (!isUUID(request.params.id)) throw reply.code(404);
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
      if (userEntityToCreate === null) throw reply.code(400);
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
      if (!isUUID(request.params.id)) throw reply.code(400);
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);

      const userProfiles = await fastify.db.profiles.findMany();
      for (let index = 0; index < userProfiles.length; index++)
        if (userProfiles[index].userId === request.params.id) {
          await fastify.db.profiles.delete(userProfiles[index].id);
        }

      const userPosts = await fastify.db.posts.findMany();
      for (let index = 0; index < userPosts.length; index++) {
        if (userPosts[index].userId === request.params.id) {
          await fastify.db.posts.delete(userPosts[index].id);
          break;
        }
      }

      const users = await fastify.db.users.findMany();
      for (let index = 0; index < users.length; index++) {
        if (users[index].subscribedToUserIds.includes(request.params.id)) {
          users[index].subscribedToUserIds = users[
            index
          ].subscribedToUserIds.filter((item) => item !== request.params.id);
          await fastify.db.users.change(users[index].id, {
            subscribedToUserIds: users[index].subscribedToUserIds,
          });
        }
      }

      const deleted = await fastify.db.users.delete(request.params.id);
      return deleted;
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
      if (!isUUID(request.params.id)) throw reply.code(400);
      if (!isUUID(request.body.userId)) throw reply.code(400);

      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (userEntity === null) throw reply.code(404);

      const newUserEntity = await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: [
          ...userEntity.subscribedToUserIds,
          request.params.id,
        ],
      });
      return newUserEntity;
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
      if (!isUUID(request.params.id) || !isUUID(request.body.userId))
        throw reply.code(400);
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (userEntity === null) throw reply.code(404);

      const subscribed = userEntity.subscribedToUserIds;
      const indexId = subscribed.indexOf(request.params.id);
      if (indexId === -1) throw reply.code(400);

      const newUserEntity = await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: [
          ...subscribed.slice(0, indexId),
          ...subscribed.slice(indexId + 1),
        ],
      });
      return newUserEntity;
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
      if (!isUUID(request.params.id)) throw reply.code(400);
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (userEntity === null) throw reply.code(404);
      const newUserEntity = await fastify.db.users.change(
        request.params.id,
        request.body
      );
      return newUserEntity;
    }
  );
};

export default plugin;
