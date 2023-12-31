import { FastifyPluginAsync } from "fastify";
import { buildJsonSchemas, register } from "fastify-zod";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { type FastifyZod } from "fastify-zod";
import fp from 'fastify-plugin'

import { models } from "./routes/users/users.schemas";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

declare module "fastify" {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }
}

const app: FastifyPluginAsync<AppOptions> = fp(async (
  fastify,
  opts
): Promise<void> => {
  await register(fastify, {
    jsonSchemas: buildJsonSchemas(models, { errorMessages: true }),
    swaggerOptions: {
      openapi: {
        info: {
          title: "My provider",
          description: "API",
          version: "0.1.0",
        },
      },
    },
    swaggerUiOptions: {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    },
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
    ignorePattern: /.*(schemas)\.ts/
  });
});

export default app;
export { app, options };
