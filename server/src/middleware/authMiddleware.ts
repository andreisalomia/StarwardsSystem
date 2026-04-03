import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"] as string | undefined;
  let token: string | undefined = undefined;
  if (auth && auth.startsWith("Bearer ")) token = auth.slice(7);
  if (!token && (req as any).cookies) token = (req as any).cookies["token"];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // load full user from DB to include hotel_id and group_id
    const dbUser = await User.findByPk(payload.id, { attributes: ["id", "role", "hotel_id", "group_id"] });
    if (!dbUser) return res.status(401).json({ error: "Invalid token (user not found)" });
    (req as any).user = { id: dbUser.id, role: dbUser.role, hotel_id: dbUser.hotel_id, group_id: dbUser.group_id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
