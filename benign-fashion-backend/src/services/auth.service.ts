import { eq, sql } from "drizzle-orm";
import { db } from "../config/database";
// import { userModel } from "../schemas/users.schema";
import { BadRequestError, UnauthorizedError } from "./utils/errors.utils";
import { generateAccessToken } from "./utils/jwt.utils";
import {
  comparePassword,
  hashPassword,
  validatePassword,
} from "./utils/password.utils";
import { NewUser, userModel, roleModel } from "../schemas";

export const findUserByUsername = async (username: string) => {
  const [user] = await db
    .select()
    .from(userModel)
    .where(eq(userModel.username, username));
  return user;
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(userModel)
    .where(eq(userModel.email, email));
  return user;
};


export const getUserDetailsByUserId = async (userId: number) => {
  console.log(userId);
  const user = await db.query.userModel.findFirst({
    where: eq(userModel.userId, userId),
    with: {
      role: {
        with: {
          rolePermissions: {
            with: {
              permission: true,
            },
          },
        },
      },

      
    },
  });
  return user;
};

// Create user function

export const createUser = async (userData: NewUser) => {
  try {
    // Check if username already exists
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
      throw BadRequestError("Username already registered, please try another");
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(userData.email);
    if (existingEmail) {
      throw BadRequestError("Email already registered, please try another");
    }

    // Validate and hash password
    validatePassword(userData.password);
    const hashedPassword = await hashPassword(userData.password);

    // Insert user
    const [newUserId] = await db
      .insert(userModel)
      .values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        active: userData.active,
        roleId: userData.roleId,
      })
      .$returningId();

    // Return safe user object (no password exposed)
    return {
      id: newUserId,
      username: userData.username,
      email: userData.email,
      active: userData.active,
      roleId: userData.roleId,
    };
  } catch (error) {
    throw error;
  }
};


//get user api

export const getUsers = async () => {
  const userList = await db
    .select({
      userId: userModel.userId,
      username: userModel.username,
      email: userModel.email,
      active: userModel.active,
      roleId: userModel.roleId,
      fullName: userModel.fullName,
      phone: userModel.phone,
      street: userModel.street,
      city: userModel.city,
      state: userModel.state,
      country: userModel.country,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      roleName: roleModel.roleName,
    })
    .from(userModel)
    .leftJoin(roleModel, eq(userModel.roleId, roleModel.roleId));

  return userList;
}



// ========== Service Layer ==========
export const updateUser = async (
  userId: number,
  updateData: {
    username?: string;
    email?: string;
    roleId?: number;
    active?: boolean;
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    // ⚠️ no password here
  },
) => {
  await db
    .update(userModel)
    .set(updateData)
    .where(sql`${userModel.userId} = ${userId}`);

  const updatedUser = await db
    .select({
      userId: userModel.userId,
      username: userModel.username,
      email: userModel.email,
      roleId: userModel.roleId,
      active: userModel.active,
      fullName: userModel.fullName,
      phone: userModel.phone,
      street: userModel.street,
      city: userModel.city,
      state: userModel.state,
      country: userModel.country,
    })
    .from(userModel)
    .where(sql`${userModel.userId} = ${userId}`)
    .limit(1);

  return updatedUser[0];
};


export const loginUser = async (username: string, password: string) => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw UnauthorizedError(
      "Wrong username/passwrod. Please Contact with Administrator",
    );
  }

  // Validate password format if needed
  validatePassword(password);

  // Compare the plain password with stored hash
  // Note: We don't hash the incoming password before comparison
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw UnauthorizedError(
      "Wrong username/password. Please Contact with Administrator",
    );
  }

  // fetch user details from db like role, voucher types, company, location, etc.
  const userDetails = await getUserDetailsByUserId(user.userId);
  const permissions =
    userDetails?.role?.rolePermissions.map((ur) => ur.permission.name) || "";

  const token = generateAccessToken({
    userId: user.userId,
    username: user.username,
    role: user?.roleId,
    permissions: permissions,
    hasPermission: (perm: string) => permissions.includes(perm),
  });

  return {
    token,
    user: userDetails,
  };
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await db
    .select()
    .from(userModel)
    .where(eq(userModel.userId, userId))
    .then((rows) => rows[0]);

  if (!user) {
    throw UnauthorizedError("User not found");
  }

  const isValidPassword = await comparePassword(currentPassword, user.password);

  if (!isValidPassword) {
    throw UnauthorizedError("Current password is incorrect");
  }

  validatePassword(newPassword);
  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(userModel)
    .set({ password: hashedPassword })
    .where(eq(userModel.userId, userId));
};


// get user by userId
export const getUserById = async (userId: number) => {
  const user = await db
    .select({
      userId: userModel.userId,
      username: userModel.username,
      email: userModel.email,
      active: userModel.active,
      roleId: userModel.roleId,
      fullName: userModel.fullName,
      phone: userModel.phone,
      street: userModel.street,
      city: userModel.city,
      state: userModel.state,
      country: userModel.country,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      roleName: roleModel.roleName,
    })
    .from(userModel)
    .leftJoin(roleModel, eq(userModel.roleId, roleModel.roleId))
    .where(eq(userModel.userId, userId))
    .limit(1); // only one user

  return user[0] || null;
};