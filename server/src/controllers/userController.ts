import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { Hotel } from "../models";

export const getAllUsers = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    if (user.role === "Administrator") {
      const users = await User.findAll({ attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
      return res.json(users);
    }

    if (user.role === "Group Manager") {
      const users = await User.findAll({ where: { group_id: user.group_id }, attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
      return res.json(users);
    }

    if (user.role === "Hotel Manager") {
      // If the manager has a `group_id` explicitly set on their account, return all hotel managers in that group
      if (user.group_id) {
        const users = await User.findAll({ where: { group_id: user.group_id, role: "Hotel Manager" }, attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
        return res.json(users);
      }

      // Otherwise, if the manager is attached to a hotel that belongs to a group, return all hotel managers in the same group
      if (user.hotel_id) {
        const hotel = await Hotel.findByPk(user.hotel_id);
        const groupId = hotel?.GroupID || null;
        if (groupId) {
          const users = await User.findAll({ where: { group_id: groupId, role: "Hotel Manager" }, attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
          return res.json(users);
        }
      }

      // fallback: only users for the same hotel
      const users = await User.findAll({ where: { hotel_id: user.hotel_id }, attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
      return res.json(users);
    }

    // Travelers and others: return only self
    const u = await User.findByPk(user.id, { attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
    return res.json(u ? [u] : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id, { attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role, hotel_id, group_id } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: "Missing fields" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, password_hash: hash, role, hotel_id: hotel_id || null, group_id: group_id || null });
    res.status(201).json({ id: u.id, name: u.name, email: u.email, role: u.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password, role, hotel_id, group_id } = req.body;
  try {
    const u = await User.findByPk(id);
    if (!u) return res.status(404).json({ error: "User not found" });
    const update: any = { name, email, role, hotel_id: hotel_id || null, group_id: group_id || null };
    if (password) update.password_hash = await bcrypt.hash(password, 10);
    await u.update(update);
    res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const u = await User.findByPk(id);
    if (!u) return res.status(404).json({ error: "User not found" });
    await u.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
