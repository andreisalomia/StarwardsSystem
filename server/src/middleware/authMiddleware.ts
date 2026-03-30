import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"] as string | undefined;
  let token: string | undefined = undefined;
  if (auth && auth.startsWith("Bearer ")) token = auth.slice(7);
  if (!token && (req as any).cookies) token = (req as any).cookies["token"];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
