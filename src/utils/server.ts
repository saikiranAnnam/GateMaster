import fastify, { FastifyReply, FastifyRequest } from "fastify";
import guard from "fastify-guard";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import { userRoutes } from "../modules/users/users.routes";
import logger from "./logger";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  applicationId: string;
  scopes: Array<string>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const server = fastify({
    logger: logger,
  });

  server.decorateRequest("user", null);

  server.addHook(
    "onRequest",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return;
      }

      try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, "secret") as User;

        console.log("user", decoded);

        request.user = decoded;
      } catch (e) {}
    }
  );

  // regsiter plugins
  server.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (result, request, reply) => {
      return reply.send("You can not do that");
    },
  });

  // register routes
  server.register(applicationRoutes, { prefix: "/api/applications" });
  server.register(userRoutes, { prefix: "/api/users" });
  server.register(roleRoutes, { prefix: "/api/roles" });

  return server;
}
