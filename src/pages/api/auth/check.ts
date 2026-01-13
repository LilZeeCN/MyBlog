import type { APIRoute } from 'astro';
import { isSessionValid } from '@/lib/auth.js';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const sessionToken = cookies.get('session')?.value;
  const authenticated = isSessionValid(sessionToken);

  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
