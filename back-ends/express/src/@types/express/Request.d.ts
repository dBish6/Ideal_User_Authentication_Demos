import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../../model/User";

declare module "express-serve-static-core" {
  interface Request {
    decodedClaims?: JwtPayload;
    authUser?: User;
  }
}
