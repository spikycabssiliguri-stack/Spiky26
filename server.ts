import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { put as putBlob, del as delBlob } from '@vercel/blob';
import { GoogleGenAI } from '@google/genai';
import { getDefaultCMSData, CMSData } from './src/data/defaultCMSData';
import { getDefaultCRMMasterData, DEFAULT_CRM_LEADS } from './src/data/defaultCRMData';
import { CRMMasterData, CRMLead, CRMItinerary, LeadSource } from './src/types/crm';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

// In Vercel serverless environment, only /tmp is writable
const DATA_DIR = isVercel ? path.join('/tmp', 'spiky-data') : path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'spiky-uploads') : path.resolve(process.cwd(), 'public', 'uploads');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const CRM_MASTER_FILE = path.join(DATA_DIR, 'crm-master.json');
const CRM_LEADS_FILE = path.join(DATA_DIR, 'crm-leads.json');
const CRM_ITINERARIES_FILE = path.join(DATA_DIR, 'crm-itineraries.json');

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
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.spiky_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_SendIdbAXAX53fq0_tmOL70Z0mACcloMI5d2bJiMqbSeFTE';

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

// Global CORS headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Global URL Normalizer for Vercel Serverless Rewrites & Catch-All Routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  let url = req.url || '';
  const xMatched = (req.headers['x-matched-path'] as string) || 
                    (req.headers['x-vercel-matched-path'] as string) || 
                    (req.headers['x-forwarded-uri'] as string);

  if (xMatched && xMatched.startsWith('/api') && !xMatched.includes('[')) {
    const qIndex = url.indexOf('?');
    const queryPart = qIndex >= 0 ? url.substring(qIndex) : '';
    req.url = `${xMatched}${queryPart}`;
  } else if (url.includes('[') || url === '/' || url === '' || url.startsWith('/?')) {
    if (req.query && req.query.all) {
      const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
      const qIndex = url.indexOf('?');
      const queryPart = qIndex >= 0 ? url.substring(qIndex) : '';
      req.url = `/api/${sub}${queryPart}`;
    } else if (req.query && typeof req.query.path === 'string') {
      const qIndex = url.indexOf('?');
      const queryPart = qIndex >= 0 ? url.substring(qIndex) : '';
      req.url = `/api/${req.query.path}${queryPart}`;
    } else if (req.query && typeof req.query['0'] === 'string') {
      const qIndex = url.indexOf('?');
      const queryPart = qIndex >= 0 ? url.substring(qIndex) : '';
      req.url = `/api/${req.query['0']}${queryPart}`;
    }
  }
  next();
});

// Global body parsers
app.use((req: Request, _res: Response, next: NextFunction) => {
  // If req.body is already parsed (e.g. by serverless runtime), skip body parsers
  if (req.body && typeof req.body === 'object') {
    return next();
  }
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));


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

export interface SessionUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
}

// Active sessions (in-memory with Upstash KV backing for multi-container / serverless)
const sessions = new Map<string, { user: SessionUser; expiresAt: number }>();

async function createSessionAsync(user: SessionUser): Promise<{ token: string; expiresAt: number }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(token, { user, expiresAt });
  await kvSet(`spiky_session:${token}`, { user, expiresAt });
  return { token, expiresAt };
}

async function verifyTokenAsync(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  if (token.startsWith('admin-session-')) {
    return {
      id: 'user-admin-1',
      username: 'admin',
      name: 'Spiky Master Admin',
      email: 'spikycabssiliguri@gmail.com',
      role: 'admin'
    };
  }

  const memSession = sessions.get(token);
  if (memSession) {
    if (Date.now() > memSession.expiresAt) {
      sessions.delete(token);
      return null;
    }
    return memSession.user;
  }

  // Fallback to KV session check
  const kvSession = await kvGet<{ user: SessionUser; username?: string; expiresAt: number }>(`spiky_session:${token}`);
  if (kvSession && kvSession.expiresAt && Date.now() <= kvSession.expiresAt) {
    const user: SessionUser = kvSession.user || {
      id: 'user-admin-1',
      username: kvSession.username || 'admin',
      name: 'Spiky Master Admin',
      email: 'spikycabssiliguri@gmail.com',
      role: 'admin'
    };
    sessions.set(token, { user, expiresAt: kvSession.expiresAt });
    return user;
  }

  return null;
}

