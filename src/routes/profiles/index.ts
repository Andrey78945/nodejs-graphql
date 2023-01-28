import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

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
      const profilEntity = {
        id: request.body.userId,
        avatar: request.body.avatar,
        sex: request.body.sex,
        birthday: request.body.birthday,
        country: request.body.country,
        street: request.body.street,
        city: request.body.city,
        memberTypeId: request.body.memberTypeId,
        userId: request.body.userId,
      };
      if (profilEntity === null) throw reply.code(404);
      await fastify.db.profiles.create(profilEntity);

      return profilEntity;
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
      if (profilEntity === null) throw reply.code(404);
      await fastify.db.profiles.delete(request.params.id);
      return profilEntity;
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
      if (profilEntity === null) throw reply.code(404);
      return profilEntity;
    }
  );
};

export default plugin;
