import { Request, Response } from "express";
import * as hotelService from "../services/hotelService";

export const getAllHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        // return hotels scoped to the requesting user
        const hotels = await hotelService.findHotelsForUser(user);
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve hotels" });
    }
};

export const getHotelById = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await hotelService.findHotelById(Number(req.params.id));
        if (!hotel) {
            res.status(404).json({ error: "Hotel not found" });
            return;
        }
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve hotel" });
    }
};

export const createHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await hotelService.createHotel(req.body);
        res.status(201).json(hotel);
    } catch (err) {
        res.status(500).json({ error: "Failed to create hotel" });
    }
};

export const updateHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await hotelService.updateHotel(Number(req.params.id), req.body);
        if (!hotel) {
            res.status(404).json({ error: "Hotel not found" });
            return;
        }
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: "Failed to update hotel" });
    }
};

export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await hotelService.deleteHotel(Number(req.params.id));
        if (!result) {
            res.status(404).json({ error: "Hotel not found" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete hotel" });
    }
};