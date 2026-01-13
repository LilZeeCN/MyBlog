import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const DATA_DIR = path.join(process.cwd(), '.data');
const STORAGE_KEY = 'warm_blog_life_moments';

function getAll(): any[] {
  const filePath = path.join(DATA_DIR, `${STORAGE_KEY}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) || [];
  } catch {
    return [];
  }
}

function updateData(items: any[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, `${STORAGE_KEY}.json`);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

function filterBySearch(items: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase();
  return items.filter((item: any) =>
    item.title?.toLowerCase().includes(lowerQuery) ||
    item.content?.toLowerCase().includes(lowerQuery) ||
    item.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  );
}

// GET all life moments
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const searchQuery = searchParams.get('search');

  let moments = getAll();

  if (searchQuery) {
    moments = filterBySearch(moments, searchQuery);
  }

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

    const newItem = {
      title,
      content,
      date: date || new Date().toISOString().split('T')[0],
      mood: mood || '😊',
      tags: tags || [],
      slug: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const items = getAll();
    items.push(newItem);
    updateData(items);

    return new Response(JSON.stringify({ success: true, data: newItem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
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

    const items = getAll();
    const index = items.findIndex((i: any) => i.id === id);

    if (index === -1) {
      return new Response(JSON.stringify({ error: '内容不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = {
      ...items[index],
      title,
      content,
      date,
      mood,
      tags,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    updateData(items);

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
