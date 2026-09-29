import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
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

// Global middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads from both runtime upload dir and public assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/uploads', express.static(UPLOADS_DIR));
try {
  const publicUploads = path.resolve(process.cwd(), 'public', 'uploads');
  if (fs.existsSync(publicUploads)) {
    app.use('/uploads', express.static(publicUploads));
    app.use('/api/uploads', express.static(publicUploads));
  }
} catch (e) {
  console.warn('Public static uploads mount notice:', e);
}

// Setup Multer for secure file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${cleanBase}_${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
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

function initAdminAuth() {
  if (!fs.existsSync(AUTH_FILE)) {
    // Check if a pre-configured auth file is bundled with the project
    const bundledAuth = path.resolve(process.cwd(), 'data', 'admin-auth.json');
    if (fs.existsSync(bundledAuth)) {
      try {
        fs.copyFileSync(bundledAuth, AUTH_FILE);
        return;
      } catch (e) {
        console.warn('Could not copy bundled auth:', e);
      }
    }

    const defaultPassword = process.env.ADMIN_PASSWORD || 'Sudip@123';
    const salt = '7a0d2a29e529501e58dc2a8903e5c2b1';
    const hash = '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897';
    const authData = {
      username: 'admin',
      email: 'spikycabssiliguri@gmail.com',
      salt,
      hash,
      createdAt: new Date().toISOString()
    };
    try {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write auth file:', e);
    }
  }
}
initAdminAuth();

function getAdminAuth() {
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
  } catch {
    initAdminAuth();
    try {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    } catch {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Sudip@123';
      const salt = '7a0d2a29e529501e58dc2a8903e5c2b1';
      return {
        username: 'admin',
        email: 'spikycabssiliguri@gmail.com',
        salt,
        hash: '0966323d07f09c296ab7a4baa24bd37767dcbe03494c9cd1988dad82e8c25ba5f8e5855591e6c3c76aa7948e3538f06c03719102b3973737274dafe51370c897'
      };
    }
  }
}

// Active sessions (in-memory with 24-hr expiry)
const sessions = new Map<string, { username: string; expiresAt: number }>();

function createSession(username: string): { token: string; expiresAt: number } {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(token, { username, expiresAt });
  return { token, expiresAt };
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

// Authentication Middleware for /api/admin/*
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7);
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  next();
}

