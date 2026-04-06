import express from "express";
import * as controller from "./ledger.controller.js";
import attachOrg  from "../../middleware/org.middleware.js";
import protect from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/accounts/:accountId",  protect, attachOrg, allowRoles("OWNER","ANALYST", "ADMIN", "VIEWER"),controller.getLedger);

export default router;