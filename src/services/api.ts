export const API_BASE = '/api';

export function getAdminToken(): string | null {
  return sessionStorage.getItem('spiky_admin_token');
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem('spiky_admin_token', token);
}

export function removeAdminToken(): void {
  sessionStorage.removeItem('spiky_admin_token');
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
  const res = await fetch(`${API_BASE}/admin/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...cmsData,
      _revisionSummary: summary || 'Admin content update'
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save changes');
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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }

  return res.json();
}

export async function deleteMedia(mediaId: string) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/media/${mediaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to delete media');
  }

  return res.json();
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