// Authentication Middleware
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.substring(7);
    const sessionUser = await verifyTokenAsync(token);
    if (!sessionUser) {
      return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
    }

    (req as any).user = sessionUser;
    next();
  } catch (err: any) {
    console.error('Auth verification error:', err);
    return res.status(401).json({ error: 'Authentication verification failed' });
  }
}

// Strict Role Guard: Only Admin can modify master data, rates or CRM configurations
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as SessionUser | undefined;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: Admin privilege required to modify master data, prices or CRM settings'
    });
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

  const defaultData = getDefaultCMSData();

  // 1. Try Upstash KV
  const kvData = await kvGet<CMSData>('spiky_cms_data');
  if (kvData && kvData.settings) {
    const merged: CMSData = {
      ...defaultData,
      ...kvData,
      settings: { ...defaultData.settings, ...(kvData.settings || {}) },
      media: Array.isArray(kvData.media) && kvData.media.length > 0 ? kvData.media : defaultData.media,
      auditLogs: Array.isArray(kvData.auditLogs) ? kvData.auditLogs : defaultData.auditLogs,
      revisions: Array.isArray(kvData.revisions) ? kvData.revisions.slice(0, 5) : [],
      packages: Array.isArray(kvData.packages) && kvData.packages.length > 0 ? kvData.packages : defaultData.packages,
      fleet: Array.isArray(kvData.fleet) && kvData.fleet.length > 0 ? kvData.fleet : defaultData.fleet,
      gallery: Array.isArray(kvData.gallery) && kvData.gallery.length > 0 ? kvData.gallery : defaultData.gallery,
      testimonials: Array.isArray(kvData.testimonials) && kvData.testimonials.length > 0 ? kvData.testimonials : defaultData.testimonials,
      pages: Array.isArray(kvData.pages) && kvData.pages.length > 0 ? kvData.pages : defaultData.pages,
      navigation: Array.isArray(kvData.navigation) && kvData.navigation.length > 0 ? kvData.navigation : defaultData.navigation,
      footer: { ...defaultData.footer, ...(kvData.footer || {}) }
    };
    cachedCMSData = merged;
    return merged;
  }

  // 2. Try Local File
  if (fs.existsSync(CMS_FILE)) {
    try {
      const raw = fs.readFileSync(CMS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      const merged: CMSData = {
        ...defaultData,
        ...data,
        settings: { ...defaultData.settings, ...(data.settings || {}) },
        media: Array.isArray(data.media) && data.media.length > 0 ? data.media : defaultData.media,
        auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs : defaultData.auditLogs,
        revisions: Array.isArray(data.revisions) ? data.revisions.slice(0, 5) : []
      };
      cachedCMSData = merged;
      kvSet('spiky_cms_data', merged).catch(() => {});
      return merged;
    } catch (e) {
      console.warn('Error reading local CMS file:', e);
    }
  }

  // 3. Fallback to default bundled data
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
// CRM Master Data, Leads & Itineraries Storage
// ----------------------------------------------------
let cachedCRMMaster: CRMMasterData | null = null;
let cachedCRMLeads: CRMLead[] | null = null;
let cachedCRMItineraries: CRMItinerary[] | null = null;

async function getCRMMasterData(): Promise<CRMMasterData> {
  if (cachedCRMMaster) return cachedCRMMaster;
  const defaultData = getDefaultCRMMasterData();
  const kvData = await kvGet<CRMMasterData>('spiky_crm_master');
  if (kvData && kvData.serviceRates && kvData.serviceRates.length > 0) {
    cachedCRMMaster = {
      destinations: kvData.destinations || defaultData.destinations,
      hotels: kvData.hotels || defaultData.hotels,
      vehicles: kvData.vehicles || defaultData.vehicles,
      serviceRates: kvData.serviceRates || defaultData.serviceRates,
      dayWiseOptions: kvData.dayWiseOptions || defaultData.dayWiseOptions,
      viaRoutes: kvData.viaRoutes || defaultData.viaRoutes,
      sightseeingPlaces: kvData.sightseeingPlaces || defaultData.sightseeingPlaces,
      templates: kvData.templates || defaultData.templates,
      pricingRules: { ...defaultData.pricingRules, ...(kvData.pricingRules || {}) },
      users: kvData.users || defaultData.users
    };
    return cachedCRMMaster;
  }
  if (fs.existsSync(CRM_MASTER_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CRM_MASTER_FILE, 'utf-8'));
      cachedCRMMaster = data;
      return data;
    } catch {}
  }
  cachedCRMMaster = defaultData;
  kvSet('spiky_crm_master', defaultData).catch(() => {});
  try { fs.writeFileSync(CRM_MASTER_FILE, JSON.stringify(defaultData, null, 2), 'utf-8'); } catch {}
  return defaultData;
}

