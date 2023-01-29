import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const typeEntity = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (typeEntity === null) throw reply.code(404);
      return typeEntity;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const typeEntity = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (typeEntity === null) throw reply.code(400);
      const newTypeEntity = await fastify.db.memberTypes.change(
        request.params.id,
        {
          discount: request.body.discount,
          monthPostsLimit: request.body.monthPostsLimit,
        }
      );
      return newTypeEntity;
    }
  );
};

export default plugin;
