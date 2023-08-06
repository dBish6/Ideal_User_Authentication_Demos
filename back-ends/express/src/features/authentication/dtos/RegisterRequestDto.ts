import { Request } from "express";
import User from "../../../model/User";

export default interface RegisterRequestDto extends Request {
  body: User;
}
