import { Router } from "express";
import {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
} from "../controllers/hotelController";
import { authMiddleware } from "../middleware/authMiddleware";
import { permit } from "../middleware/permissionMiddleware";
import { hotelAccess } from "../middleware/hotelAccessMiddleware";

const router = Router();

// public listing
router.get("/", authMiddleware, permit("hotels", "read"), getAllHotels);

// hotel detail: restricted to admin, hotel's manager or group's manager
router.get("/:id", authMiddleware, hotelAccess("read"), getHotelById);

// create hotel: only admin (use permit)
router.post("/", authMiddleware, permit("hotels", "write"), createHotel);

// update/delete: admin or hotel's manager / group manager
router.put("/:id", authMiddleware, hotelAccess("write"), updateHotel);
router.delete("/:id", authMiddleware, hotelAccess("write"), deleteHotel);

export default router;