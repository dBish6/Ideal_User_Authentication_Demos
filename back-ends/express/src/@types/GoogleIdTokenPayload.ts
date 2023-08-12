import { JwtPayload } from "jsonwebtoken";

export type GoogleIdTokenPayload = JwtPayload & {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
};
