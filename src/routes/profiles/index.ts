import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import isUUID, { isMemberType } from '../../utils/validate';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profilEntity = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profilEntity === null) throw reply.code(404);
      return profilEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (!isUUID(request.body.userId)) throw reply.code(400);
      if (!isMemberType(request.body.memberTypeId)) throw reply.code(400);
      const profilEntity = {
        avatar: request.body.avatar,
        sex: request.body.sex,
        birthday: request.body.birthday,
        country: request.body.country,
        street: request.body.street,
        city: request.body.city,
        memberTypeId: request.body.memberTypeId,
        userId: request.body.userId,
      };
      const profiles: ProfileEntity[] = await fastify.db.profiles.findMany();
      if (profiles.some((item) => item.userId === request.body.userId))
        throw reply.code(400);
      const userEntity = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (userEntity === null) throw reply.code(400);
      const newProfileEntity = await fastify.db.profiles.create(profilEntity);

      return newProfileEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profilEntity = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profilEntity === null) throw reply.code(400);
      const deleted = await fastify.db.profiles.delete(request.params.id);
      return deleted;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profilEntity = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profilEntity === null) throw reply.code(400);
      const newProfileEntity = await fastify.db.profiles.change(
        request.params.id,
        request.body
      );
      return newProfileEntity;
    }
  );
};

export default plugin;
