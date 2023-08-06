import { hash } from "bcrypt";

import User from "../../../model/User";
import { GetUserValues } from "../../../@types/GetUserValues";
import GetUserDto from "../dtos/GetUserDto";

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

export const register = async (user: User) => {
  try {
    user.password = await hash(user.password, 12);
    return redisClient.hSet(KEY, user.email, JSON.stringify(user));
  } catch (error) {
    throw new Error("Redis error; caching the user into Redis:\n" + error);
  }
};

export const deleteUser = async (email: string) => {
  !email && (email = "");
  try {
    return redisClient.hDel(KEY, email);
  } catch (error) {
    throw new Error("Redis error; deleting the cached the user:\n" + error);
  }
};
