import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get('search');
  const category = searchParams.get('category');

  let query = supabase
    .from('rants')
    .select('*')
    .order('anger_level', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const rants = data?.map(item => ({
    ...item,
    angerLevel: item.anger_level,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];

  return new Response(JSON.stringify(rants), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, content, angerLevel, category } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const id = crypto.randomUUID();

    const { data: newItem, error } = await supabase
      .from('rants')
      .insert({
        id,
        title,
        content,
        anger_level: angerLevel || 5,
        category: category || '',
        reactions: 0,
        slug,
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: '创建失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = {
      ...newItem,
      angerLevel: newItem.anger_level,
      createdAt: newItem.created_at,
      updatedAt: newItem.updated_at
    };

    return new Response(JSON.stringify({ success: true, data: response }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '创建失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, title, content, angerLevel, category } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updated, error } = await supabase
      .from('rants')
      .update({
        title,
        content,
        anger_level: angerLevel,
        category,
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
  } catch (error) {
    return new Response(JSON.stringify({ error: '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
