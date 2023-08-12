import { Request, Response, NextFunction } from "express";
import RegisterRequestDto from "../dtos/RegisterRequestDto";

import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";
import GetUserDto from "../dtos/GetUserDto";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await authService.getUsers();

    return res.status(200).json(users);
  } catch (error: any) {
    error.reason = "failed to send users.";
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getUser(req.params.email);
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist, incorrect email.",
      });

    return res.status(200).json(user);
  } catch (error: any) {
    error.reason = "failed to send specified user.";
    next(error);
  }
};

export const register = async (
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getUser(req.body.email);
    if (user) return res.status(400).json({ message: "User already exists." });

    await authService.register(req.body);

    return res
      .status(200)
      .json({ message: "User was successfully registered." });
  } catch (error: any) {
    error.reason = "failed to register user.";
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Checks if user is valid in verifyUserInCache...
  // Checks if the google user is valid in verifyTokens.verifyGoogleIdToken on /login/google request...

  try {
    const user = (
      req.googleDecodedClaims
        ? await authService.googleLogin(req.googleDecodedClaims)
        : req.authUser
    ) as GetUserDto;

    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(user.email),
      refreshToken = await generateJWT.refreshToken(user.email);

    res // Create 'session' cookie.
      .cookie("session", accessToken, {
        maxAge: 1000 * 60 * 15, // 15 minutes.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      // Create refresh cookie.
      .cookie("refresh", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    return res.status(200).json({
      message: "User is successfully authenticated.",
      user: user, // authUser was attached to the request object in verifyUserInCache.
    });
  } catch (error: any) {
    error.reason = "failed to create user session.";
    next(error);
  }
};

export const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verifies access token...
    console.log("req.decodedClaims", req.decodedClaims);
    const user = await authService.getUser(req.decodedClaims!.sub!);
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist, incorrect subject in cookie.",
      });

    return res.status(200).json({
      message: "Session status was successfully checked.",
      user: user,
    });
  } catch (error: any) {
    error.reason = "failed to check user session status.";
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // When the refresh token is verified generate the new access token.

    console.log("req.decodedClaims", req.decodedClaims);
    const user = await authService.getUser(req.decodedClaims!.sub!);
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist, incorrect subject in cookie.",
      });

    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(user.email),
      refreshToken = generateJWT.refreshToken(user.email);

    res // Create cookies again.
      .cookie("session", accessToken, {
        maxAge: 1000 * 60 * 15, // 15 minutes.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .cookie("refresh", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    return res.status(200).json({
      message: "User is successfully authenticated, session refresh complete.",
      user: user,
    });
  } catch (error: any) {
    error.reason = "failed to refresh user session.";
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("session").clearCookie("refresh");
    return res
      .status(200)
      .json({ message: "User session cookies cleared, log out successful." });
  } catch (error: any) {
    error.reason = "failed to clear user session.";
    next(error);
  }
};

// TODO:
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.deleteUser(req.params.email);

    // return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
