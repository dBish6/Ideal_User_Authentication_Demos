import { createClient } from "@redis/client";

export const redisClient = createClient();

redisClient.on("connect", () => {
  console.log("Redis server is successfully running!");
});

redisClient.on("error", (error) => {
  if (error.code === "ECONNREFUSED") {
    console.error("Redis connection error:", error);
  } else {
    console.error("Redis error: ", error);
  }
});
