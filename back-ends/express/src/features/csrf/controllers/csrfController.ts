import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { hash } from "bcrypt";

export const initializeCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const csrfToken = randomUUID();

    // Another approach would be to store the token in Redis and compare it instead of storing it in a cookie.
    return res
      .cookie("XSRF_TOKEN", csrfToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "CSRF token successfully created.",
        token: await hash(csrfToken, 12),
      });
  } catch (error: any) {
    error.reason = "failed to initialize token";
    next(error);
  }
};
