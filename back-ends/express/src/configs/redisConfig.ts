import { createClient } from "@redis/client";

export const redisClient = createClient({ url: "redis://127.0.0.1:6379" });

redisClient.on("connect", () => {
  console.log("Redis server is successfully running!");
});

redisClient.on("error", (error) => {
  if (error.code === "ECONNREFUSED") {
    // console.error("Redis connection error:", error);
    throw new Error("Redis connection error: \n" + error.message);
  } else {
    // console.error("Redis error: ", error);
    throw new Error("Redis error: \n" + error.message);
  }
});
