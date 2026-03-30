import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Permission from "../models/Permission";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function register(req: Request, res: Response) {
  const { name, email, password, role, hotel_id, group_id } = req.body;
  if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password_hash: hash, role, hotel_id: hotel_id || null, group_id: group_id || null });
  // Do not return password_hash
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

  // send token in JSON (frontend can store or you can set cookie here)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findByPk(userId, { attributes: ["id", "name", "email", "role", "hotel_id", "group_id"] });
  if (!user) return res.status(404).json({ error: "User not found" });

  // also include permissions for role
  const perms = await Permission.findAll({ where: { role: user.role } });

  res.json({ user, permissions: perms });
}
