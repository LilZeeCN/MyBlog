import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';

export const prerender = false;

// GET all life moments
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const searchQuery = searchParams.get('search');

  let query = supabase
    .from('life_moments')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 转换字段名以匹配前端期望的格式
  const moments = data?.map(item => ({
    ...item,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];

  return new Response(JSON.stringify(moments), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// POST create life moment
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, content, date, mood, tags } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const id = crypto.randomUUID();

    const { data: newItem, error } = await supabase
      .from('life_moments')
      .insert({
        id,
        title,
        content,
        date: date || new Date().toISOString().split('T')[0],
        mood: mood || '😊',
        tags: tags || [],
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

    // 转换字段名
    const response = {
      ...newItem,
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

// PUT update life moment
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, title, content, date, mood, tags } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updated, error } = await supabase
      .from('life_moments')
      .update({
        title,
        content,
        date,
        mood,
        tags,
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

    // 转换字段名
    const response = {
      ...updated,
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
