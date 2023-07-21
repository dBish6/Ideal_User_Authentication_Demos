import User from "model/User";
import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import { getUser } from "authentication/services/authService";

// This is used on the login route to verify the credentials that was passed in the req.body.
const verifyUserInCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const userData = await getUser(email);
    console.log("userData verify", userData);

    if (!userData) {
      return res.status(400).send({
        message: "User doesn't exist, incorrect email.",
      });
    }
    const user: User = JSON.parse(userData);

    if (!(await compare(password, user.password))) {
      return res.status(400).send({
        message: "Incorrect password.",
      });
    }
    next();
  } catch (error) {
    console.error(error);
  }
};

export default verifyUserInCache;
