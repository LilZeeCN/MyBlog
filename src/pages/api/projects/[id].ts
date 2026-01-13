import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const { data, error } = await supabase
    .from('code_projects')
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

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const { error } = await supabase
    .from('code_projects')
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
  const { id } = params;
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
};
