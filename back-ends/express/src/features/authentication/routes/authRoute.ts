import { Router } from "express";
import * as verifyTokens from "../middleware/verifyTokens";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import verifyUserInCache from "../middleware/verifyUserInCache";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/users", verifyTokens.verifyAccessToken, authController.getUsers);
router.get("/user/:email", verifyTokens.verifyAccessToken, authController.getUser);
router.delete("/user/:email", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.deleteUser);

router.post("/register", verifyCsrfToken, authController.register);
router.post("/login", verifyCsrfToken, verifyUserInCache, authController.login);
// router.post("/login/google", authController);
router.get("/checkSession", verifyTokens.verifyAccessToken, authController.checkSession);
router.post("/refresh", verifyCsrfToken, verifyTokens.verifyRefreshToken, authController.refresh);
router.post("/logout", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.logout);

export default router;
