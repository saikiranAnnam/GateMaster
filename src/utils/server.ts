import fastify from "fastify";
import logger from "./logger";

export async function buildServer() {
  const server = fastify({
    logger: logger,
  });

  // regsiter plugins

  // register routes

  return server;
}
