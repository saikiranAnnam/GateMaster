import { FastifyReply, FastifyRequest } from "fastify";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { CreateUserBody } from "./users.schemas";
import {
  assignRoleTouser,
  createUser,
  getUsersByApplication,
} from "./users.services";


export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserBody;
  }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;

  // making initial user as super admin, if user is not initial user then he is application user
  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  console.log({ roleName });

  // we need to check the user have certain permissions for super admin
  // i would be getting all the users from the applications , check if he is not register - then you can make him as super admin
  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super admin user",
        extensions: {
          code: "APPLICATION_ALRADY_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  // get role  for the user from the roles services
  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
    });
  }

  try {
    const user = await createUser(data);

    // assign a role to the user

    await assignRoleTouser({
      userId: user.id,
      roleId: role.id,
      applicationId: data.applicationId,
    });

    return user;
  } catch (e) {}
}
