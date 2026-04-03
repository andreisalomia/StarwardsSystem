import { Router } from "express";
import { listPermissions, updatePermission } from "../controllers/permissionController";
import { authMiddleware } from "../middleware/authMiddleware";
import { permit } from "../middleware/permissionMiddleware";

const router = Router();

// anyone authenticated can list (admins/data-ops typically), updating requires write permission on users
router.get("/", authMiddleware, permit("users", "read"), listPermissions);
router.put("/:id", authMiddleware, permit("users", "write"), updatePermission);

export default router;
