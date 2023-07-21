import User from "model/User";
import { hash } from "bcrypt";
import { redisClient } from "../../configs/redisConfig";

const KEY = "nodeUsers";

export const getUsers = () => {
  return redisClient.hGetAll(KEY);
};

export const getUser = async (email: string) => {
  try {
    return redisClient.hGet(KEY, email);
  } catch (error) {
    throw new Error("Redis error; fetching the cached the user: " + error);
  }
};

export const deleteUser = async (email: string) => {
  try {
    return redisClient.hDel(KEY, email);
  } catch (error) {
    throw new Error("Redis error; deleting the cached the user: " + error);
  }
};

export const register = async (user: User) => {
  try {
    user.password = await hash(user.password, 12);
    return redisClient.hSet(KEY, user.email, JSON.stringify(user));
  } catch (error) {
    throw new Error("Redis error; caching the user into Redis: " + error);
  }
};

export const logout = () => {};
