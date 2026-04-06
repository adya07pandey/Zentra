import express from "express";
import * as controller from "./accounts.controller.js";
import protect from "../../middleware/auth.middleware.js";
import attachOrg from "../../middleware/org.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, attachOrg, allowRoles("OWNER","ADMIN"),  controller.createAccount);
router.get("/", protect, attachOrg, allowRoles("OWNER","ADMIN","ANALYST"),  controller.getAccounts);
router.get("/:id", protect, attachOrg,allowRoles("OWNER","ADMIN","ANALYST"),  controller.getAccount);
router.put("/:id", protect, attachOrg,allowRoles("OWNER","ADMIN"),  controller.updateAccount);

export default router;