import { createClient } from "@redis/client";

export const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
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
