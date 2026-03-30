import { Router } from "express";
import {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
} from "../controllers/hotelController";

const router = Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", createHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

export default router;