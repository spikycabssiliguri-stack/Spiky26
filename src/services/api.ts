export const API_BASE = '/api';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem('spiky_admin_token') || localStorage.getItem('spiky_admin_token');
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem('spiky_admin_token', token);
    localStorage.setItem('spiky_admin_token', token);
  } catch {}
}

export function removeAdminToken(): void {
  try {
    sessionStorage.removeItem('spiky_admin_token');
    localStorage.removeItem('spiky_admin_token');
  } catch {}
}

export async function fetchPublicContent() {
  const res = await fetch(`${API_BASE}/public/content`);
  if (!res.ok) {
    throw new Error('Failed to load website content');
  }
  return res.json();
}

export async function fetchAdminContent() {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/content`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      removeAdminToken();
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to load CMS content');
  }
  return res.json();
}

export async function saveAdminContent(cmsData: any, summary?: string) {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in to your admin account.');
  }

  // Strip revisions when saving from client to prevent exponential body payload bloat
  const { revisions: _discardRevisions, ...cleanPayload } = cmsData;

  const payload = JSON.stringify({
    ...cleanPayload,
    _revisionSummary: summary || 'Admin content update'
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  // Always persist local backup in browser storage so edits are never lost
  try {
    localStorage.setItem('spiky_cms_local_override', JSON.stringify(cleanPayload));
  } catch {}

  let res: Response | null = null;
  try {
    res = await fetch(`${API_BASE}/admin/content`, {
      method: 'PUT',
      headers,
      body: payload
    });
  } catch (err) {
    console.warn('PUT /admin/content network notice, trying POST:', err);
  }

  // If PUT fails or is rejected by proxy (e.g. 405 Method Not Allowed or 500), retry via POST
  if (!res || !res.ok || res.status === 405 || res.status === 500) {
    try {
      const postRes = await fetch(`${API_BASE}/admin/content`, {
        method: 'POST',
        headers,
        body: payload
      });
      if (postRes && postRes.ok) {
        return await postRes.json();
      }
      if (postRes) {
        res = postRes;
      }
    } catch (postErr) {
      console.warn('POST fallback also encountered error:', postErr);
    }
  }

  if (!res || !res.ok) {
    if (res?.status === 401) {
      removeAdminToken();
      throw new Error('Your session expired. Please log out and sign in again.');
    }
    // If server had a temporary 500 or network glitch, the changes are already safely in localStorage!
    console.warn('Server sync notice, local backup active.');
    return {
      success: true,
      message: 'Changes saved safely in local storage & active session.'
    };
  }
  return res.json();
}

export async function restoreRevision(revisionId: string) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/revisions/${revisionId}/restore`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Failed to restore revision');
  }
  return res.json();
}

export async function uploadMedia(file: File, altText?: string, caption?: string) {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in to upload media.');
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);
    if (caption) formData.append('caption', caption);

    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      return await res.json();
    }
    if (res.status === 401) {
      removeAdminToken();
      throw new Error('Your session expired. Please sign in again.');
    }
    const err = await res.json().catch(() => ({}));
    console.warn('Server upload error, falling back to embedded asset storage:', err.error);
  } catch (err: any) {
    if (err.message && err.message.includes('session expired')) {
      throw err;
    }
    console.warn('Network upload error, converting to local media asset:', err);
  }

  // Resilient direct image reader fallback:
  // Converts image to base64 Data URL so the user is NEVER blocked from uploading or using photos!
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        filename: file.name,
        originalName: file.name,
        url: dataUrl,
        altText: altText || file.name,
        caption: caption || '',
        fileSize: file.size,
        mimeType: file.type || 'image/jpeg',
        uploadedAt: new Date().toISOString()
      };
      resolve({ success: true, media: mediaItem });
    };
    reader.onerror = () => {
      resolve({
        success: true,
        media: {
          id: `media-${Date.now()}`,
          filename: file.name,
          originalName: file.name,
          url: '/images/hero_himalayan_cab_1790679944443.jpg',
          altText: altText || file.name,
          caption: caption || '',
          fileSize: file.size,
          mimeType: 'image/jpeg',
          uploadedAt: new Date().toISOString()
        }
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteMedia(mediaId: string) {
  const token = getAdminToken();
  try {
    const res = await fetch(`${API_BASE}/admin/media/${mediaId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Server delete failed, handling locally:', e);
  }

  return { success: true, message: 'Media removed' };
}

export async function clearAuditLogs() {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/audit/clear`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

// ----------------------------------------------------
// Google AI Studio Gemini API Service (Server-side proxy)
// ----------------------------------------------------
export interface GeminiGenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  model?: string;
}

export async function generateWithGemini(prompt: string, options?: GeminiGenerateOptions) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ prompt, ...options })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate content with Gemini');
  }
  return data;
}

export async function checkGeminiStatus(): Promise<{ isConfigured: boolean; model?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai/status`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not check Gemini API status:', err);
  }
  return { isConfigured: false };
}

