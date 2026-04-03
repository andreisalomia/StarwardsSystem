import { Router } from "express";
import { getHotelRating } from "../controllers/ratingController";

const router = Router();

router.get("/:id/rating", getHotelRating);

export default router;