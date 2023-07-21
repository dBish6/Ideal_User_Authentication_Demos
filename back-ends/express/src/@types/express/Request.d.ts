import { Request } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    decodedClaims?: jwt.JwtPayload;
  }
}