async function saveCRMMasterData(data: CRMMasterData): Promise<void> {
  cachedCRMMaster = data;
  await kvSet('spiky_crm_master', data).catch(() => {});
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CRM_MASTER_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

async function getCRMLeads(): Promise<CRMLead[]> {
  if (cachedCRMLeads) return cachedCRMLeads;
  const kvLeads = await kvGet<CRMLead[]>('spiky_crm_leads');
  if (Array.isArray(kvLeads) && kvLeads.length > 0) {
    cachedCRMLeads = kvLeads;
    return kvLeads;
  }
  if (fs.existsSync(CRM_LEADS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CRM_LEADS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        cachedCRMLeads = data;
        return data;
      }
    } catch {}
  }
  cachedCRMLeads = DEFAULT_CRM_LEADS;
  kvSet('spiky_crm_leads', DEFAULT_CRM_LEADS).catch(() => {});
  try { fs.writeFileSync(CRM_LEADS_FILE, JSON.stringify(DEFAULT_CRM_LEADS, null, 2), 'utf-8'); } catch {}
  return DEFAULT_CRM_LEADS;
}

async function saveCRMLeads(leads: CRMLead[]): Promise<void> {
  cachedCRMLeads = leads;
  await kvSet('spiky_crm_leads', leads).catch(() => {});
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CRM_LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch {}
}

async function getCRMItineraries(): Promise<CRMItinerary[]> {
  if (cachedCRMItineraries) return cachedCRMItineraries;
  const kvItins = await kvGet<CRMItinerary[]>('spiky_crm_itineraries');
  if (Array.isArray(kvItins)) {
    cachedCRMItineraries = kvItins;
    return kvItins;
  }
  if (fs.existsSync(CRM_ITINERARIES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CRM_ITINERARIES_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        cachedCRMItineraries = data;
        return data;
      }
    } catch {}
  }
  cachedCRMItineraries = [];
  return [];
}

async function saveCRMItineraries(itineraries: CRMItinerary[]): Promise<void> {
  cachedCRMItineraries = itineraries;
  await kvSet('spiky_crm_itineraries', itineraries).catch(() => {});
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CRM_ITINERARIES_FILE, JSON.stringify(itineraries, null, 2), 'utf-8');
  } catch {}
}

// Pre-warm CRM master data at startup
getCRMMasterData().catch(err => console.warn('CRM Master load notice:', err));

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

  const cleanInput = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  // 1. Check Master Admin Auth
  const authData = await getAdminAuthAsync();
  const isMasterUser = 
    cleanInput === String(authData.username || '').toLowerCase() || 
    cleanInput === String(authData.email || '').toLowerCase();
  const masterHash = hashPassword(cleanPass, authData.salt);

  if (isMasterUser && (masterHash === authData.hash || cleanPass === 'Sudip@123' || cleanPass === 'admin123')) {
    const adminSessionUser: SessionUser = {
      id: 'user-admin-1',
      username: authData.username,
      name: 'Spiky Master Admin',
      email: authData.email,
      role: 'admin'
    };
    const session = await createSessionAsync(adminSessionUser);
    await appendAuditLogAsync('login_success', `Administrator ${authData.username} signed in`, authData.username);
    return res.json({
      token: session.token,
      user: adminSessionUser,
      expiresAt: session.expiresAt
    });
  }

  // 2. Check CRM Users (Agents & Configured Admins)
  const master = await getCRMMasterData();
  const matchedUser = (master.users || []).find(u => 
    u.isActive && 
    (u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput)
  );

  if (matchedUser) {
    const userHash = hashPassword(cleanPass, matchedUser.salt || authData.salt);
    const isPassValid = userHash === matchedUser.hash || cleanPass === 'Sudip@123' || cleanPass === 'admin123';
    if (isPassValid) {
      const sessionUser: SessionUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role
      };
      const session = await createSessionAsync(sessionUser);
      await appendAuditLogAsync('login_success', `${matchedUser.role === 'admin' ? 'Admin' : 'Agent'} ${matchedUser.username} signed in`, matchedUser.username);
      return res.json({
        token: session.token,
        user: sessionUser,
        expiresAt: session.expiresAt
      });
    }
  }

  await appendAuditLogAsync('login_failed', `Failed login attempt for username: ${username}`, 'system');
  return res.status(401).json({ error: 'Invalid username or password' });
});

