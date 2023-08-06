import { Request, Response, NextFunction } from "express";
import User from "../../../model/User";
import RegisterRequestDto from "../dtos/RegisterRequestDto";

import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";

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
      return res.status(400).send({
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
  try {
    // Checks if user is valid in verifyUserInCache...

    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(req.body.email),
      refreshToken = await generateJWT.refreshToken(req.body.email);

    res // Create 'session' cookie.
      .cookie("session", accessToken, {
        // maxAge: 1000 * 60 * 60 * 24, // One day.
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
    return res.json({
      message: "User is successfully authenticated.",
      user: req.authUser, // authUser was attached to the request object in verifyUserInCache.
    });
  } catch (error: any) {
    error.reason = "failed to create login session.";
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.decodedClaims!.sub!; // refresh token's subject; the email.

  try {
    // When the refresh token is verified generate the new access token.

    const user = await authService.getUser(email);
    if (!user)
      return res.status(400).send({
        message: "User doesn't exist, incorrect email.",
      });

    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(email),
      refreshToken = generateJWT.refreshToken(email);

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
    return res.json({
      message: "User is successfully authenticated, session refresh complete.",
      user: user,
    });
  } catch (error: any) {
    error.reason = "failed to refresh login session.";
    next(error);
  }
};

export const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Just verifies access token...
    console.log("req.decodedClaims", req.decodedClaims);
    const user = await authService.getUser(req.decodedClaims!.sub!);
    console.log("user", user);
    if (!user)
      return res.status(400).send({
        message: "User doesn't exist, incorrect email.",
        user: user,
      });

    return res
      .status(200)
      .json({ message: "Session status was successfully checked." });
  } catch (error: any) {
    error.reason = "failed to check login session status.";
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear Cookie
  } catch (error) {
    next(error);
  }
};

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
