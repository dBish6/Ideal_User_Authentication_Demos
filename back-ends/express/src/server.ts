/* Express TypeScript User Authentication Demo Server

   Author: David Bishop
   Creation Date: July 20, 2023
*/

import express from "express";
import dotenv from "dotenv";
import { redisClient } from "./configs/redisConfig";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

import { default as authRouter } from "authentication/routes/authRoute";

const app = express();
dotenv.config();

const PORT = Number(process.env.PORT);

(async () => {
  await redisClient.connect();
})();

// **Middleware**
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// *Security*
app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.

// Rate-limiting - used to limit repeated requests.
app.use((req, res, next) => {
  rateLimit({
    windowMs: 60 * 60 * 1000, // 60 Minutes
    max: 75, // limit each IP to 75 requests per windowMs.
    message:
      "Too many requests made from this IP, please try again after an hour.",
  })(req, res, next);
});

// *Router*
app.use("/auth", authRouter);

app.listen(PORT, "localhost", () =>
  console.log(
    `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
  )
);
