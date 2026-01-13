import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const DATA_DIR = path.join(process.cwd(), '.data');
const STORAGE_KEY = 'warm_blog_posts';

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

// GET single post by slug
export const GET: APIRoute = async ({ params }) => {
  const items = getAll();
  const item = items.find((i: any) => i.slug === params.slug);

  if (!item) {
    return new Response(JSON.stringify({ error: '文章不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify(item), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// PUT update post by slug
export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const { title, content, excerpt, category, tags, coverImage, mood } = body;
  const items = getAll();
  const index = items.findIndex((i: any) => i.slug === params.slug);

  if (index === -1) {
    return new Response(JSON.stringify({ error: '文章不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const updated = {
    ...items[index],
    title,
    content,
    excerpt,
    category,
    tags,
    coverImage,
    mood,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updated;
  updateData(items);

  return new Response(JSON.stringify({ success: true, data: updated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// DELETE post by slug
export const DELETE: APIRoute = async ({ params }) => {
  const items = getAll();
  const index = items.findIndex((i: any) => i.slug === params.slug);

  if (index === -1) {
    return new Response(JSON.stringify({ error: '文章不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  items.splice(index, 1);
  updateData(items);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
