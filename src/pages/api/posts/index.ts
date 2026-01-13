import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// 获取所有内容（聚合所有模块）
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get('type'); // life, philosophy, rants, learning, projects
  const searchQuery = searchParams.get('search');

  let allContent: any[] = [];

  try {
    // 从各个模块获取数据并添加类型标识
    const [{ data: lifeData }, { data: philosophyData }, { data: rantsData }, { data: learningData }, { data: projectsData }] = await Promise.all([
      supabase.from('life_moments').select('*').order('created_at', { ascending: false }),
      supabase.from('philosophy_thoughts').select('*').order('created_at', { ascending: false }),
      supabase.from('rants').select('*').order('created_at', { ascending: false }),
      supabase.from('learning_projects').select('*').order('created_at', { ascending: false }),
      supabase.from('code_projects').select('*').order('created_at', { ascending: false }),
    ]);

    // 转换数据格式并添加类型标识
    const life = lifeData?.map(item => ({
      ...item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contentType: 'life',
      typeName: '生活'
    })) || [];

    const philosophy = philosophyData?.map(item => ({
      ...item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contentType: 'philosophy',
      typeName: '哲学'
    })) || [];

    const rants = rantsData?.map(item => ({
      ...item,
      angerLevel: item.anger_level,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contentType: 'rants',
      typeName: '吐槽'
    })) || [];

    const learning = learningData?.map(item => ({
      ...item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contentType: 'learning',
      typeName: '学习'
    })) || [];

    const projects = projectsData?.map(item => ({
      ...item,
      coverEmoji: item.cover_emoji,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contentType: 'projects',
      typeName: '项目'
    })) || [];

    allContent = [...life, ...philosophy, ...rants, ...learning, ...projects];

    // 按类型过滤
    if (type && type !== 'all') {
      allContent = allContent.filter(item => item.contentType === type);
    }

    // 搜索
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      allContent = allContent.filter((item: any) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.content?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.quote?.toLowerCase().includes(lowerQuery)
      );
    }

    // 按创建时间倒序排序
    allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify(allContent), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
