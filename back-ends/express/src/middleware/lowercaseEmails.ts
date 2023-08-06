import { Request, Response, NextFunction } from "express";
import User from "../model/User";

const lowercaseEmails = (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  req.body.email && (req.body.email = req.body.email.toLowerCase());
  next();
};

export default lowercaseEmails;
