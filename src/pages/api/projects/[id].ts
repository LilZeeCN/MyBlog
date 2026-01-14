import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';
import { verifySession } from '@/lib/auth.js';

export const prerender = false;

function safeDecodeURIComponent(value: string | undefined): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function resolveCodeProjectId(identifier: string): Promise<{
  id: string | null;
  error: unknown | null;
}> {
  const byId = await supabase
    .from('code_projects')
    .select('id')
    .eq('id', identifier)
    .maybeSingle();

  if (byId.error) return { id: null, error: byId.error };
  if (byId.data?.id) return { id: byId.data.id, error: null };

  const bySlug = await supabase
    .from('code_projects')
    .select('id')
    .eq('slug', identifier)
    .maybeSingle();

  if (bySlug.error) return { id: null, error: bySlug.error };
  return { id: bySlug.data?.id ?? null, error: null };
}

export const GET: APIRoute = async ({ params }) => {
  const identifier = safeDecodeURIComponent(params.id);
  if (!identifier) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let { data, error } = await supabase
    .from('code_projects')
    .select('*')
    .eq('id', identifier)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!data) {
    ({ data, error } = await supabase
      .from('code_projects')
      .select('*')
      .eq('slug', identifier)
      .maybeSingle());
  }

  if (error || !data) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = {
    ...data,
    coverEmoji: data.cover_emoji,
    technologies: data.technologies || [],
    githubUrl: data.github_url,
    demoUrl: data.demo_url,
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

  const identifier = safeDecodeURIComponent(params.id);
  const resolved = await resolveCodeProjectId(identifier);
  if (resolved.error) {
    return new Response(JSON.stringify({ error: '删除失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!resolved.id) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { error } = await supabase
    .from('code_projects')
    .delete()
    .eq('id', resolved.id);

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

  const identifier = safeDecodeURIComponent(params.id);
  const resolved = await resolveCodeProjectId(identifier);
  if (resolved.error) {
    return new Response(JSON.stringify({ error: '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!resolved.id) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const body = await request.json();

  const { data: updated, error } = await supabase
    .from('code_projects')
    .update({
      title: body.title,
      description: body.description,
      cover_emoji: body.coverEmoji,
      status: body.status,
      technologies: body.technologies,
      github_url: body.githubUrl,
      demo_url: body.demoUrl,
      stars: body.stars,
      forks: body.forks,
      updated_at: new Date().toISOString()
    })
    .eq('id', resolved.id)
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
    coverEmoji: updated.cover_emoji,
    technologies: updated.technologies || [],
    githubUrl: updated.github_url,
    demoUrl: updated.demo_url,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };

  return new Response(JSON.stringify({ success: true, data: response }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
