import { Router } from "express";
import * as verifyTokens from "authentication/middleware/verifyTokens";
import verifyUserInCache from "authentication/middleware/verifyUserInCache";
import * as authController from "../controllers/authController";

const router = Router(),
  baseUrl = "/api/auth";

router.get(`${baseUrl}/users`, verifyTokens.verifyAccessToken, authController.getUsers);
router.get(`${baseUrl}/user/:email`, verifyTokens.verifyAccessToken, authController.getUser);
router.delete(`${baseUrl}/user/:email`, verifyTokens.verifyCsrf, verifyTokens.verifyAccessToken, authController.deleteUser);

router.post(`${baseUrl}/register`, verifyTokens.verifyCsrf, authController.register);
router.post(`${baseUrl}/login`, verifyTokens.verifyCsrf, verifyUserInCache, authController.login);
// router.post(`${baseUrl}/login/google`, authController);
router.post(`${baseUrl}/checkSession`, verifyTokens.verifyAccessToken);
router.post(`${baseUrl}/refresh`, verifyTokens.verifyRefreshToken, authController.refresh);
router.post(`${baseUrl}/logout`, verifyTokens.verifyCsrf, verifyTokens.verifyAccessToken, authController.logout);

export default router;
