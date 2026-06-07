const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ═══════════════════════ BASE REQUEST ═══════════════════════

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

// ═══════════════════════ AUTH ═══════════════════════

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return res.json();
}

export async function getMe() {
  const res = await apiRequest('/auth/me');
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json();
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

export function isLoggedIn() {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
}

// ═══════════════════════ PROJECTS ═══════════════════════

export async function getProjects() {
  const res = await apiRequest('/projects/');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(name: string, roomType: string) {
  const res = await apiRequest('/projects/', {
    method: 'POST',
    body: JSON.stringify({ name, room_type: roomType }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

// ═══════════════════════ DESIGNS ═══════════════════════

export async function createDesign(projectId: number, imageUrl: string, style: string, roomType: string, mode: string, prompt: string) {
  const res = await apiRequest('/designs/', {
    method: 'POST',
    body: JSON.stringify({
      project_id: projectId,
      original_image_url: imageUrl,
      style,
      room_type: roomType,
      mode,
      prompt,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create design');
  }
  return res.json();
}

export async function getDesignStatus(designId: number) {
  const res = await apiRequest(`/designs/${designId}`);
  if (!res.ok) {
    throw new Error('Failed to get design status');
  }
  return res.json();
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiRequest('/designs/upload-image', {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(300000),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Image upload failed');
  }

  return res.json();
}

export async function uploadMask(maskDataUrl: string) {
  const formData = new FormData();
  formData.append('mask_data', maskDataUrl);

  const res = await apiRequest('/designs/upload-mask', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Mask upload failed');
  }

  return res.json();
}

// ═══════════════════════ SAVE / FAVORITE ═══════════════════════

export async function updateDesign(designId: number, update: { is_favorite?: boolean; is_public?: boolean }) {
  const res = await apiRequest(`/designs/${designId}`, {
    method: 'PATCH',
    body: JSON.stringify(update),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update design');
  }
  return res.json();
}

export async function deleteDesign(designId: number) {
  const res = await apiRequest(`/designs/${designId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete design');
  }
  return res.json();
}

// ═══════════════════════ GALLERY ═══════════════════════

export async function getMyGallery(favoritesOnly = false, limit = 50, offset = 0) {
  const params = new URLSearchParams();
  if (favoritesOnly) params.set('favorites_only', 'true');
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());

  const res = await apiRequest(`/designs/gallery/my?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}

// ═══════════════════════ SHARE ═══════════════════════

export async function getSharedDesign(shareToken: string) {
  const res = await fetch(`${API_URL}/designs/share/${shareToken}`);
  if (!res.ok) {
    throw new Error('Shared design not found');
  }
  return res.json();
}

export function getShareUrl(shareToken: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://designai.studio';
  return `${baseUrl}/share/${shareToken}`;
}

// ═══════════════════════ DOWNLOAD ═══════════════════════

export async function downloadDesign(designId: number, styleName: string): Promise<void> {
  try {
    const res = await apiRequest(`/designs/${designId}/download`);
    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `designai-${styleName.toLowerCase().replace(/\s+/g, '-')}-${designId}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: direct download from URL
    const design = await getDesignStatus(designId);
    if (design.generated_image_url) {
      const a = document.createElement('a');
      a.href = design.generated_image_url;
      a.download = `designai-${styleName.toLowerCase().replace(/\s+/g, '-')}-${designId}.jpg`;
      a.target = '_blank';
      a.click();
    }
  }
}

// ═══════════════════════ PAYMENTS ═══════════════════════

export async function createCheckoutSession(priceId: string, planName: string) {
  const res = await apiRequest('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ price_id: priceId, plan_name: planName }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create checkout session');
  }
  return res.json();
}

export async function createCustomerPortal() {
  const res = await apiRequest('/payments/create-customer-portal', {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create portal session');
  }
  return res.json();
}

export async function getSubscription() {
  const res = await apiRequest('/payments/subscription');
  if (!res.ok) {
    throw new Error('Failed to fetch subscription');
  }
  return res.json();
}

// ═══════════════════════ ACCOUNT ═══════════════════════

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/account/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to request password reset');
  }
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_URL}/account/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to reset password');
  }
  return res.json();
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_URL}/account/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to verify email');
  }
  return res.json();
}

// ═══════════════════════ AI STATUS ═══════════════════════

export async function getAIStatus(): Promise<{
  engine: string;
  token_configured: boolean;
  token_format_valid: boolean;
  token_verified?: boolean;
  primary_model: string;
  fallback_model: string;
  styles_available: number;
  room_types_available: number;
  account?: string;
  token_error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/ai-status`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  } catch {
    return {
      engine: 'offline',
      token_configured: false,
      token_format_valid: false,
      primary_model: 'unknown',
      fallback_model: 'unknown',
      styles_available: 0,
      room_types_available: 0,
    };
  }
}

// ═══════════════════════ DEMO GENERATE (gpt-image-2) ═══════════════════════

export async function demoGenerate(file: File, style: string, roomType: string, customPrompt: string = ""): Promise<{
  original_url: string;
  generated_url: string;
  style: string;
  room_type: string;
  analysis: Record<string, any>;
  validation: Record<string, any>;
  prompt_used: string;
  engine: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('style', style);
  formData.append('room_type', roomType);
  formData.append('custom_prompt', customPrompt);

  const res = await fetch(`${API_URL}/designs/demo-generate`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Demo generation failed');
  }
  return res.json();
}

export async function getStylePresets(): Promise<{
  styles: Record<string, any>;
  count: number;
}> {
  const res = await fetch(`${API_URL}/styles`);
  if (!res.ok) throw new Error('Failed to fetch styles');
  return res.json();
}

// ═══════════════════════ GPT-5.2 Vision Planner & PDF Export ═══════════════════════

export async function planRoom(
  file: File,
  style: string,
  roomType: string,
  customPrompt: string = ""
): Promise<{
  room_id: string;
  room_type: string;
  style: string;
  original_image_url: string;
  design_plan: string;
  analysis: Record<string, any>;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('style', style);
  formData.append('room_type', roomType);
  formData.append('custom_prompt', customPrompt);

  const res = await fetch(`${API_URL}/rooms/plan`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Room planning failed');
  }
  return res.json();
}

export function getRoomPlanPdfUrl(roomId: string): string {
  return `${API_URL}/rooms/${roomId}/pdf-plan`;
}
