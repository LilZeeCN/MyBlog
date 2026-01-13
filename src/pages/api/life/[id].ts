import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const DATA_DIR = path.join(process.cwd(), '.data');
const STORAGE_KEY = 'warm_blog_life_moments';

function getAll(): any[] {
  const filePath = path.join(DATA_DIR, `${STORAGE_KEY}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
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

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const items = getAll();
  const item = items.find((i: any) => i.id === id);

  if (!item) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  const items = getAll();
  const filtered = items.filter((i: any) => i.id !== id);

  if (filtered.length === items.length) {
    return new Response(JSON.stringify({ error: '内容不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateData(filtered);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
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
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updated;
  updateData(items);

  return new Response(JSON.stringify({ success: true, data: updated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
