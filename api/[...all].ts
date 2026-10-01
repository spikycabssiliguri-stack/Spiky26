import app from '../server';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req: any, res: any) {
  // Ensure req.url starts with /api
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}
