import { FastifyInstance } from "fastify";
import { createUserHandler } from "./users.controllers";
import { createUserJsonSchema } from "./users.schemas";

export async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
}
