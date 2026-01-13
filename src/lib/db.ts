import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'warm_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

export default pool;

// 辅助函数：生成 UUID
export function generateId(): string {
  return crypto.randomUUID();
}

// 辅助函数：生成 slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 辅助函数：计算阅读时间
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// 辅助函数：格式化日期
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
