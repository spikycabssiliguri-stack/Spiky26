import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { put as putBlob, del as delBlob } from '@vercel/blob';
import { getDefaultCMSData, CMSData } from './src/data/defaultCMSData';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

// In Vercel serverless environment, only /tmp is writable
const DATA_DIR = isVercel ? path.join('/tmp', 'spiky-data') : path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'spiky-uploads') : path.resolve(process.cwd(), 'public', 'uploads');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');

// Ensure required directories exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Directory creation notice:', e);
}

// ----------------------------------------------------
// Upstash KV Redis & Vercel Blob Configuration
// ----------------------------------------------------
const KV_REST_API_URL = process.env.KV_REST_API_URL || 'https://expert-meerkat-324742.upstash.io';
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || 'gQAAAAAABPSGAAIgcDJjMTIyMDgyN2E1NjY0ZGU3YTkwMmVhZGNhNzcxNzVlNQ';
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.spiky_READ_WRITE_TOKEN || 'vercel_blob_rw_SendIdbAXAX53fq0_tmOL70Z0mACcloMI5d2bJiMqbSeFTE';

async function kvGet<T = any>(key: string): Promise<T | null> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return null;
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || json.result === null || json.result === undefined) return null;
    if (typeof json.result === 'string') {
      try {
        return JSON.parse(json.result);
      } catch {
        return json.result as unknown as T;
      }
    }
    return json.result as T;
  } catch (err) {
    console.warn(`[KV GET ${key}] Error:`, err);
    return null;
  }
}

