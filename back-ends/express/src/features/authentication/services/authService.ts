import User from "../../../model/User";
import GetUserDto from "../dtos/GetUserDto";
import { GetUserValues } from "../../../@types/GetUserValues";
import { GoogleIdTokenPayload } from "../../../@types/GoogleIdTokenPayload";

import { hash } from "bcrypt";
import { verify } from "jsonwebtoken";

import { redisClient } from "../../../configs/redisConfig";

const KEY = "nodeUsers";

export const getUsers = async () => {
  const usersData = await redisClient.hGetAll(KEY);

  if (usersData) {
    // Looping over all users is a horrible thing to do, but this is just a demo that uses Redis and no
    // database. For a real project a database can do this easily without a loop.
    const usersArray: GetUserDto[] = Object.values(usersData).map(
      (userData) => {
        const user: User = JSON.parse(userData);
        const { password, ...rest } = user; // Removes password before sending to front-end.
        return rest as GetUserDto;
      }
    );

    return usersArray;
  }

  return [];
};

export const getUser: GetUserValues = async (email, getAll) => {
  !email && (email = "");
  try {
    const userData = await redisClient.hGet(KEY, email);
    // console.log("userData", userData);
    if (userData) {
      const user: User = JSON.parse(userData);
      if (getAll) return user;

      const { password, ...rest } = user; // Removes password before sending to front-end.
      return rest as GetUserDto;
    }
  } catch (error) {
    throw new Error("Redis error; fetching the cached the user:\n" + error);
  }
};

export const register = async (user: User, isThirdParty?: boolean) => {
  try {
    if (!isThirdParty) user.password = await hash(user.password, 12);
    return redisClient.hSet(KEY, user.email, JSON.stringify(user));
  } catch (error) {
    throw new Error("Redis error; caching the user into Redis:\n" + error);
  }
};

export const googleLogin = async (
  googleDecodedClaims: GoogleIdTokenPayload
) => {
  const isUser = await redisClient.hExists(KEY, googleDecodedClaims.email);
  if (isUser) {
    console.log("Google user exists within Redis.");
  } else {
    console.log("Registering google user.");
    const { email, name } = googleDecodedClaims,
      user = {
        email,
        displayName: name,
        fullName: name,
        password: "google provided",
      } as User;
    await register(user, true);
  }

  const user = (await getUser(googleDecodedClaims.email)) as GetUserDto;
  return user;
};

export const deleteUser = async (email: string) => {
  !email && (email = "");
  try {
    return redisClient.hDel(KEY, email);
  } catch (error) {
    throw new Error("Redis error; deleting the cached the user:\n" + error);
  }
};
