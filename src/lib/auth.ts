import type { AstroCookies } from 'astro';

// 简单的内存会话存储
const sessions = new Map<string, { expires: number }>();

// 定期清理过期会话（每小时一次）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [token, data] of sessions.entries()) {
      if (data.expires < now) {
        sessions.delete(token);
      }
    }
  }, 1000 * 60 * 60);
}

/**
 * 生成随机会话令牌
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 创建新会话
 */
export function createSession(token: string): void {
  const expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 天
  sessions.set(token, { expires });
}

/**
 * 验证会话是否有效
 */
export function isSessionValid(token: string | undefined): boolean {
  if (!token) return false;

  const session = sessions.get(token);
  if (!session) return false;

  if (session.expires < Date.now()) {
    sessions.delete(token);
    return false;
  }

  return true;
}

/**
 * 删除会话
 */
export function deleteSession(token: string): void {
  sessions.delete(token);
}

/**
 * 从请求中验证会话
 */
export async function verifySession(request: Request): Promise<{ authenticated: boolean }> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return { authenticated: false };
  }

  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['session'];

  return { authenticated: isSessionValid(sessionToken) };
}

/**
 * 设置会话 Cookie
 */
export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set('session', token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD, // 生产环境使用 HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 天
  });
}

/**
 * 清除会话 Cookie
 */
export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete('session', {
    path: '/'
  });
}

/**
 * 解析 Cookie 字符串
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}

/**
 * 验证管理员密码
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = import.meta.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }
  return password === adminPassword;
}
