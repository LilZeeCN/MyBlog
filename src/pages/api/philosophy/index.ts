import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';

export const prerender = false;

// GET all philosophy thoughts
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get('search');
  const category = searchParams.get('category');

  let query = supabase
    .from('philosophy_thoughts')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`quote.ilike.%${search}%,author.ilike.%${search}%,content.ilike.%${search}%,category.ilike.%${search}%`);
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

  // 转换字段名
  const thoughts = data?.map(item => ({
    ...item,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];

  return new Response(JSON.stringify(thoughts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// POST create philosophy thought
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { quote, author, category, content, tags } = body;

    if (!quote || !content) {
      return new Response(JSON.stringify({ error: '引用和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const id = crypto.randomUUID();

    const { data: newItem, error } = await supabase
      .from('philosophy_thoughts')
      .insert({
        id,
        quote,
        author: author || '未知',
        category: category || '未分类',
        content,
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

// PUT update philosophy thought
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, quote, author, category, content, tags } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updated, error } = await supabase
      .from('philosophy_thoughts')
      .update({
        quote,
        author,
        category,
        content,
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
