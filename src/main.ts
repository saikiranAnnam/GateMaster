import { env } from "./config/env";
import logger from "./utils/logger";
import { buildServer } from "./utils/server";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

// kill the procees on the port i.e 3000
async function gracefulShutdown({
  server,
}: {
  server: Awaited<ReturnType<typeof buildServer>>;
}) {
  await server.close();
}

async function main() {
  const server = await buildServer();

  await server.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  // SIGINT - signal interupte
  // SIGTERM - signal terminate
  const signals = ["SIGINT", "SIGTERM"];

  logger.debug(env, "using env");

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({
        server,
      });
    });
  }
}

main();
