import { Request, Response, NextFunction } from "express";
import User from "../../../model/User";

import { compare } from "bcrypt";
import { getUser } from "../services/authService";
import GetUserDto from "../dtos/GetUserDto";

// This is used on the login route to verify the credentials that was passed in the req.body.
const verifyUserInCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (await getUser(req.body.email, true)) as User;
    if (!user) {
      return res.status(400).send({
        message: "Incorrect email.",
      });
    }

    if (user.password === "google provided") {
      return res.status(400).send({
        message: `A google user was found, please "Use Google" to log in.`,
      });
    }
    if (!(await compare(req.body.password, user.password))) {
      return res.status(400).send({
        message: "Incorrect password.",
      });
    }

    const { password, ...rest } = user;
    req.authUser = rest as GetUserDto;
    console.log("User successfully verified.");
    next();
  } catch (error) {
    console.error(error);
  }
};

export default verifyUserInCache;
