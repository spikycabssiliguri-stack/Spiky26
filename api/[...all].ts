import app from '../server.ts';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Restore true target URL for Express routing
  const xMatched = (req.headers['x-matched-path'] as string) || 
                    (req.headers['x-vercel-matched-path'] as string) || 
                    (req.headers['x-forwarded-uri'] as string);

  if (xMatched && xMatched.startsWith('/api') && !xMatched.includes('[')) {
    const qIndex = (req.url || '').indexOf('?');
    const queryPart = qIndex >= 0 ? req.url.substring(qIndex) : '';
    req.url = `${xMatched}${queryPart}`;
  } else if (req.query && req.query.all) {
    const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    const qIndex = (req.url || '').indexOf('?');
    const queryPart = qIndex >= 0 ? req.url.substring(qIndex) : '';
    req.url = `/api/${sub}${queryPart}`;
  } else if (req.url && (req.url.includes('[') || req.url === '/' || req.url.startsWith('/?'))) {
    if (req.query && typeof req.query.path === 'string') {
      req.url = `/api/${req.query.path}`;
    }
  }

  // Ensure req.url starts with /api
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Unhandled serverless error in api/[...all]:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err?.message || 'Server error processing request' });
    }
  }
}

