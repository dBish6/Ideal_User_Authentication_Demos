import User from "../../../model/User";
import GetUserDto from "../dtos/GetUserDto";
import { GetUserValues } from "../../../@types/GetUserValues";
import { GoogleIdTokenPayload } from "../../../@types/GoogleIdTokenPayload";

import { hash } from "bcrypt";

import { redisClient } from "../../../configs/redisConfig";

const KEY = "nodeUsers";

export const getUsers = async () => {
  try {
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
  } catch (error: any) {
    throw new Error(
      "Redis error; fetching all cached users:\n" + error.message
    );
  }
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
  } catch (error: any) {
    throw new Error(
      "Redis error; fetching the cached the user:\n" + error.message
    );
  }
};

export const register = async (user: User, isThirdParty?: boolean) => {
  try {
    if (!isThirdParty) user.password = await hash(user.password, 12);
    return redisClient.hSet(KEY, user.email, JSON.stringify(user));
  } catch (error: any) {
    throw new Error(
      "Redis error; caching the user into Redis:\n" + error.message
    );
  }
};

export const googleLogin = async (
  googleDecodedClaims: GoogleIdTokenPayload
) => {
  try {
    const user = (await getUser(googleDecodedClaims.email)) as GetUserDto;
    if (user) {
      if (user.login !== "google") {
        return `User already exists by using ${user.login}.`;
      }
      console.log(
        "Google user already exists within Redis, skipping registration."
      );
    } else {
      console.log("Registering Google user.");
      const { email, name } = googleDecodedClaims,
        registeredUser: User = {
          email,
          displayName: name,
          fullName: name,
          password: "google provided",
          login: "google",
        };
      await register(registeredUser, true);
      return registeredUser;
    }

    return user;
  } catch (error: any) {
    throw new Error("Google login service error:\n" + error.message);
  }
};

export const githubLogin = async (githubAccessToken: string) => {
  try {
    const res = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + githubAccessToken,
        },
      }),
      data = await res.json();
    // console.log("GitHub data", data);
    if (!res.ok) {
      return { githubFetchErr: data };
    } else if (data && data.id) {
      // Yes, I didn't realize that your GitHub email is private by default. This is just unfortunate,
      // so if the email is null, resemble the email that GitHub uses in their requests if your email private.
      if (data.email === null)
        data.email = `${data.id}+${data.login}@users.noreply.github.com`;

      const { login, email, name } = data,
        user = (await getUser(data.email)) as GetUserDto;
      if (user) {
        if (user.login !== "github") {
          return `User already exists by using ${user.login}.`;
        }
        console.log(
          "GitHub user already exists within Redis, skipping registration."
        );
      } else {
        console.log("Registering GitHub user.");
        const registeredUser: User = {
          email,
          displayName: login,
          fullName: name,
          password: "github provided",
          login: "github",
        };
        await register(registeredUser, true);
        return registeredUser;
      }

      return user;
    } else {
      return {
        githubFetchErr: "GitHub user was not found with GitHub's access token.",
      };
    }
  } catch (error: any) {
    throw new Error("GitHub login service error:\n" + error.message);
  }
};

export const deleteUser = async (email: string) => {
  !email && (email = "");
  try {
    return redisClient.hDel(KEY, email);
  } catch (error: any) {
    throw new Error(
      "Redis error; deleting the cached the user:\n" + error.message
    );
  }
};
