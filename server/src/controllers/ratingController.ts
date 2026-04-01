import { Request, Response } from "express";
import { getOrComputeRating } from "../services/ratingService";

export const getHotelRating = async (req: Request, res: Response): Promise<void> => {
    const hotelId = Number(req.params.id);

    if (isNaN(hotelId)) {
        res.status(400).json({ error: "Invalid hotel ID" });
        return;
    }

    try {
        const rating = await getOrComputeRating(hotelId);
        res.json(rating);
    } catch (err) {
        console.error(`Rating computation failed for hotel ${hotelId}:`, err);
        res.status(500).json({ error: "Failed to compute rating" });
    }
};