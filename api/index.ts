import app from '../server.ts';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Unhandled serverless error in api/index:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err?.message || 'Server error processing request' });
    }
  }
}

