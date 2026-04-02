import { Request, Response, NextFunction } from "express";
import Permission from "../models/Permission";

export function permit(resource: string, action: "read" | "write") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Administrator bypass
    if (user.role === "Administrator") return next();

    const perms = await Permission.findAll({ where: { role: user.role, resource } });
    if (!perms || perms.length === 0) return res.status(403).json({ error: "Forbidden" });

    const p = perms[0];
    if (action === "read" && p.can_read) return next();
    if (action === "write" && p.can_write) return next();

    return res.status(403).json({ error: "Forbidden" });
  };
}
