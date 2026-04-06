import express from "express";
import * as controller from "./user.controller.js";
import attachOrg from "../../middleware/org.middleware.js";
import protect from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();
router.get("", protect, attachOrg, allowRoles("OWNER", "ADMIN","ANALYST"), controller.getUsers);
router.post("/invite", protect, attachOrg, allowRoles("OWNER", "ADMIN"), controller.inviteUser);
router.post("/accept-invite", controller.acceptInvite);
export default router;