import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';
import { verifySession } from '@/lib/auth.js';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const { data, error } = await supabase
    .from('rants')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = {
    ...data,
    angerLevel: data.anger_level,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: APIRoute = async ({ params, request }) => {
  // 验证身份
  const authResult = await verifySession(request);
  if (!authResult.authenticated) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { id } = params;

  const { error } = await supabase
    .from('rants')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  // 验证身份
  const authResult = await verifySession(request);
  if (!authResult.authenticated) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { id } = params;
  const body = await request.json();

  const { data: updated, error } = await supabase
    .from('rants')
    .update({
      title: body.title,
      content: body.content,
      anger_level: body.angerLevel,
      category: body.category,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = {
    ...updated,
    angerLevel: updated.anger_level,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };

  return new Response(JSON.stringify({ success: true, data: response }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