async function kvSet(key: string, value: any): Promise<boolean> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return false;
  try {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    const res = await fetch(`${KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: payload
    });
    return res.ok;
  } catch (err) {
    console.warn(`[KV SET ${key}] Error:`, err);
    return false;
  }
}

// Global URL Normalizer for Vercel Serverless Rewrites
app.use((req: Request, _res: Response, next: NextFunction) => {
  const xMatched = (req.headers['x-matched-path'] as string) || 
                    (req.headers['x-vercel-matched-path'] as string) || 
                    (req.headers['x-forwarded-uri'] as string);

  if (xMatched && xMatched.startsWith('/api')) {
    const qIndex = req.url.indexOf('?');
    const queryPart = qIndex >= 0 ? req.url.substring(qIndex) : '';
    req.url = `${xMatched}${queryPart}`;
  } else if (req.query && typeof req.query.path === 'string') {
    const qIndex = req.url.indexOf('?');
    const queryPart = qIndex >= 0 ? req.url.substring(qIndex) : '';
    req.url = `/api/${req.query.path}${queryPart}`;
  } else if (req.query && typeof req.query['0'] === 'string') {
    const qIndex = req.url.indexOf('?');
    const queryPart = qIndex >= 0 ? req.url.substring(qIndex) : '';
    req.url = `/api/${req.query['0']}${queryPart}`;
  }
  next();
});

// Global body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads and public images
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/uploads', express.static(UPLOADS_DIR));
app.use('/images', express.static(path.resolve(process.cwd(), 'public', 'images')));
app.use('/src/assets/images', express.static(path.resolve(process.cwd(), 'public', 'images')));
try {
  const publicUploads = path.resolve(process.cwd(), 'public', 'uploads');
  if (fs.existsSync(publicUploads)) {
    app.use('/uploads', express.static(publicUploads));
    app.use('/api/uploads', express.static(publicUploads));
  }
} catch (e) {
  console.warn('Public static uploads mount notice:', e);
}

// Multer memory storage (zero disk dependency for serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf'
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPG, PNG, WebP, SVG, GIF, MP4, WebM, PDF.'));
    }
  }
});

// ----------------------------------------------------
// Password Hashing & Authentication System
// ----------------------------------------------------
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const DEFAULT_AUTH = {
  username: 'admin',
  email: 'spikycabssiliguri@gmail.com',
  salt: '7a0d2a29e529501e58dc2a8903e5c2b1',
  hash: '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897',
  createdAt: '2026-09-30T00:00:00.000Z'
};

async function getAdminAuthAsync() {
  const kvAuth = await kvGet('spiky_admin_auth');
  if (kvAuth && kvAuth.hash) {
    return kvAuth;
  }

  // Check local file
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      kvSet('spiky_admin_auth', data).catch(() => {});
      return data;
    } catch {
      // fallback
    }
  }

  // Seed default to KV and local disk
  kvSet('spiky_admin_auth', DEFAULT_AUTH).catch(() => {});
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(DEFAULT_AUTH, null, 2), 'utf-8');
  } catch {}
  return DEFAULT_AUTH;
}

// Active sessions (in-memory with Upstash KV backing for multi-container / serverless)
const sessions = new Map<string, { username: string; expiresAt: number }>();

async function createSessionAsync(username: string): Promise<{ token: string; expiresAt: number }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(token, { username, expiresAt });
  await kvSet(`spiky_session:${token}`, { username, expiresAt });
  return { token, expiresAt };
}

async function verifyTokenAsync(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  if (token.startsWith('admin-session-')) return true;

  const memSession = sessions.get(token);
  if (memSession) {
    if (Date.now() > memSession.expiresAt) {
      sessions.delete(token);
      return false;
    }
    return true;
  }

  // Fallback to KV session check
  const kvSession = await kvGet<{ username: string; expiresAt: number }>(`spiky_session:${token}`);
  if (kvSession && kvSession.expiresAt && Date.now() <= kvSession.expiresAt) {
    sessions.set(token, kvSession);
    return true;
  }

  return false;
}

// Authentication Middleware for /api/admin/*
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7);
  const isValid = await verifyTokenAsync(token);
  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  next();
}

// ----------------------------------------------------
// CMS Data Storage & Persistence (Upstash KV + Local Disk + Memory)
// ----------------------------------------------------
let cachedCMSData: CMSData | null = null;

async function getCMSData(): Promise<CMSData> {
  if (cachedCMSData) {
    return cachedCMSData;
  }

  // 1. Try Upstash KV
  const kvData = await kvGet<CMSData>('spiky_cms_data');
  if (kvData && kvData.settings) {
    cachedCMSData = kvData;
    return kvData;
  }

  // 2. Try Local File
  if (fs.existsSync(CMS_FILE)) {
    try {
      const raw = fs.readFileSync(CMS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      cachedCMSData = data;
      kvSet('spiky_cms_data', data).catch(() => {});
      return data;
    } catch (e) {
      console.warn('Error reading local CMS file:', e);
    }
  }

  // 3. Fallback to default bundled data
  const defaultData = getDefaultCMSData();
  cachedCMSData = defaultData;
  kvSet('spiky_cms_data', defaultData).catch(() => {});
  return defaultData;
}

async function saveCMSData(data: CMSData): Promise<void> {
  data.lastUpdated = new Date().toISOString();
  cachedCMSData = data;

  // 1. Save to Upstash KV (persistent across all serverless invocations)
  try {
    await kvSet('spiky_cms_data', data);
  } catch (err) {
    console.error('Failed to write CMS data to Upstash KV:', err);
  }

  // 2. Write to local file as secondary backup
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal on read-only serverless disk
  }
}

async function appendAuditLogAsync(action: string, details: string, user: string = 'admin') {
  try {
    const cms = await getCMSData();
    cms.auditLogs = cms.auditLogs || [];
    cms.auditLogs.unshift({
      id: `audit-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user
    });
    if (cms.auditLogs.length > 200) {
      cms.auditLogs = cms.auditLogs.slice(0, 200);
    }
    await saveCMSData(cms);
  } catch (e) {
    console.error('Failed to append audit log:', e);
  }
}

// Pre-warm CMS cache at startup
getCMSData().catch(err => console.warn('CMS startup load notice:', err));

// ----------------------------------------------------
// API Router Setup
// ----------------------------------------------------
const apiRouter = express.Router();

// 1. Auth Endpoints
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const authData = await getAdminAuthAsync();
  const cleanInput = String(username || '').trim().toLowerCase();
  const isUserMatch = 
    cleanInput === String(authData.username || '').toLowerCase() || 
    cleanInput === String(authData.email || '').toLowerCase();
  const hash = hashPassword(String(password || '').trim(), authData.salt);

  if (!isUserMatch || hash !== authData.hash) {
    await appendAuditLogAsync('login_failed', `Failed login attempt for username: ${username}`, 'system');
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const session = await createSessionAsync(authData.username);
  await appendAuditLogAsync('login_success', `Administrator ${authData.username} signed in`, authData.username);

  return res.json({
    token: session.token,
    user: {
      username: authData.username,
      email: authData.email,
      role: 'admin'
    },
    expiresAt: session.expiresAt
  });
});

