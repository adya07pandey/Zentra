import express from "express";
import * as controller from "./transaction.controller.js";
import attachOrg from "../../middleware/org.middleware.js";
import protect from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();
router.post("", protect, attachOrg, allowRoles("OWNER", "ADMIN"), controller.createTransaction);
router.post("/:id/reverse", protect, attachOrg, allowRoles("OWNER", "ADMIN"), controller.reverseTransaction);
router.get("/:transactionId", protect, attachOrg, allowRoles("OWNER", "VIEWER", "ANALYST", "ADMIN"), controller.getTransaction);
router.get("/", protect, attachOrg, allowRoles("OWNER", "VIEWER", "ANALYST", "ADMIN"), controller.getAllTransactions);
export default router;