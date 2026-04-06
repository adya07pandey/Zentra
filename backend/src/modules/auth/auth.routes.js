import express from "express";
import { signupInit,  signupVerify, login, logout} from "./auth.controller.js";
import { getMe } from "./auth.controller.js";
import  protect  from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup/init", signupInit);
router.post("/signup/verify", signupVerify);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;