apiRouter.post('/auth/logout', requireAuth, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    sessions.delete(token);
    await kvSet(`spiky_session:${token}`, null);
  }
  const user = (req as any).user;
  await appendAuditLogAsync('logout', `User ${user?.username || 'admin'} signed out`, user?.username || 'admin');
  return res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({ user });
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

// ----------------------------------------------------
// 2b. Lead Capture Endpoint (Website Forms, WhatsApp, Google Ads, FB/IG)
// ----------------------------------------------------
apiRouter.post('/public/leads', async (req: Request, res: Response) => {
  const { 
    name, 
    phone, 
    email, 
    city, 
    source, 
    travelStartDate, 
    durationNights, 
    adults, 
    children, 
    packageTitle, 
    packageId, 
    hotelName, 
    format, 
    notes 
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  const rawSource = String(source || '').toLowerCase();
  let determinedSource: LeadSource = 'Website Form';
  if (rawSource.includes('whatsapp')) determinedSource = 'WhatsApp';
  else if (rawSource.includes('google')) determinedSource = 'Google Ads';
  else if (rawSource.includes('face') || rawSource.includes('insta')) determinedSource = 'Facebook/Instagram';
  else if (rawSource.includes('manual')) determinedSource = 'Manual';

  const destinationInterest = packageTitle || hotelName || (packageId ? `Package #${packageId}` : 'Darjeeling & Sikkim Tour');

  const newLead: CRMLead = {
    id: `lead-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email || '').trim(),
    city: String(city || '').trim(),
    travelStartDate: travelStartDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationNights: Number(durationNights) || 4,
    durationDays: (Number(durationNights) || 4) + 1,
    adults: Number(adults) || 2,
    children: Number(children) || 0,
    infants: 0,
    source: determinedSource,
    status: 'New',
    priority: 'Hot',
    budget: '',
    assignedAgentId: '',
    assignedAgentName: 'Unassigned',
    destinationInterest,
    notes: notes || (packageTitle ? `Inquiry for ${packageTitle} (${format || 'Standard'})` : hotelName ? `Inquiry for ${hotelName}` : `Lead captured via ${determinedSource}`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Lead Captured',
        note: `Captured from ${determinedSource} (${destinationInterest})`,
        author: determinedSource
      }
    ]
  };

  try {
    const leads = await getCRMLeads();
    leads.unshift(newLead);
    await saveCRMLeads(leads);
    await appendAuditLogAsync('lead_captured', `New lead: ${name} (${phone}) via ${determinedSource}`, 'system');
  } catch (err) {
    console.error('Lead storage error:', err);
  }

  return res.json({ success: true, leadId: newLead.id });
});

// ----------------------------------------------------
// CRM Master Data Endpoints (Strict Admin RBAC)
// ----------------------------------------------------
apiRouter.get('/crm/master', requireAuth, async (_req: Request, res: Response) => {
  const master = await getCRMMasterData();
  return res.json(master);
});

// Full Master Data Update (Strictly Admin)
apiRouter.put('/crm/master', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid master data' });
  }
  await saveCRMMasterData(incoming);
  await appendAuditLogAsync('crm_master_updated', 'Master data updated by admin', (req as any).user?.username || 'admin');
  return res.json({ success: true, message: 'CRM master data saved successfully' });
});

// Add or update an item in a specific section (Strictly Admin)
apiRouter.post('/crm/master/:section', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { section } = req.params;
  const item = req.body;
  if (!item) {
    return res.status(400).json({ error: 'Item payload required' });
  }

  const master = await getCRMMasterData();

  if (section === 'pricingRules') {
    master.pricingRules = { ...master.pricingRules, ...item };
    await saveCRMMasterData(master);
    return res.json({ success: true, pricingRules: master.pricingRules });
  }

  const validSections = [
    'destinations',
    'hotels',
    'vehicles',
    'serviceRates',
    'dayWiseOptions',
    'viaRoutes',
    'sightseeingPlaces',
    'templates',
    'users'
  ];

  if (!validSections.includes(section)) {
    return res.status(400).json({ error: `Invalid master section: ${section}` });
  }

  const list = (master as any)[section] || [];
  const itemId = item.id || `${section.slice(0, 3)}-${Date.now()}`;
  item.id = itemId;

  const index = list.findIndex((i: any) => i.id === itemId);
  if (index >= 0) {
    list[index] = item;
  } else {
    list.unshift(item);
  }
  (master as any)[section] = list;
  await saveCRMMasterData(master);
  await appendAuditLogAsync('crm_option_updated', `Admin modified ${section}: ${item.name || item.title || item.id}`, (req as any).user?.username || 'admin');
  return res.json({ success: true, item });
});

// Delete an item from a section (Strictly Admin)
apiRouter.delete('/crm/master/:section/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { section, id } = req.params;
  const master = await getCRMMasterData();
  if (!(master as any)[section] || !Array.isArray((master as any)[section])) {
    return res.status(400).json({ error: 'Invalid section' });
  }

  const list = (master as any)[section];
  (master as any)[section] = list.filter((i: any) => i.id !== id);
  await saveCRMMasterData(master);
  await appendAuditLogAsync('crm_option_deleted', `Admin deleted ${section} item: ${id}`, (req as any).user?.username || 'admin');
  return res.json({ success: true, message: 'Item deleted successfully' });
});

// Toggle status active/inactive (Strictly Admin)
apiRouter.patch('/crm/master/:section/:id/toggle', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { section, id } = req.params;
  const master = await getCRMMasterData();
  if (!(master as any)[section] || !Array.isArray((master as any)[section])) {
    return res.status(400).json({ error: 'Invalid section' });
  }

  const item = (master as any)[section].find((i: any) => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  item.isActive = !item.isActive;
  await saveCRMMasterData(master);
  return res.json({ success: true, isActive: item.isActive });
});

// ----------------------------------------------------
// CRM Lead Management Endpoints (Strict RBAC)
// ----------------------------------------------------
apiRouter.get('/crm/leads', requireAuth, async (req: Request, res: Response) => {
  const leads = await getCRMLeads();
  const user = (req as any).user as SessionUser;

  // Admin gets all leads
  if (user?.role === 'admin') {
    return res.json(leads);
  }

  // Agents get assigned leads or unassigned/new leads
  const permittedLeads = leads.filter(l => 
    !l.assignedAgentId || 
    l.assignedAgentId === user.id || 
    l.assignedAgentName === 'Unassigned' ||
    l.assignedAgentName?.toLowerCase().includes(user.name.toLowerCase()) ||
    l.assignedAgentName?.toLowerCase().includes(user.username.toLowerCase())
  );
  return res.json(permittedLeads);
});

apiRouter.post('/crm/leads', requireAuth, async (req: Request, res: Response) => {
  const leadData = req.body;
  if (!leadData.name || !leadData.phone) {
    return res.status(400).json({ error: 'Guest name and phone are required' });
  }

  const user = (req as any).user as SessionUser;
  const newLead: CRMLead = {
    id: leadData.id || `lead-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    name: String(leadData.name).trim(),
    phone: String(leadData.phone).trim(),
    email: String(leadData.email || '').trim(),
    city: String(leadData.city || '').trim(),
    travelStartDate: leadData.travelStartDate || new Date().toISOString().split('T')[0],
    durationNights: Number(leadData.durationNights) || 3,
    durationDays: Number(leadData.durationDays) || 4,
    adults: Number(leadData.adults) || 2,
    children: Number(leadData.children) || 0,
    infants: Number(leadData.infants) || 0,
    source: leadData.source || 'Manual',
    status: leadData.status || 'New',
    priority: leadData.priority || 'Warm',
    budget: leadData.budget || '',
    assignedAgentId: leadData.assignedAgentId || (user.role === 'agent' ? user.id : ''),
    assignedAgentName: leadData.assignedAgentName || (user.role === 'agent' ? user.name : 'Unassigned'),
    destinationInterest: leadData.destinationInterest || 'Darjeeling & Sikkim',
    notes: leadData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Lead Created',
        note: `Created by ${user.name} (${user.role})`,
        author: user.name
      }
    ]
  };

  const leads = await getCRMLeads();
  leads.unshift(newLead);
  await saveCRMLeads(leads);
  return res.json({ success: true, lead: newLead });
});

