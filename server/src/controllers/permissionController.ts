import { Request, Response } from "express";
import Permission from "../models/Permission";

export const listPermissions = async (req: Request, res: Response) => {
  try {
    const perms = await Permission.findAll({ attributes: ["id", "role", "resource", "can_read", "can_write"] });
    res.json(perms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list permissions" });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { can_read, can_write } = req.body;
  try {
    const p = await Permission.findByPk(id);
    if (!p) return res.status(404).json({ error: "Permission not found" });
    await p.update({ can_read: !!can_read, can_write: !!can_write });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update permission" });
  }
};
