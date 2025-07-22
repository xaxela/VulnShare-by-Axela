import type { NextApiRequest, NextApiResponse } from 'next';
import { addFile } from '@/lib/file-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, description, encryptedData, user_id } = req.body;

  if (!name || !encryptedData) {
    return res.status(400).json({ message: 'File name and encrypted data are required' });
  }

  const success = await addFile({ name, description: description || '', encryptedData, user_id });

  if (!success) {
    return res.status(409).json({ message: 'File with this name already exists' });
  }

  return res.status(201).json({ message: 'File uploaded successfully' });
}
