import { Request, Response } from 'express';
import Sweet from '../models/Sweet';
import { AuthedRequest } from '../middleware/auth';

export async function createSweet(req: AuthedRequest, res: Response) {
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price == null || quantity == null) return res.status(400).json({ message: 'Missing fields' });
  const existing = await Sweet.findOne({ name });
  if (existing) return res.status(409).json({ message: 'Sweet already exists' });
  const sweet = new Sweet({ name, category, price, quantity });
  await sweet.save();
  res.status(201).json(sweet);
}

export async function listSweets(req: Request, res: Response) {
  const sweets = await Sweet.find();
  res.json(sweets);
}

export async function searchSweets(req: Request, res: Response) {
  const { q, category, minPrice, maxPrice } = req.query as any;
  const filter: any = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  const sweets = await Sweet.find(filter);
  res.json(sweets);
}

export async function updateSweet(req: AuthedRequest, res: Response) {
  const id = req.params.id;
  const update = req.body;
  const sweet = await Sweet.findByIdAndUpdate(id, update, { new: true });
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  res.json(sweet);
}

export async function deleteSweet(req: AuthedRequest, res: Response) {
  const id = req.params.id;
  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}

export async function purchaseSweet(req: AuthedRequest, res: Response) {
  const id = req.params.id;
  const qty = Number(req.body.quantity || 1);
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient quantity' });
  sweet.quantity -= qty;
  await sweet.save();
  res.json(sweet);
}

export async function restockSweet(req: AuthedRequest, res: Response) {
  const id = req.params.id;
  const qty = Number(req.body.quantity || 1);
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  sweet.quantity += qty;
  await sweet.save();
  res.json(sweet);
}