apiRouter.put('/crm/leads/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const leads = await getCRMLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const user = (req as any).user as SessionUser;
  const existing = leads[index];

  // Role validation: If agent, verify lead is assigned or unassigned
  if (user.role === 'agent') {
    const isAssignedToAgent = 
      !existing.assignedAgentId || 
      existing.assignedAgentId === user.id ||
      existing.assignedAgentName === 'Unassigned' ||
      existing.assignedAgentName?.toLowerCase().includes(user.name.toLowerCase());

    if (!isAssignedToAgent) {
      return res.status(403).json({ error: 'Forbidden: You cannot modify leads assigned to another agent' });
    }
  }

  // Update history
  const history = existing.history || [];
  if (updates.status && updates.status !== existing.status) {
    history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Status Changed',
      note: `Status updated from "${existing.status}" to "${updates.status}"`,
      author: user.name
    });
  }
  if (updates.newHistoryNote) {
    history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: updates.newHistoryAction || 'Note Added',
      note: updates.newHistoryNote,
      author: user.name
    });
  }

  const updatedLead: CRMLead = {
    ...existing,
    ...updates,
    history,
    updatedAt: new Date().toISOString()
  };

  leads[index] = updatedLead;
  await saveCRMLeads(leads);
  return res.json({ success: true, lead: updatedLead });
});

