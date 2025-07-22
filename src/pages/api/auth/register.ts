import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock in-memory user store
const users: { email: string; passwordHash: string }[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(201).json({ token });
}
