import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let query = supabase
    .from('code_projects')
    .select('*')
    .order('stars', { ascending: false });

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
    coverEmoji: item.cover_emoji,
    technologies: item.technologies || [],
    githubUrl: item.github_url,
    demoUrl: item.demo_url,
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
    const { title, description, coverEmoji, status, technologies, githubUrl, demoUrl, stars, forks } = body;

    if (!title || !description) {
      return new Response(JSON.stringify({ error: '标题和描述不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const id = crypto.randomUUID();

    const { data: newItem, error } = await supabase
      .from('code_projects')
      .insert({
        id,
        title,
        description,
        cover_emoji: coverEmoji || '💻',
        status: status || 'WIP',
        technologies: technologies || [],
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
        stars: stars || 0,
        forks: forks || 0,
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
      coverEmoji: newItem.cover_emoji,
      technologies: newItem.technologies || [],
      githubUrl: newItem.github_url,
      demoUrl: newItem.demo_url,
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
    const { id, title, description, coverEmoji, status, technologies, githubUrl, demoUrl, stars, forks } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updated, error } = await supabase
      .from('code_projects')
      .update({
        title,
        description,
        cover_emoji: coverEmoji,
        status,
        technologies,
        github_url: githubUrl,
        demo_url: demoUrl,
        stars,
        forks,
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
  } catch (error) {
    return new Response(JSON.stringify({ error: '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
