import { Request, Response, NextFunction } from "express";
import { Hotel } from "../models";

export function hotelAccess(action: "read" | "write") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Admins can always proceed
    if (user.role === "Administrator") return next();

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid hotel id" });

    const hotel = await Hotel.findByPk(id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    // Hotel Manager who is assigned to this hotel
    if (user.role === "Hotel Manager" && user.hotel_id && Number(user.hotel_id) === Number(hotel.GlobalPropertyID)) return next();

    // Group Manager who is assigned to the same group as the hotel
    if (user.role === "Group Manager" && user.group_id && hotel.GroupID && Number(user.group_id) === Number(hotel.GroupID)) return next();

    return res.status(403).json({ error: "Forbidden" });
  };
}
