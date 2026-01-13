// 文件系统存储层 - 数据持久化到本地文件

import fs from 'fs';
import path from 'path';

// 存储键名
export const STORAGE_KEYS = {
  POSTS: 'warm_blog_posts',
  LIFE_MOMENTS: 'warm_blog_life_moments',
  PHILOSOPHY_THOUGHTS: 'warm_blog_philosophy_thoughts',
  RANTS: 'warm_blog_rants',
  LEARNING_PROJECTS: 'warm_blog_learning_projects',
  CODE_PROJECTS: 'warm_blog_code_projects',
  TAGS: 'warm_blog_tags',
} as const;

// 数据目录
const DATA_DIR = path.join(process.cwd(), '.data');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取文件
function readFile<T>(storeName: string): T[] {
  const filePath = path.join(DATA_DIR, `${storeName}.json`);
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

// 写入文件
function writeFile<T>(storeName: string, data: T[]): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${storeName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==================== 工具函数 ====================

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(title: string): string {
  const timestamp = Date.now().toString(36);
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  return slug ? `${slug}-${timestamp}` : timestamp;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(content.length / wordsPerMinute));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ==================== 存储类 ====================

export class Storage<T> {
  constructor(private storeName: string) {}

  getAll(): T[] {
    return readFile<T>(this.storeName);
  }

  async getAllAsync(): Promise<T[]> {
    return this.getAll();
  }

  getBySlug(slug: string): T | undefined {
    const items = this.getAll();
    return items.find((item: any) => item.slug === slug);
  }

  async getBySlugAsync(slug: string): Promise<T | undefined> {
    return this.getBySlug(slug);
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item: any) => item.id === id);
  }

  async getByIdAsync(id: string): Promise<T | undefined> {
    return this.getById(id);
  }

  create(item: T): T {
    const newItem = {
      ...item,
      id: (item as any).id || generateId(),
      createdAt: (item as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const items = this.getAll();
    items.push(newItem);
    writeFile(this.storeName, items);

    return newItem;
  }

  async createAsync(item: T): Promise<T> {
    return this.create(item);
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.id === id);

    if (index === -1) return null;

    const updated = {
      ...items[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    writeFile(this.storeName, items);

    return updated;
  }

  async updateAsync(id: string, updates: Partial<T>): Promise<T | null> {
    return this.update(id, updates);
  }

  updateBySlug(slug: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.slug === slug);

    if (index === -1) return null;

    const updated = {
      ...items[index],
      ...updates,
      slug,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    writeFile(this.storeName, items);

    return updated;
  }

  async updateBySlugAsync(slug: string, updates: Partial<T>): Promise<T | null> {
    return this.updateBySlug(slug, updates);
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return false;

    items.splice(index, 1);
    writeFile(this.storeName, items);

    return true;
  }

  async deleteAsync(id: string): Promise<boolean> {
    return this.delete(id);
  }

  deleteBySlug(slug: string): boolean {
    const items = this.getAll();
    const item = items.find((item: any) => item.slug === slug);
    if (!item) return false;

    return this.delete((item as any).id);
  }

  async deleteBySlugAsync(slug: string): Promise<boolean> {
    return this.deleteBySlug(slug);
  }

  search(query: string, searchFields: (keyof T)[] = []): T[] {
    const items = this.getAll();
    const lowerQuery = query.toLowerCase();

    return items.filter((item: any) => {
      if (searchFields.length === 0) {
        return Object.values(item).some(
          val => typeof val === 'string' && val.toLowerCase().includes(lowerQuery)
        );
      }
      return searchFields.some(field => {
        const val = (item as any)[field];
        return typeof val === 'string' && val.toLowerCase().includes(lowerQuery);
      });
    });
  }

  async searchAsync(query: string, searchFields: (keyof T)[] = []): Promise<T[]> {
    return this.search(query, searchFields);
  }

  clear(): void {
    writeFile(this.storeName, []);
  }

  async clearAsync(): Promise<void> {
    this.clear();
  }

  async export(): Promise<string> {
    const items = this.getAll();
    return JSON.stringify(items, null, 2);
  }

  async import(data: T[]): Promise<void> {
    writeFile(this.storeName, data);
  }

  async getSize(): Promise<number> {
    const items = this.getAll();
    const jsonString = JSON.stringify(items);
    return new Blob([jsonString]).size;
  }
}

// ==================== 类型定义 ====================

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  mood: string;
  readingTime: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LifeMoment {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhilosophyThought {
  id: string;
  slug: string;
  quote: string;
  author: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Rant {
  id: string;
  slug: string;
  title: string;
  content: string;
  angerLevel: number;
  category: string;
  reactions: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: '计划中' | '进行中' | '已完成' | '暂停';
  progress: number;
  startDate: string | null;
  endDate: string | null;
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CodeProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverEmoji: string;
  status: 'Concept' | 'WIP' | 'Beta' | 'Stable' | 'Archived';
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== 创建存储实例 ====================

export const storage = {
  posts: new Storage<Post>(STORAGE_KEYS.POSTS),
  life: new Storage<LifeMoment>(STORAGE_KEYS.LIFE_MOMENTS),
  philosophy: new Storage<PhilosophyThought>(STORAGE_KEYS.PHILOSOPHY_THOUGHTS),
  rants: new Storage<Rant>(STORAGE_KEYS.RANTS),
  learning: new Storage<LearningProject>(STORAGE_KEYS.LEARNING_PROJECTS),
  projects: new Storage<CodeProject>(STORAGE_KEYS.CODE_PROJECTS),
};

// ==================== 获取存储统计 ====================

export async function getStorageStats(): Promise<{
  total: number;
  byStore: Record<string, number>;
}> {
  let total = 0;
  const byStore: Record<string, number> = {};

  for (const [key, storeName] of Object.entries(STORAGE_KEYS)) {
    const filePath = path.join(DATA_DIR, `${storeName}.json`);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      byStore[storeName] = size;
      total += size;
    } else {
      byStore[storeName] = 0;
    }
  }

  return { total, byStore };
}

// ==================== 数据迁移：localStorage → 文件系统 ====================

// 在浏览器控制台运行此函数来导出 localStorage 数据
export function exportLocalStorageData() {
  const result: Record<string, any> = {};

  for (const [key, storeName] of Object.entries(STORAGE_KEYS)) {
    if (key === 'TAGS') continue;
    const data = localStorage.getItem(storeName);
    if (data) {
      try {
        result[storeName] = JSON.parse(data);
      } catch (e) {
        console.error(`解析 ${storeName} 失败:`, e);
      }
    }
  }

  // 复制到剪贴板
  const json = JSON.stringify(result, null, 2);
  navigator.clipboard.writeText(json);
  console.log('数据已复制到剪贴板！请保存到 .data 目录');
  console.log('每个模块保存到独立的文件，例如: posts.json');

  return result;
}
