import { Router } from "express";
import * as verifyTokens from "../middleware/verifyTokens";
import verifyUserInCache from "../middleware/verifyUserInCache";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/users", verifyTokens.verifyAccessToken, authController.getUsers);
router.get("/user/:email", verifyTokens.verifyAccessToken, authController.getUser);
router.delete("/user/:email", verifyTokens.verifyCsrf, verifyTokens.verifyAccessToken, authController.deleteUser);

router.post("/register", verifyTokens.verifyCsrf, authController.register);
router.post("/login", verifyTokens.verifyCsrf, verifyUserInCache, authController.login);
// router.post("/login/google", authController);
router.post("/checkSession", verifyTokens.verifyAccessToken);
router.post("/refresh", verifyTokens.verifyRefreshToken, authController.refresh);
router.post("/logout", verifyTokens.verifyCsrf, verifyTokens.verifyAccessToken, authController.logout);

export default router;
