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

async function resolveRantId(identifier: string): Promise<{
  id: string | null;
  error: unknown | null;
}> {
  const byId = await supabase.from('rants').select('id').eq('id', identifier).maybeSingle();
  if (byId.error) return { id: null, error: byId.error };
  if (byId.data?.id) return { id: byId.data.id, error: null };

  const bySlug = await supabase.from('rants').select('id').eq('slug', identifier).maybeSingle();
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
    .from('rants')
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
      .from('rants')
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

  const identifier = safeDecodeURIComponent(params.id);
  const resolved = await resolveRantId(identifier);
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
    .from('rants')
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
  const identifier = safeDecodeURIComponent(params.id);
  if (!identifier) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const authResult = await verifySession(request);
  const body = await request.json().catch(() => ({}));

  const resolved = await resolveRantId(identifier);
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

  // 未登录：仅允许增加共鸣数
  if (!authResult.authenticated) {
    const keys = Object.keys(body ?? {});
    if (keys.length !== 1 || keys[0] !== 'reactions' || typeof body.reactions !== 'number') {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const current = await supabase
      .from('rants')
      .select('reactions')
      .eq('id', resolved.id)
      .maybeSingle();

    if (current.error || !current.data) {
      return new Response(JSON.stringify({ error: '内容不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const nextReactions = (current.data.reactions || 0) + 1;
    const { data: updated, error } = await supabase
      .from('rants')
      .update({
        reactions: nextReactions,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolved.id)
      .select()
      .single();

    if (error || !updated) {
      return new Response(JSON.stringify({ error: '更新失败' }), {
        status: 500,
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
  }

  // 已登录：允许编辑内容（部分字段）
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString()
  };
  if (typeof body.title !== 'undefined') updates.title = body.title;
  if (typeof body.content !== 'undefined') updates.content = body.content;
  if (typeof body.angerLevel !== 'undefined') updates.anger_level = body.angerLevel;
  if (typeof body.category !== 'undefined') updates.category = body.category;
  if (typeof body.reactions !== 'undefined') updates.reactions = body.reactions;

  const { data: updated, error } = await supabase
    .from('rants')
    .update(updates)
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
    angerLevel: updated.anger_level,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };

  return new Response(JSON.stringify({ success: true, data: response }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
