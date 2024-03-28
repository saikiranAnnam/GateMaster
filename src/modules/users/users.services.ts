import { InferModel, eq } from "drizzle-orm";
import argon2 from "argon2";
import { db } from "../../db";
import { users, applications, usersToRoles } from "../../db/schema";

export async function createUser(data: InferModel<typeof users, "insert">) {
    // hashed password 
  const hashedPassword = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({
      ...data,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applications.id,
    });

  return result[0];
}

export async function getUsersByApplication(applicationId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));

  return result;
}

export async function assignRoleTouser(
  data: InferModel<typeof usersToRoles, "insert">
) {
  const result = await db.insert(usersToRoles).values(data).returning();

  return result[0];
}
  