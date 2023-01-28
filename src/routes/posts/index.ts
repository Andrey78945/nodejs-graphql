import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (postEntity === null) throw reply.code(404);
      return postEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = {
        id: request.body.userId,
        title: request.body.title,
        content: request.body.content,
        userId: request.body.userId,
      };
      if (postEntity === null) throw reply.code(404);
      await fastify.db.posts.create(postEntity);

      return postEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (postEntity === null) throw reply.code(404);
      await fastify.db.posts.delete(request.params.id);
      return postEntity;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (postEntity === null) throw reply.code(404);
      return postEntity;
    }
  );
};

export default plugin;
