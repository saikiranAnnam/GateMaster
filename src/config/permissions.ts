export const ALL_PERMISSIONS = [
  // users
  "users:roles:write", // Allowed to add a role to a user
  "users:roles:delete", // Allowed to remove a role from a user

  // roles
  "roles:write",

  // posts
  "posts:write",
  "posts:read",
  "posts:delete",
  "posts:edit-own",
] as const;

// converting object into a permission array
export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;

  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

// normal application user
export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS["posts:write"],
  PERMISSIONS["posts:read"],
];

// roles present for the application
export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
