import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { GoogleIdTokenPayload } from "../GoogleIdTokenPayload";
import GetUserDto from "../../features/authentication/dtos/GetUserDto";

declare module "express-serve-static-core" {
  interface Request {
    decodedClaims?: JwtPayload;
    googleDecodedClaims?: GoogleIdTokenPayload;
    authUser?: GetUserDto;
  }
}
