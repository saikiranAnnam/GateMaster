import fastify from "fastify";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { userRoutes } from "../modules/users/users.routes";
import logger from "./logger";

export async function buildServer() {
  const server = fastify({
    logger: logger,
  });

  // regsiter plugins

  // register routes

  server.register(applicationRoutes, { prefix: "/api/applications" });
  server.register(userRoutes, { prefix: "/api/users" });

  return server;
}
