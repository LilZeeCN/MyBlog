import type { APIRoute } from 'astro';
import { clearSessionCookie, deleteSession } from '@/lib/auth.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 获取会话令牌
    const sessionToken = cookies.get('session')?.value;

    // 删除会话
    if (sessionToken) {
      deleteSession(sessionToken);
    }

    // 清除 Cookie
    clearSessionCookie(cookies);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '登出失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
