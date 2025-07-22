import type { NextApiRequest, NextApiResponse } from 'next';

type Activity = {
  type: 'USER_LOGIN' | 'FILE_UPLOAD' | 'ADMIN_LOGIN' | 'USER_REGISTER' | 'SYSTEM_INIT';
  text: string;
  time: string;
};

// Mock in-memory activity log
const activityLog: Activity[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { type, text } = req.body;
    if (!type || !text) {
      return res.status(400).json({ message: 'Type and text are required' });
    }
    const newActivity: Activity = {
      type,
      text,
      time: new Date().toISOString(),
    };
    activityLog.unshift(newActivity);
    return res.status(201).json({ message: 'Activity logged' });
  } else if (req.method === 'GET') {
    return res.status(200).json(activityLog);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
