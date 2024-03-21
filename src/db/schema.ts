import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

// HR application  or shopify store or cloud resource schema
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
