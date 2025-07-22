import type { NextApiRequest, NextApiResponse } from 'next';
import { getFiles } from '@/lib/file-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const files = await getFiles();
    res.status(200).json(files);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
