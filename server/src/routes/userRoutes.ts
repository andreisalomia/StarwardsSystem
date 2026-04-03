import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { permit } from "../middleware/permissionMiddleware";

const router = Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
// user create/update/delete restricted to Administrator
router.post("/", authMiddleware, permit("users", "write"), createUser);
router.put("/:id", authMiddleware, permit("users", "write"), updateUser);
router.delete("/:id", authMiddleware, permit("users", "write"), deleteUser);

export default router;
