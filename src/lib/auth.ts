import type { AstroCookies } from 'astro';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_DAYS = 7;
const SESSION_COOKIE_NAME = 'session';

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
  // 兼容旧调用：改为无状态 Cookie，不需要服务端存储
  void token;
}

/**
 * 验证会话是否有效
 */
export function isSessionValid(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [sessionToken, expiresRaw, signature] = parts;
  if (!sessionToken || !expiresRaw || !signature) return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires)) return false;
  if (expires < Date.now()) return false;

  const secret = getAuthSecret();
  if (!secret) return false;

  const expected = signSessionValue(secret, sessionToken, expiresRaw);
  return safeEqualHex(signature, expected);
}

/**
 * 删除会话
 */
export function deleteSession(token: string): void {
  // 兼容旧调用：无状态 Cookie 不需要服务端删除
  void token;
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
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const secret = getAuthSecret();
  if (!secret) {
    console.error('AUTH_SECRET (or ADMIN_PASSWORD fallback) environment variable is not set');
    return;
  }

  const signature = signSessionValue(secret, token, String(expires));
  const cookieValue = `${token}.${expires}.${signature}`;

  cookies.set(SESSION_COOKIE_NAME, cookieValue, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD, // 生产环境使用 HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * SESSION_DAYS // 7 天
  });
}

/**
 * 清除会话 Cookie
 */
export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, {
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

function getAuthSecret(): string | undefined {
  return import.meta.env.AUTH_SECRET || import.meta.env.ADMIN_PASSWORD;
}

function signSessionValue(secret: string, token: string, expires: string): string {
  const data = `${token}.${expires}`;
  return createHmac('sha256', secret).update(data).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}