// ----------------------------------------------------
// CMS Data Storage & Persistence
// ----------------------------------------------------
function readCMSData(): CMSData {
  if (!fs.existsSync(CMS_FILE)) {
    // Check if pre-configured cms.json is bundled with the project
    const bundledCMS = path.resolve(process.cwd(), 'data', 'cms.json');
    if (fs.existsSync(bundledCMS)) {
      try {
        fs.copyFileSync(bundledCMS, CMS_FILE);
        const raw = fs.readFileSync(CMS_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Could not copy bundled CMS:', e);
      }
    }

    const defaultData = getDefaultCMSData();
    try {
      fs.writeFileSync(CMS_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write default CMS file to disk:', e);
    }
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading cms.json, fallback to default:', err);
    return getDefaultCMSData();
  }
}

function writeCMSData(data: CMSData): void {
  data.lastUpdated = new Date().toISOString();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Could not persist cms.json:', e);
  }
}

function appendAuditLog(action: string, details: string, user: string = 'admin') {
  try {
    const cms = readCMSData();
    cms.auditLogs = cms.auditLogs || [];
    cms.auditLogs.unshift({
      id: `audit-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user
    });
    // Keep max 200 logs
    if (cms.auditLogs.length > 200) {
      cms.auditLogs = cms.auditLogs.slice(0, 200);
    }
    writeCMSData(cms);
  } catch (e) {
    console.error('Failed to append audit log:', e);
  }
}

// ----------------------------------------------------
// API Router Setup (Supports both /api/* and trimmed serverless routes)
// ----------------------------------------------------
const apiRouter = express.Router();

// 1. Auth Endpoints
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const authData = getAdminAuth();
  const cleanInput = String(username || '').trim().toLowerCase();
  const isUserMatch = 
    cleanInput === String(authData.username || '').toLowerCase() || 
    cleanInput === String(authData.email || '').toLowerCase();
  const hash = hashPassword(String(password || '').trim(), authData.salt);

  if (!isUserMatch || hash !== authData.hash) {
    appendAuditLog('login_failed', `Failed login attempt for username: ${username}`, 'system');
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const session = createSession(authData.username);
  appendAuditLog('login_success', `Administrator ${authData.username} signed in`, authData.username);

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

apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    sessions.delete(token);
  }
  appendAuditLog('logout', 'Administrator signed out', 'admin');
  return res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', requireAuth, (_req: Request, res: Response) => {
  const authData = getAdminAuth();
  return res.json({
    user: {
      username: authData.username,
      email: authData.email,
      role: 'admin'
    }
  });
});

apiRouter.post('/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const authData = getAdminAuth();
  const currentHash = hashPassword(currentPassword, authData.salt);
  if (currentHash !== authData.hash) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  authData.salt = newSalt;
  authData.hash = newHash;
  authData.updatedAt = new Date().toISOString();

  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save auth file:', e);
  }
  appendAuditLog('password_changed', 'Admin credentials updated', 'admin');

  return res.json({ success: true, message: 'Password updated successfully' });
});

// 2. Public Content API (Returns only published content, no drafts, secrets, or logs)
apiRouter.get('/public/content', (_req: Request, res: Response) => {
  const data = readCMSData();

  // Strip out auditLogs, revisions, and filter only published pages and packages
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
apiRouter.post('/public/leads', (req: Request, res: Response) => {
  const { name, phone, packageTitle, packageId } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }
  appendAuditLog('pdf_download_lead', `Brochure downloaded by ${name} (${phone}) for ${packageTitle || packageId}`, 'guest');
  return res.json({ success: true });
});

// 3. Admin Full Content API
apiRouter.get('/admin/content', requireAuth, (_req: Request, res: Response) => {
  const data = readCMSData();
  return res.json(data);
});

apiRouter.put('/admin/content', requireAuth, (req: Request, res: Response) => {
  const incomingData: CMSData = req.body;
  if (!incomingData || !incomingData.settings) {
    return res.status(400).json({ error: 'Invalid CMS data payload' });
  }

  const currentData = readCMSData();

  // Create a revision snapshot before saving
  const revisionId = `rev-${Date.now()}`;
  const revision = {
    id: revisionId,
    timestamp: new Date().toISOString(),
    summary: req.body._revisionSummary || 'Content updated via Admin Dashboard',
    snapshotData: currentData
  };

  // Keep last 15 revisions
  const revisions = [revision, ...(currentData.revisions || [])].slice(0, 15);
  incomingData.revisions = revisions;

  // Preserve auditLogs
  incomingData.auditLogs = currentData.auditLogs || [];

  writeCMSData(incomingData);
  appendAuditLog('content_updated', incomingData._revisionSummary || 'Updated site content', 'admin');

  return res.json({ success: true, message: 'Content saved successfully', lastUpdated: incomingData.lastUpdated });
});

// 4. Restore Revision
apiRouter.post('/admin/revisions/:id/restore', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const currentData = readCMSData();
  const targetRevision = currentData.revisions?.find(r => r.id === id);

  if (!targetRevision) {
    return res.status(404).json({ error: 'Revision not found' });
  }

  // Save current as a revision before rollback
  const backupRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    summary: `Pre-restore snapshot before rolling back to ${id}`,
    snapshotData: currentData
  };

  const restoredData = targetRevision.snapshotData;
  restoredData.revisions = [backupRevision, ...(currentData.revisions || [])].slice(0, 15);
  restoredData.auditLogs = currentData.auditLogs;

  writeCMSData(restoredData);
  appendAuditLog('revision_restored', `Restored content snapshot from ${targetRevision.timestamp}`, 'admin');

  return res.json({ success: true, message: 'Revision restored successfully' });
});

// 5. Media Upload & Management
apiRouter.post('/admin/media/upload', requireAuth, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  let fileUrl = `/uploads/${file.filename}`;

  // For serverless deployments (Vercel), convert reasonable-sized images into base64 data URIs
  // so uploaded media persists permanently even after serverless container recycling
  if (file.mimetype.startsWith('image/') && file.size < 5 * 1024 * 1024) {
    try {
      const buffer = fs.readFileSync(file.path);
      fileUrl = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    } catch (e) {
      console.warn('Could not encode image buffer:', e);
    }
  }

  const mediaItem = {
    id: `media-${Date.now()}`,
    filename: file.filename,
    originalName: file.originalname,
    url: fileUrl,
    altText: req.body.altText || file.originalname,
    caption: req.body.caption || '',
    fileSize: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString()
  };

  const cms = readCMSData();
  cms.media = [mediaItem, ...(cms.media || [])];
  writeCMSData(cms);

  appendAuditLog('media_uploaded', `Uploaded file: ${file.originalname}`, 'admin');

  return res.json({
    success: true,
    media: mediaItem
  });
});

apiRouter.delete('/admin/media/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const cms = readCMSData();
  const targetIndex = (cms.media || []).findIndex(m => m.id === id);

  if (targetIndex === -1) {
    return res.status(404).json({ error: 'Media not found' });
  }

  const [removed] = cms.media.splice(targetIndex, 1);

  // If local file in uploads dir, delete from disk
  const filePath = path.join(UPLOADS_DIR, removed.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Could not delete file from disk:', e);
    }
  }

  writeCMSData(cms);
  appendAuditLog('media_deleted', `Deleted media: ${removed.originalName || removed.filename}`, 'admin');

  return res.json({ success: true, message: 'Media removed successfully' });
});

// 6. Clear Audit Logs
apiRouter.post('/admin/audit/clear', requireAuth, (_req: Request, res: Response) => {
  const cms = readCMSData();
  cms.auditLogs = [
    {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'logs_cleared',
      details: 'Admin audit logs cleared',
      user: 'admin'
    }
  ];
  writeCMSData(cms);
  return res.json({ success: true });
});

// 7. Mount Router
// Mount with /api prefix for standard routing
app.use('/api', apiRouter);
// Also mount directly on app to handle trimmed serverless routes seamlessly
app.use(apiRouter);

// ----------------------------------------------------
// Express & Vite Middleware Integration
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    // Development mode: Vite middleware
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
    // Production mode: Serve dist files
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

// In local development or standalone production server, start HTTP listener.
// In Vercel serverless environment, Vercel exports and manages the HTTP listener directly.
if (!isVercel) {
  startServer();
}

export default app;
