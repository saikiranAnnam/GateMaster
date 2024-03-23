import fastify from "fastify";
import { applicationRoutes } from "../modules/applications/applications.routes";
import logger from "./logger";

export async function buildServer() {
  const server = fastify({
    logger: logger,
  });

  // regsiter plugins

  // register routes

  server.register(applicationRoutes, { prefix: "/api/applications" });


  return server;
}
