import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const DATA_DIR = path.join(process.cwd(), '.data');
const STORAGE_KEY = 'warm_blog_philosophy_thoughts';

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

function search(items: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase();
  return items.filter((item: any) =>
    item.quote?.toLowerCase().includes(lowerQuery) ||
    item.author?.toLowerCase().includes(lowerQuery) ||
    item.content?.toLowerCase().includes(lowerQuery) ||
    item.category?.toLowerCase().includes(lowerQuery)
  );
}

// GET all philosophy thoughts
export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get('search');
  const category = searchParams.get('category');

  let thoughts = getAll();

  if (search) {
    thoughts = search(thoughts, search);
  }

  if (category) {
    thoughts = thoughts.filter((t: any) => t.category === category);
  }

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

    const newItem = {
      quote,
      author: author || '未知',
      category: category || '未分类',
      content,
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
      quote,
      author,
      category,
      content,
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