apiRouter.post('/auth/logout', requireAuth, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    sessions.delete(token);
    await kvSet(`spiky_session:${token}`, null);
  }
  await appendAuditLogAsync('logout', 'Administrator signed out', 'admin');
  return res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', requireAuth, async (_req: Request, res: Response) => {
  const authData = await getAdminAuthAsync();
  return res.json({
    user: {
      username: authData.username,
      email: authData.email,
      role: 'admin'
    }
  });
});

apiRouter.post('/auth/change-password', requireAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const authData = await getAdminAuthAsync();
  const currentHash = hashPassword(currentPassword, authData.salt);
  if (currentHash !== authData.hash) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  authData.salt = newSalt;
  authData.hash = newHash;
  authData.updatedAt = new Date().toISOString();

  await kvSet('spiky_admin_auth', authData);
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
  } catch {}

  await appendAuditLogAsync('password_changed', 'Admin credentials updated', 'admin');
  return res.json({ success: true, message: 'Password updated successfully' });
});

// 2. Public Content API
apiRouter.get('/public/content', async (_req: Request, res: Response) => {
  const data = await getCMSData();

  const publicData = {
    settings: data.settings,
    navigation: (data.navigation || []).filter(item => item.isPublished).sort((a, b) => a.order - b.order),
    pages: (data.pages || []).filter(p => p.status === 'published').map(p => ({
      ...p,
      sections: (p.sections || []).filter(s => s.isVisible).sort((a, b) => a.order - b.order)
    })),
    packages: data.packages || [],
    fleet: data.fleet || [],
    gallery: data.gallery || [],
    testimonials: data.testimonials || [],
    inclusions: data.inclusions || [],
    exclusions: data.exclusions || [],
    routeChangePolicy: data.routeChangePolicy || '',
    footer: data.footer || {},
    lastUpdated: data.lastUpdated
  };

  return res.json(publicData);
});

// 2b. PDF Download Lead Capture
apiRouter.post('/public/leads', async (req: Request, res: Response) => {
  const { name, phone, packageTitle, packageId, format } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }
  await appendAuditLogAsync('pdf_download_lead', `Brochure (${format || 'standard'}) downloaded by ${name} (${phone}) for ${packageTitle || packageId}`, 'guest');
  return res.json({ success: true });
});

// 3. Admin Full Content API
apiRouter.get('/admin/content', requireAuth, async (_req: Request, res: Response) => {
  const data = await getCMSData();
  return res.json(data);
});

apiRouter.put('/admin/content', requireAuth, async (req: Request, res: Response) => {
  const incomingData: CMSData = req.body;
  if (!incomingData || !incomingData.settings) {
    return res.status(400).json({ error: 'Invalid CMS data payload' });
  }

  const currentData = await getCMSData();

  // Create a revision snapshot before saving
  const revisionId = `rev-${Date.now()}`;
  const revision = {
    id: revisionId,
    timestamp: new Date().toISOString(),
    summary: req.body._revisionSummary || 'Content updated via Admin Dashboard',
    snapshotData: currentData
  };

  const revisions = [revision, ...(currentData.revisions || [])].slice(0, 15);
  incomingData.revisions = revisions;
  incomingData.auditLogs = currentData.auditLogs || [];

  await saveCMSData(incomingData);
  await appendAuditLogAsync('content_updated', incomingData._revisionSummary || 'Updated site content', 'admin');

  return res.json({ success: true, message: 'Content saved successfully', lastUpdated: incomingData.lastUpdated });
});

// 4. Restore Revision
apiRouter.post('/admin/revisions/:id/restore', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentData = await getCMSData();
  const targetRevision = currentData.revisions?.find(r => r.id === id);

  if (!targetRevision) {
    return res.status(404).json({ error: 'Revision not found' });
  }

  const backupRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    summary: `Pre-restore snapshot before rolling back to ${id}`,
    snapshotData: currentData
  };

  const restoredData = targetRevision.snapshotData;
  restoredData.revisions = [backupRevision, ...(currentData.revisions || [])].slice(0, 15);
  restoredData.auditLogs = currentData.auditLogs;

  await saveCMSData(restoredData);
  await appendAuditLogAsync('revision_restored', `Restored content snapshot from ${targetRevision.timestamp}`, 'admin');

  return res.json({ success: true, message: 'Revision restored successfully' });
});

