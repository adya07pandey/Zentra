import express from "express";
import  * as controller  from "./dashboard.controller.js";
import attachOrg from "../../middleware/org.middleware.js";
import protect from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, attachOrg, controller.dashboardController);

export default router;