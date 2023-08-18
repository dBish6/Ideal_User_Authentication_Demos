import { Router } from "express";
import * as verifyTokens from "../middleware/verifyTokens";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import verifyUserInCache from "../middleware/verifyUserInCache";
import getGithubUserAccessToken from "../middleware/getGithubUserAccessToken";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/users", verifyTokens.verifyAccessToken, authController.getUsers);
router.get("/user/:email", verifyTokens.verifyAccessToken, authController.getUser);
router.delete("/user/:email", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.deleteUser);

router.post("/register", verifyCsrfToken, authController.register);
router.post("/login", verifyCsrfToken, verifyUserInCache, authController.login);
router.post("/login/google", verifyCsrfToken, verifyTokens.verifyGoogleIdToken, authController.login);
router.post("/login/github", verifyCsrfToken, getGithubUserAccessToken, authController.login);

router.get("/checkSession", verifyTokens.verifyAccessToken, authController.checkSession);
router.post("/refresh", verifyCsrfToken, verifyTokens.verifyRefreshToken, authController.refresh);

router.post("/logout", verifyCsrfToken, authController.logout);

export default router;
