import jwt from "jsonwebtoken";
import { redisClient } from "../../configs/redisConfig";

export class GenerateJWT {
  async accessToken(email: string) {
    try {
      return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "15m",
      });
    } catch (error) {
      throw new Error("JWT error; generating access token: " + error);
    }
  }

  refreshToken(displayName: string) {
    try {
      const refreshToken = jwt.sign(
        displayName, // Less sensitive information for the refreshToken because of longer expiry time.
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        }
      );
      redisClient.sAdd("nodeRefreshTokens", refreshToken); // Cache the refresh token to Redis for verification afterwards.
    } catch (error) {
      throw new Error("JWT error; generating access token: " + error);
    }
  }
}

export const isRefreshTokenValid = async (token: string) => {
  try {
    return await redisClient.sIsMember("nodeRefreshTokens", token);
  } catch (error) {
    throw new Error("Redis error; caching the user into Redis: " + error);
  }
};
