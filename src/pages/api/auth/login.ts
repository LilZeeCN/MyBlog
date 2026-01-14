import type { APIRoute } from 'astro';
import { verifyAdminPassword, generateSessionToken, createSession, setSessionCookie } from '@/lib/auth.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: '请输入密码' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          Vary: 'Cookie'
        }
      });
    }

    // 验证密码
    if (!verifyAdminPassword(password)) {
      return new Response(JSON.stringify({ error: '密码错误' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          Vary: 'Cookie'
        }
      });
    }

    // 生成会话令牌
    const token = generateSessionToken();
    createSession(token);
    setSessionCookie(cookies, token);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Vary: 'Cookie'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '登录失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Vary: 'Cookie'
      }
    });
  }
};
