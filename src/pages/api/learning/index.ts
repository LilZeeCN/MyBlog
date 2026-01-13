import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let query = supabase
    .from('learning_projects')
    .select('*')
    .order('progress', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const projects = data?.map(item => ({
    ...item,
    startDate: item.start_date,
    endDate: item.end_date,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];

  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, description, status, progress, startDate, endDate, resources } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: '标题不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const id = crypto.randomUUID();

    const { data: newItem, error } = await supabase
      .from('learning_projects')
      .insert({
        id,
        title,
        description,
        status: status || '计划中',
        progress: progress || 0,
        start_date: startDate || null,
        end_date: endDate || null,
        resources: resources || [],
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
      startDate: newItem.start_date,
      endDate: newItem.end_date,
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
    const { id, title, description, status, progress, startDate, endDate, resources } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updated, error } = await supabase
      .from('learning_projects')
      .update({
        title,
        description,
        status,
        progress,
        start_date: startDate,
        end_date: endDate,
        resources,
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
      startDate: updated.start_date,
      endDate: updated.end_date,
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
