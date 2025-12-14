import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export async function register(req: Request, res: Response) {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash, role: role === 'admin' ? 'admin' : 'user' });
  await user.save();
  return res.status(201).json({ id: user._id, email: user.email, role: user.role });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
}
