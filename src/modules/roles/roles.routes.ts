import { FastifyInstance } from "fastify";
import { CreateRoleBody, createRoleJsonSchema } from "./roles.schemas";
import { createRoleHandler } from "./roles.controllers";
import { PERMISSIONS } from "../../config/permissions";

export async function roleRoutes(server: FastifyInstance) {
  server.post<{
    Body: CreateRoleBody;
  }>(
    "/",
    {
      schema: createRoleJsonSchema,
      preHandler: [server.guard.scope([PERMISSIONS["roles:write"]])],
    },
    createRoleHandler
  );
}
