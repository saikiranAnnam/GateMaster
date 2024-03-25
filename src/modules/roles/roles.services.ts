import { InferModel, and, eq } from "drizzle-orm";
import { db } from "../../db";
import { roles } from "../../db/schema";

export async function createRole(data: InferModel<typeof roles, "insert">) {
  const result = await db.insert(roles).values(data).returning();

  return result[0];
}

export async function getRoleByName({
  name,
  applicationId,
}: {
  name: string;
  applicationId: string;
}) {
  // SQL --> drizzle orm
  const result = await db
    .select()
    // SELECT * FROM roles
    .from(roles)
    // where name = $1(parm1) AND applicationId $2(parm2)
    .where(and(eq(roles.name, name), eq(roles.applicationId, applicationId)))
    .limit(1);

  return result[0];
}
