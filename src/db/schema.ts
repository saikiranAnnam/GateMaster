import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";

// HR application  or shopify store or cloud resource schema
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// creating user schema
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => applications.id),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      cpk: primaryKey(users.email, users.applicationId), // composite key 
      idIndex: uniqueIndex("users_id_index").on(users.id),
    };
  }
);

// creating roles
export const roles = pgTable(
    "roles",
    {
      id: uuid("id").defaultRandom().notNull(),
      name: varchar("name", { length: 256 }).notNull(),
      applicationId: uuid("applicationId").references(() => applications.id),
      permissions: text("permissions").array().$type<Array<string>>(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (roles) => {
      return {
        cpk: primaryKey(roles.name, roles.applicationId),
        idIndex: uniqueIndex("roles_id_index").on(roles.id),
      };
    }
  );

  // many to many relation btw users and roles
  export const usersToRoles = pgTable(
    "usersToRoles",
    {
      applicationId: uuid("applicationId")
        .references(() => applications.id)
        .notNull(),

      roleId: uuid("roledId")
        .references(() => roles.id)
        .notNull(),

      userId: uuid("userId")
        .references(() => users.id)
        .notNull(),
    },
    (usersToRoles) => {
      return {
        cpk: primaryKey(
          usersToRoles.applicationId,
          usersToRoles.roleId,
          usersToRoles.userId
        ),
      };
    }
  );