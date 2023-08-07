import { Request, Response, NextFunction } from "express";
import User from "../../../model/User";

import { compare } from "bcrypt";
import { getUser } from "../services/authService";

// This is used on the login route to verify the credentials that was passed in the req.body.
const verifyUserInCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = (await getUser(email, true)) as User;
    if (!user) {
      return res.status(400).send({
        message: "Incorrect email.",
      });
    }

    if (!(await compare(password, user.password))) {
      return res.status(400).send({
        message: "Incorrect password.",
      });
    }

    console.log("User successfully verified.");
    req.authUser = user;
    next();
  } catch (error) {
    console.error(error);
  }
};

export default verifyUserInCache;
