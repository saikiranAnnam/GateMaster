import { FastifyInstance } from "fastify";
import { createUserHandler, loginHandler } from "./users.controllers";
import { createUserJsonSchema, loginJsonSchema } from "./users.schemas";

export async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  server.post("/login", { schema: loginJsonSchema }, loginHandler);
}
