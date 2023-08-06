import { sign } from "jsonwebtoken";
import { redisClient } from "../../../configs/redisConfig";

export class GenerateJWT {
  accessToken(email: string) {
    try {
      return sign({ sub: email }, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "15m",
      });
    } catch (error: any) {
      throw new Error("JWT error; generating access token:\n" + error.message);
    }
  }

  async refreshToken(email: string) {
    try {
      const refreshToken = sign(
        { sub: email },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        }
      );
      await redisClient.sAdd("nodeRefreshTokens", refreshToken); // Cache the refresh token to Redis for verification afterwards.

      return refreshToken;
    } catch (error: any) {
      throw new Error("JWT error; generating refresh token:\n" + error.message);
    }
  }
}

export const isRefreshTokenValid = async (token: string) => {
  try {
    return await redisClient.sIsMember("nodeRefreshTokens", token);
  } catch (error) {
    throw new Error("Redis error; caching the user into Redis:\n" + error);
  }
};
