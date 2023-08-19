import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";

const verifyCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const storedToken = req.cookies["XSRF-TOKEN"],
    receivedToken = req.headers["x-xsrf-token"];
  if (!storedToken || !receivedToken) {
    return res.status(403).json({
      ERROR: "CSRF token is missing.",
    });
  }

  try {
    const match = await compare(storedToken, receivedToken as string);
    if (!match) {
      return res.status(403).json({
        ERROR: "CSRF token does not match.",
      });
    }

    console.log("Csrf token successfully verified.");
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ERROR: "Unexpected error while verifying CSRF token.",
    });
  }
};

export default verifyCsrfToken;
