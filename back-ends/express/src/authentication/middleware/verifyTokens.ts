import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isRefreshTokenValid } from "../services/jwtService";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.session;

  if (!accessToken)
    return res.status(401).json({
      message: "Access token is missing.",
    });

  try {
    const decodedClaims = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    // Check if the token has expired, in milliseconds.
    if (Date.now() >= decodedClaims.exp! * 1000) {
      return res.status(401).json({
        message: "Access token has expired.",
      });
    }

    // req.decodedClaims = decodedClaims;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Access token is invalid.",
    });
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.session;

  if (!refreshToken)
    return res.status(401).json({
      message: "Refresh token is missing.",
    });

  try {
    const decodedClaims = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    // Check if the token has expired, in milliseconds.
    if (Date.now() >= decodedClaims.exp! * 1000) {
      return res.status(401).json({
        message: "Refresh token has expired.",
      });
    }

    const isTokenValid = await isRefreshTokenValid(refreshToken);

    if (!isTokenValid)
      return res.status(403).json({
        message: "Invalid refresh token; doesn't exist in the cache.",
      });

    // req.decodedClaims = decodedClaims;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Refresh token is invalid.",
    });
  }
};

export const verifyCsrf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Csrf token is invalid.",
    });
  }
};
