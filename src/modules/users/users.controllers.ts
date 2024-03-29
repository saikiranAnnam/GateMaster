import { FastifyReply, FastifyRequest } from "fastify";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import {
  AssignRoleToUserBody,
  CreateUserBody,
  LoginBody,
} from "./users.schemas";
import {
  assignRoleTouser,
  createUser,
  getUserByEmail,
  getUsersByApplication,
} from "./users.services";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";




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


export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
){
  const {applicationId, email, password} = request.body;

  // fetching the user details
  const user = await getUserByEmail({
    applicationId, 
    email
  });

  

  //user not exist
  if(!user){
     return reply.code(400).send({
      message: "User not found or invalid email or passwords"
     })
  }
  //assigning the jwt token for the user
  const token = jwt.sign(
    {
      id : user.id,
      email, 
      applicationId, 
      scopes: user.permissions
    },
    "secret" // for default  i am keeping secert
  ); // change this secret or signing method, or get fired

  return {token};

};

export async function assignRoleTouserHandler(
  request: FastifyRequest<{
    Body: AssignRoleToUserBody;
  }>,
  reply: FastifyReply
) {
  // const applicationId = request.user.applicationId;
  const { userId, roleId, applicationId } = request.body;

  try {
    const result = await assignRoleTouser({
      userId,
      applicationId,
      roleId,
    });

    return result;
  } catch (e) {
    logger.error(e, `error assigning role to user`);
    return reply.code(400).send({
      message: "could not assign role to user",
    });
  }
}