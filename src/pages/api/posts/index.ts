import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const DATA_DIR = path.join(process.cwd(), '.data');

const STORAGE_KEYS = {
  LIFE: 'warm_blog_life_moments',
  PHILOSOPHY: 'warm_blog_philosophy_thoughts',
  RANTS: 'warm_blog_rants',
  LEARNING: 'warm_blog_learning_projects',
  PROJECTS: 'warm_blog_code_projects',
};

function getAll(key: string): any[] {
  const filePath = path.join(DATA_DIR, `${key}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) || [];
  } catch {
    return [];
  }
}

function filterBySearch(items: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase();
  return items.filter((item: any) =>
    item.title?.toLowerCase().includes(lowerQuery) ||
    item.content?.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery) ||
    item.quote?.toLowerCase().includes(lowerQuery)
  );
}

// 获取所有内容（聚合所有模块）
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get('type'); // life, philosophy, rants, learning, projects
  const searchQuery = searchParams.get('search');

  let allContent: any[] = [];

  // 从各个模块获取数据并添加类型标识
  const lifeData = getAll(STORAGE_KEYS.LIFE).map((item: any) => ({ ...item, contentType: 'life', typeName: '生活' }));
  const philosophyData = getAll(STORAGE_KEYS.PHILOSOPHY).map((item: any) => ({ ...item, contentType: 'philosophy', typeName: '哲学' }));
  const rantsData = getAll(STORAGE_KEYS.RANTS).map((item: any) => ({ ...item, contentType: 'rants', typeName: '吐槽' }));
  const learningData = getAll(STORAGE_KEYS.LEARNING).map((item: any) => ({ ...item, contentType: 'learning', typeName: '学习' }));
  const projectsData = getAll(STORAGE_KEYS.PROJECTS).map((item: any) => ({ ...item, contentType: 'projects', typeName: '项目' }));

  allContent = [...lifeData, ...philosophyData, ...rantsData, ...learningData, ...projectsData];

  // 按类型过滤
  if (type && type !== 'all') {
    allContent = allContent.filter(item => item.contentType === type);
  }

  // 搜索
  if (searchQuery) {
    allContent = filterBySearch(allContent, searchQuery);
  }

  // 按创建时间倒序排序
  allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return new Response(JSON.stringify(allContent), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
