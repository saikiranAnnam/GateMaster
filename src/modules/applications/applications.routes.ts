import { FastifyInstance } from "fastify";
import {
  createApplicationHandler,
  getApplicationsHandler,
} from "./applications.controllers";
import { createApplicationJsonSchema } from "./applications.schemas";

export async function applicationRoutes(server: FastifyInstance) {
  server.post(
    "/",
    { schema: createApplicationJsonSchema },
    createApplicationHandler
  );

  server.get("/", getApplicationsHandler);
}
