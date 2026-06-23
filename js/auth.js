// ============================================================
// 认证管理 — 登录 / Token / fetchWithAuth
// ============================================================

// Worker URL — 部署后替换为实际域名
const WORKER_URL = 'https://hualianhistory-reports.chewyenhan.workers.dev';

// Token 存储在 sessionStorage（关闭标签页即清除）
function getToken() {
  return sessionStorage.getItem('report_token');
}
function setToken(token) {
  sessionStorage.setItem('report_token', token);
}
function clearToken() {
  sessionStorage.removeItem('report_token');
  sessionStorage.removeItem('report_user');
}

// 用户信息缓存
function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem('report_user') || 'null');
  } catch { return null; }
}
function setUser(user) {
  sessionStorage.setItem('report_user', JSON.stringify(user));
}

// 带认证的 fetch
async function fetchWithAuth(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const res = await fetch(WORKER_URL + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearToken();
    window.location.href = 'teacher-login.html';
    throw new Error('登录已过期');
  }
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// 登录
async function login(username, password) {
  const res = await fetch(WORKER_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.token) {
    throw new Error(data.error || '登录失败');
  }
  setToken(data.token);
  setUser(data.teacher);
  return data;
}

// 登出
async function logout() {
  try { await fetchWithAuth('/api/auth/logout', { method: 'POST' }); } catch {}
  clearToken();
  window.location.href = 'teacher-login.html';
}

// 检查登录状态
async function checkAuth() {
  const token = getToken();
  if (!token) return false;
  try {
    const data = await fetchWithAuth('/api/auth/me');
    setUser(data.teacher);
    return data;
  } catch {
    clearToken();
    return false;
  }
}

// 初始化：如果未登录且不在登录页，跳转
async function requireAuth() {
  const data = await checkAuth();
  if (!data) {
    window.location.href = 'teacher-login.html';
    return null;
  }
  return data;
}
