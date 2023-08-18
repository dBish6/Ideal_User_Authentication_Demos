import { Request, Response, NextFunction } from "express";
import { GoogleIdTokenPayload } from "../../../@types/GoogleIdTokenPayload";

import { verify, JwtPayload } from "jsonwebtoken";
import { isRefreshTokenValid } from "../services/jwtService";
import getGooglesPublicKey from "../utils/getGooglesPublicKey";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.session,
    refreshToken = req.cookies.refresh;
  // console.log("accessToken", accessToken);

  if (!accessToken) {
    // If no accessToken, check if a refresh cookie exists for a refresh request.
    if (refreshToken) {
      return res.status(403).json({
        message: "Access token is expired.",
      });
    }
    return res.status(401).json({
      message: "Access token is missing.",
    });
  }

  try {
    const decodedClaims = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    // console.log("decodedClaims", decodedClaims);
    // Check if the token is expired, in milliseconds.
    if (Date.now() >= decodedClaims.exp! * 1000) {
      return res.status(403).json({
        message: "Access token is expired.",
      });
    }

    req.decodedClaims = decodedClaims;
    console.log("Access token successfully verified.");
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
  const refreshToken = req.cookies.refresh;
  // console.log("refreshToken", refreshToken);
  if (!refreshToken)
    return res.status(401).json({
      message: "Refresh token is missing.",
    });

  try {
    const decodedClaims = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
    // console.log("decodedClaims", decodedClaims);
    // Check if the token is expired, in milliseconds.
    if (Date.now() >= decodedClaims.exp! * 1000) {
      return res.status(403).json({
        message: "Refresh token is expired.",
      });
    }

    const isTokenValid = await isRefreshTokenValid(refreshToken);
    if (!isTokenValid)
      return res.status(403).json({
        message: "Invalid refresh token; doesn't exist in the cache.",
      });

    req.decodedClaims = decodedClaims;
    console.log("Refresh token successfully verified.");
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Refresh token is invalid.",
    });
  }
};

export const verifyGoogleIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Google user ID token is missing.",
    });
  } else if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message:
        "Found the authorization header for the google login request, but isn't a Bearer token.",
    });
  }

  try {
    const userIdToken = authHeader.split(" ")[1],
      { algorithm, publicKey } = await getGooglesPublicKey(userIdToken);

    const googleDecodedClaims = verify(userIdToken, publicKey, {
      algorithms: [algorithm],
    }) as GoogleIdTokenPayload;
    // console.log("google decodedClaims", googleDecodedClaims);

    req.googleDecodedClaims = googleDecodedClaims;
    console.log("Google ID token successfully verified.");
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Google user ID json web token is invalid.",
    });
  }
};
