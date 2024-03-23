import { InferModel } from "drizzle-orm";
import { db } from "../../db";
import { applications } from "../../db/schema";

export async function createApplication(
  data: InferModel<typeof applications, "insert">
) {
  const result = await db.insert(applications).values(data).returning();

  return result[0];
}

export async function getApplications() {
  // get the applications instance from the table based on this column names
  // SELECT * FROM applications
  // SELECT id, name , createdAt from applications
  const result = await db
    .select({
      id: applications.id,
      name: applications.name,
      createdAt: applications.createdAt,
    })
    .from(applications);

  return result;
}
