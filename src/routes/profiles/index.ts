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
      const idEntity = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (idEntity === null) throw reply.code(400);
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
      console.log(request.body.city, 'request.body.city');
      console.log(request.body.memberTypeId, 'request.body.memberTypeId');
      const profilEntity = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      console.log(profilEntity);
      if (profilEntity === null) throw reply.code(400);
      console.log(profilEntity.city, 'profilEntity.city');
      console.log(profilEntity.memberTypeId, 'profilEntity.memberTypeId');
      const newProfileEntity = await fastify.db.profiles.change(
        request.params.id,
        request.body
      );
      console.log(newProfileEntity.city, 'newProfileEntity.city');
      console.log(
        newProfileEntity.memberTypeId,
        'newProfileEntity.memberTypeId'
      );
      return newProfileEntity;
    }
  );
};

export default plugin;
