import type { NextApiRequest, NextApiResponse } from 'next';

// Mock in-memory file store (should be shared or moved to a common module)
const files: { name: string; description: string; encryptedData: string }[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'File name is required' });
  }

  const file = files.find(f => f.name === name);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // In a real app, verify user access rights here

  return res.status(200).json({ name: file.name, description: file.description, encryptedData: file.encryptedData });
}
