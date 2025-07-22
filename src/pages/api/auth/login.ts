import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/lib/user-store';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = getUser(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Since passwords are stored in plain text in user-store, compare directly
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({ token });
}
