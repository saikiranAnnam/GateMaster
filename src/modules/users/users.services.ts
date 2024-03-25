import { InferModel, eq } from "drizzle-orm";
import argon2 from "argon2";
import { db } from "../../db";
import { users, applications, usersToRoles } from "../../db/schema";

export async function createUser(data: InferModel<typeof users, "insert">) {
  // hashing the password using argon2
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

// getting all users for the application
export async function getUsersByApplication(applicationId: string) {
  const result = db
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
