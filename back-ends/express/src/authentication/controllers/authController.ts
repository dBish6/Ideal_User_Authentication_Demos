import User from "../../model/User";
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await authService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    // Pass the error to the error handling middleware
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await authService.getUser(req.params.email);
    console.log("userData verify", userData);

    if (!userData) {
      return res.status(400).send({
        message: "User doesn't exist, incorrect email.",
      });
    }
    let user: User = JSON.parse(userData),
      { password, ...rest } = user; // Remove password before sending to front-end.
    user = rest as any;

    return res.status(200).json(user);
  } catch (error) {
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
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
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
    next(error);
  }
};

export const register = async (
  req: Request, // User type?
  res: Response,
  next: NextFunction
) => {
  try {
    // Creates the user.
    const user = await authService.register(req.body);

    res.status(200).json(user);
  } catch (error) {
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
    console.error(error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(req.body.email),
      refreshToken = generateJWT.refreshToken(req.body.email);

    res // Create 'session' cookie.
      .cookie("session", accessToken, {
        maxAge: 1000 * 60 * 60 * 24, // One day.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }) // Create refresh cookie.
      .cookie("refresh", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
  } catch (error) {
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
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
    const generateJWT = new jwtService.GenerateJWT(),
      accessToken = generateJWT.accessToken(req.body.email),
      refreshToken = generateJWT.refreshToken(req.body.email);

    // Create cookies again.
    res
      .cookie("session", accessToken, {
        maxAge: 1000 * 60 * 60 * 24, // One day.
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
  } catch (error) {
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
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
    // res.status(500).json({
    //   fsRes: false,
    //   ERROR: "/node/api/auth/users failed to send users.",
    // });
    next(error);
  }
};