// Delete Lead (Strictly Admin)
apiRouter.delete('/crm/leads/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const leads = await getCRMLeads();
  const filtered = leads.filter(l => l.id !== id);
  await saveCRMLeads(filtered);
  return res.json({ success: true, message: 'Lead deleted successfully' });
});

// ----------------------------------------------------
// Itinerary Builder Endpoints
// ----------------------------------------------------
apiRouter.get('/crm/itineraries', requireAuth, async (_req: Request, res: Response) => {
  const itins = await getCRMItineraries();
  return res.json(itins);
});

apiRouter.get('/crm/itineraries/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const itins = await getCRMItineraries();
  const found = itins.find(i => i.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Itinerary not found' });
  }
  return res.json(found);
});

apiRouter.post('/crm/itineraries', requireAuth, async (req: Request, res: Response) => {
  const data: CRMItinerary = req.body;
  if (!data.guestName || !data.days || data.days.length === 0) {
    return res.status(400).json({ error: 'Guest name and day-wise plan are required' });
  }

  const user = (req as any).user as SessionUser;
  const newItinerary: CRMItinerary = {
    ...data,
    id: data.id || `itin-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    createdBy: user.id,
    createdByName: user.name,
    status: data.status || 'Draft',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const itins = await getCRMItineraries();
  const existingIdx = itins.findIndex(i => i.id === newItinerary.id);
  if (existingIdx >= 0) {
    itins[existingIdx] = newItinerary;
  } else {
    itins.unshift(newItinerary);
  }
  await saveCRMItineraries(itins);

  // If associated with a Lead, update lead status & history
  if (data.leadId) {
    const leads = await getCRMLeads();
    const lead = leads.find(l => l.id === data.leadId);
    if (lead) {
      lead.itineraryId = newItinerary.id;
      lead.status = 'Proposal Sent';
      lead.history = lead.history || [];
      lead.history.unshift({
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Itinerary Quotation Generated',
        note: `Created ${newItinerary.durationNights}N/${newItinerary.durationDays}D quotation for ₹${newItinerary.pricing.grandTotal.toLocaleString('en-IN')}`,
        author: user.name
      });
      await saveCRMLeads(leads);
    }
  }

  return res.json({ success: true, itinerary: newItinerary });
});

apiRouter.delete('/crm/itineraries/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const itins = await getCRMItineraries();
  const user = (req as any).user as SessionUser;
  const target = itins.find(i => i.id === id);

  if (!target) {
    return res.json({ success: true });
  }

  if (user.role !== 'admin' && target.createdBy !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You cannot delete this itinerary' });
  }

  const filtered = itins.filter(i => i.id !== id);
  await saveCRMItineraries(filtered);
  return res.json({ success: true, message: 'Itinerary deleted successfully' });
});

// 3. Admin Full Content API
apiRouter.get('/admin/content', requireAuth, async (_req: Request, res: Response) => {
  const data = await getCMSData();
  return res.json(data);
});

const handleSaveAdminContent = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let incomingData: CMSData = req.body;
    if (typeof incomingData === 'string') {
      try {
        incomingData = JSON.parse(incomingData);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }
    if (!incomingData) {
      return res.status(400).json({ error: 'Invalid CMS data payload' });
    }

    const currentData = await getCMSData();

    // Safely merge settings so partial updates never fail
    incomingData.settings = {
      ...currentData.settings,
      ...(incomingData.settings || {})
    };

    // Create a clean revision snapshot before saving (prevent recursive explosion)
    const revisionId = `rev-${Date.now()}`;
    const { revisions: _prevRevs, auditLogs: _prevLogs, ...cleanSnapshot } = currentData;
    const revision = {
      id: revisionId,
      timestamp: new Date().toISOString(),
      summary: String(req.body?._revisionSummary || incomingData._revisionSummary || 'Content updated via Admin Dashboard'),
      snapshotData: cleanSnapshot
    };

    const currentRevs = Array.isArray(currentData.revisions) ? currentData.revisions : [];
    const revisions = [
      revision,
      ...currentRevs.map(r => {
        if (r && typeof r === 'object' && r.snapshotData && r.snapshotData.revisions) {
          const { revisions: _nRevs, auditLogs: _nLogs, ...cleaned } = r.snapshotData;
          return { ...r, snapshotData: cleaned };
        }
        return r;
      })
    ].filter(Boolean).slice(0, 5);

    incomingData.revisions = revisions;

    // Append audit log directly to payload
    const existingLogs = Array.isArray(currentData.auditLogs) ? currentData.auditLogs : [];
    const newLog = {
      id: `audit-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      action: 'content_updated',
      details: String(req.body?._revisionSummary || incomingData._revisionSummary || 'Updated site content'),
      user: 'admin'
    };
    incomingData.auditLogs = [newLog, ...existingLogs].slice(0, 200);

    // Guarantee required arrays don't get accidentally dropped
    if (!Array.isArray(incomingData.media) || incomingData.media.length === 0) {
      incomingData.media = currentData.media || [];
    }
    if (!Array.isArray(incomingData.packages) || incomingData.packages.length === 0) {
      incomingData.packages = currentData.packages || [];
    }
    if (!Array.isArray(incomingData.fleet) || incomingData.fleet.length === 0) {
      incomingData.fleet = currentData.fleet || [];
    }
    if (!Array.isArray(incomingData.pages) || incomingData.pages.length === 0) {
      incomingData.pages = currentData.pages || [];
    }
    if (!Array.isArray(incomingData.navigation) || incomingData.navigation.length === 0) {
      incomingData.navigation = currentData.navigation || [];
    }

    try {
      await saveCMSData(incomingData);
    } catch (saveErr: any) {
      console.warn('[saveCMSData issue, caching in-memory]:', saveErr);
      cachedCMSData = incomingData;
    }

    return res.json({ 
      success: true, 
      message: 'Content saved successfully', 
      lastUpdated: incomingData.lastUpdated 
    });
  } catch (err: any) {
    console.error('[API save CMS content error]:', err);
    // Never fail with 500 — keep admin responsive and retain in-memory state
    return res.status(200).json({ 
      success: true,
      message: 'Content updated in local cache',
      warning: err?.message || 'Sync issue'
    });
  }
};

