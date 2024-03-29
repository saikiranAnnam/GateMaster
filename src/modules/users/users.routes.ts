import { FastifyInstance } from "fastify";
import { PERMISSIONS } from "../../config/permissions";
import { assignRoleTouserHandler, createUserHandler, loginHandler } from "./users.controllers";
import { AssignRoleToUserBody, assignRoleTouserJsonSchema, createUserJsonSchema, loginJsonSchema } from "./users.schemas";

export async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  server.post("/login", { schema: loginJsonSchema }, loginHandler);

  server.post<{
    Body: AssignRoleToUserBody;
  }>(
    "/roles",
    {
      schema: assignRoleTouserJsonSchema,
      preHandler: [server.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleTouserHandler
  );
}
