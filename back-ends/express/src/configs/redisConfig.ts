import { createClient } from "@redis/client";

export const redisClient = createClient({
  url:
    process.env.NODE_ENV === "production"
      ? `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`
      : `redis://${process.env.REDIS_HOST}:6379`,
});

redisClient.on("connect", () => {
  console.log("Redis server is successfully running!");
});

redisClient.on("error", (error) => {
  if (error.code === "ECONNREFUSED") {
    throw new Error("Redis connection error: \n" + error.message);
  } else {
    throw new Error("Redis error: \n" + error.message);
  }
});
