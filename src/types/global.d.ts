// 全局类型定义

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
}

interface BlogManager {
  getAllPosts(): BlogPost[];
  getPost(slug: string): BlogPost | undefined;
  getPostsByCategory(category: string): BlogPost[];
  searchPosts(query: string): BlogPost[];
  createPost(postData: Partial<BlogPost>): BlogPost;
  updatePost(postId: string, postData: Partial<BlogPost>): void;
  deletePost(postId: string): void;
}

declare global {
  interface Window {
    blogManager: BlogManager;
  }
}

export {};