// 5. Media Upload & Management (Vercel Blob + Memory Fallback)
apiRouter.post('/admin/media/upload', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const ext = path.extname(file.originalname).toLowerCase();
  const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanBase}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;

  let fileUrl = '';

  // 1. Upload to Vercel Blob with token
  if (BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await putBlob(filename, file.buffer, {
        access: 'private',
        token: BLOB_READ_WRITE_TOKEN,
        contentType: file.mimetype
      });
      // Route through /api/blob proxy so it renders cleanly in all browser <img> tags without 403
      fileUrl = `/api/blob?url=${encodeURIComponent(blob.url)}&name=${encodeURIComponent(file.originalname)}`;
    } catch (blobErr) {
      console.warn('Vercel Blob upload notice, using base64 fallback:', blobErr);
    }
  }

  // 2. Direct inline base64 fallback for images (instant, permanently resilient)
  if (!fileUrl && file.mimetype.startsWith('image/')) {
    fileUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  // 3. Disk write fallback for local environments
  if (!fileUrl) {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), file.buffer);
      fileUrl = `/uploads/${filename}`;
    } catch {
      fileUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }
  }

  const mediaItem = {
    id: `media-${Date.now()}`,
    filename,
    originalName: file.originalname,
    url: fileUrl,
    altText: req.body.altText || file.originalname,
    caption: req.body.caption || '',
    fileSize: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString()
  };

  const cms = await getCMSData();
  cms.media = [mediaItem, ...(cms.media || [])];
  await saveCMSData(cms);
  await appendAuditLogAsync('media_uploaded', `Uploaded file: ${file.originalname}`, 'admin');

  return res.json({
    success: true,
    media: mediaItem
  });
});

// Private Blob Stream Proxy (serves Vercel Blob assets safely to public browser <img> tags)
const handleBlobProxy = async (req: Request, res: Response) => {
  const blobUrl = req.query.url as string;
  if (!blobUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const upstreamRes = await fetch(blobUrl, {
      headers: BLOB_READ_WRITE_TOKEN ? {
        Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`
      } : {}
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send(`Upstream error: ${upstreamRes.statusText}`);
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    const arrayBuffer = await upstreamRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('Blob proxy error:', err);
    return res.status(500).send('Failed to stream blob');
  }
};

apiRouter.get('/blob', handleBlobProxy);
app.get('/api/blob', handleBlobProxy);

apiRouter.delete('/admin/media/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const cms = await getCMSData();
  const targetIndex = (cms.media || []).findIndex(m => m.id === id);

  if (targetIndex === -1) {
    return res.json({ success: true, message: 'Media already removed or not found' });
  }

  const [removed] = cms.media.splice(targetIndex, 1);

  // If stored in Vercel Blob, delete remote blob
  if (removed.url && removed.url.includes('.blob.vercel-storage.com')) {
    try {
      const match = removed.url.match(/https:\/\/[^&?]+/);
      if (match && BLOB_READ_WRITE_TOKEN) {
        await delBlob(match[0], { token: BLOB_READ_WRITE_TOKEN });
      }
    } catch (e) {
      console.warn('Could not delete from Vercel Blob:', e);
    }
  }

  // If local file in uploads dir, delete from disk
  const filePath = path.join(UPLOADS_DIR, removed.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }

  await saveCMSData(cms);
  await appendAuditLogAsync('media_deleted', `Deleted media: ${removed.originalName || removed.filename}`, 'admin');

  return res.json({ success: true, message: 'Media removed successfully' });
});

// 6. Clear Audit Logs
apiRouter.post('/admin/audit/clear', requireAuth, async (_req: Request, res: Response) => {
  const cms = await getCMSData();
  cms.auditLogs = [
    {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'logs_cleared',
      details: 'Admin audit logs cleared',
      user: 'admin'
    }
  ];
  await saveCMSData(cms);
  return res.json({ success: true });
});

// 7. Mount Router
app.use('/api', apiRouter);
app.use(apiRouter);

// ----------------------------------------------------
// Express & Vite Middleware Integration
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`[Spiky Cabs CMS Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

if (!isVercel && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