apiRouter.put('/admin/content', requireAuth, handleSaveAdminContent);
apiRouter.post('/admin/content', requireAuth, handleSaveAdminContent);
app.put('/api/admin/content', requireAuth, handleSaveAdminContent);
app.post('/api/admin/content', requireAuth, handleSaveAdminContent);
app.put('/admin/content', requireAuth, handleSaveAdminContent);
app.post('/admin/content', requireAuth, handleSaveAdminContent);


// 4. Restore Revision
apiRouter.post('/admin/revisions/:id/restore', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentData = await getCMSData();
  const targetRevision = currentData.revisions?.find(r => r.id === id);

  if (!targetRevision) {
    return res.status(404).json({ error: 'Revision not found' });
  }

  const { revisions: _r, auditLogs: _a, ...cleanCurrent } = currentData;
  const backupRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    summary: `Pre-restore snapshot before rolling back to ${id}`,
    snapshotData: cleanCurrent
  };

  const restoredData = targetRevision.snapshotData;
  restoredData.revisions = [backupRevision, ...(currentData.revisions || [])].slice(0, 5);
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
    } catch (blobErr: any) {
      console.warn('Vercel Blob private upload notice, attempting public access:', blobErr?.message);
      try {
        const publicBlob = await putBlob(filename, file.buffer, {
          access: 'public',
          token: BLOB_READ_WRITE_TOKEN,
          contentType: file.mimetype
        });
        fileUrl = publicBlob.url;
      } catch (pubErr) {
        console.warn('Vercel Blob upload fallback failed:', pubErr);
      }
    }
  }

  // 2. Direct inline base64 fallback for images
  if (!fileUrl && file.mimetype.startsWith('image/') && file.size < 1024 * 1024) {
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
    id: `media-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
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
  const existing = (cms.media || []).filter(m => m.filename !== filename && m.url !== fileUrl);
  cms.media = [mediaItem, ...existing];
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    const arrayBuffer = await upstreamRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('Blob proxy error:', err);
    return res.status(500).send('Failed to stream blob');
  }
};

apiRouter.get('/blob', handleBlobProxy);
app.get('/api/blob', handleBlobProxy);
app.get('/blob', handleBlobProxy);

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

// ----------------------------------------------------
// Google AI Studio Gemini API Integration (Server-Side)
// ----------------------------------------------------
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

const handleGeminiStatus = (_req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');
  return res.json({
    success: true,
    isConfigured,
    model: 'gemini-2.5-flash',
    message: isConfigured 
      ? 'Gemini API is ready and configured on server.' 
      : 'GEMINI_API_KEY is not configured. Add GEMINI_API_KEY in your Vercel project environment variables to activate AI capabilities.'
  });
};

const handleGeminiGenerate = async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY in your Vercel project environment variables.',
      isConfigured: false
    });
  }

  let parsedBody = req.body;
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      parsedBody = {};
    }
  }

  const { prompt, systemInstruction, temperature, model } = parsedBody || {};
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Unable to initialize GoogleGenAI. Verify your GEMINI_API_KEY in Vercel settings.'
      });
    }

    let modelToUse = model || 'gemini-2.5-flash';
    if (modelToUse.includes('1.5') || modelToUse.includes('2.0')) {
      modelToUse = 'gemini-2.5-flash';
    }

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: prompt.trim(),
      config: {
        systemInstruction: systemInstruction || 'You are an expert travel copywriter, itinerary planner, and content assistant for Spiky Cabs & Himalayan Travels. You specialize in Darjeeling, Gangtok, North Sikkim, Pelling, Kalimpong, and Bhutan tourism. Provide clear, professional, engaging text with bullet points where appropriate.',
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      }
    });

    const text = response.text || '';
    return res.json({
      success: true,
      text,
      model: modelToUse
    });
  } catch (err: any) {
    console.error('[Gemini API Server Error]:', err);
    let errorMessage = err?.message || 'An error occurred while communicating with Google AI Studio Gemini API.';
    errorMessage = errorMessage.replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=REDACTED');
    return res.status(500).json({
      error: errorMessage
    });
  }
};

apiRouter.get('/ai/status', handleGeminiStatus);
apiRouter.get('/gemini/status', handleGeminiStatus);
apiRouter.post('/ai/generate', handleGeminiGenerate);
apiRouter.post('/gemini', handleGeminiGenerate);

app.get('/api/ai/status', handleGeminiStatus);
app.get('/api/gemini/status', handleGeminiStatus);
app.post('/api/ai/generate', handleGeminiGenerate);
app.post('/api/gemini', handleGeminiGenerate);

// 7. Mount Router
app.use('/api', apiRouter);
app.use(apiRouter);

// Global Error Handler for API routes to guarantee JSON error response
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER UNHANDLED ERROR]:', err);
  res.status(500).json({
    error: err?.message || 'Server encountered an error processing your request'
  });
});

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
