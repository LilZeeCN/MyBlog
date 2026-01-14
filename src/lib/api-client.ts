// API 客户端 - 使用 localStorage 后端 API

// 生成唯一 ID
export function generateId(): string {
  return crypto.randomUUID();
}

// 生成 slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 计算阅读时间
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 格式化日期
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ==================== 博客文章 API ====================

export const blogAPI = {
  // 获取所有文章
  async getAll(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`/api/posts?${params}`);
    if (!response.ok) throw new Error('获取文章失败');
    return response.json();
  },

  // 获取单篇文章
  async getBySlug(slug: string) {
    const response = await fetch(`/api/posts/${slug}`);
    if (!response.ok) throw new Error('文章不存在');
    return response.json();
  },

  // 创建文章
  async create(data: any) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建文章失败');
    return response.json();
  },

  // 更新文章
  async update(slug: string, data: any) {
    const response = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新文章失败');
    return response.json();
  },

  // 删除文章
  async delete(slug: string) {
    const response = await fetch(`/api/posts/${slug}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除文章失败');
    return response.json();
  }
};

// ==================== 生活瞬间 API ====================

export const lifeAPI = {
  async getAll(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`/api/life${params}`);
    if (!response.ok) throw new Error('获取失败');
    return response.json();
  },

  async getBySlug(slug: string) {
    const moments = await this.getAll();
    return moments.find((m: any) => m.slug === slug);
  },

  async getById(id: string) {
    const response = await fetch(`/api/life/${id}`);
    if (!response.ok) throw new Error('内容不存在');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/life', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建失败');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/life/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新失败');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/life/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除失败');
    return response.json();
  }
};

// ==================== 哲学思考 API ====================

export const philosophyAPI = {
  async getAll(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`/api/philosophy?${params}`);
    if (!response.ok) throw new Error('获取失败');
    return response.json();
  },

  async getBySlug(slug: string) {
    const thoughts = await this.getAll();
    return thoughts.find((t: any) => t.slug === slug);
  },

  async getById(id: string) {
    const response = await fetch(`/api/philosophy/${id}`);
    if (!response.ok) throw new Error('内容不存在');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/philosophy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建失败');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/philosophy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新失败');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/philosophy/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除失败');
    return response.json();
  }
};

// ==================== 吐槽 API ====================

export const rantsAPI = {
  async getAll(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`/api/rants?${params}`);
    if (!response.ok) throw new Error('获取失败');
    return response.json();
  },

  async getBySlug(slug: string) {
    const rants = await this.getAll();
    return rants.find((r: any) => r.slug === slug);
  },

  async getById(id: string) {
    const response = await fetch(`/api/rants/${id}`);
    if (!response.ok) throw new Error('内容不存在');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/rants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建失败');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/rants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新失败');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/rants/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除失败');
    return response.json();
  }
};

// ==================== 学习项目 API ====================

export const learningAPI = {
  async getAll(status?: string, search?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await fetch(`/api/learning?${params}`);
    if (!response.ok) throw new Error('获取失败');
    return response.json();
  },

  async getBySlug(slug: string) {
    const projects = await this.getAll();
    return projects.find((p: any) => p.slug === slug);
  },

  async getById(id: string) {
    const response = await fetch(`/api/learning/${id}`);
    if (!response.ok) throw new Error('内容不存在');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/learning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建失败');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/learning/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新失败');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/learning/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除失败');
    return response.json();
  }
};

// ==================== 代码项目 API ====================

export const projectsAPI = {
  async getAll(status?: string, search?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await fetch(`/api/projects?${params}`);
    if (!response.ok) throw new Error('获取失败');
    return response.json();
  },

  async getBySlug(slug: string) {
    const projects = await this.getAll();
    return projects.find((p: any) => p.slug === slug);
  },

  async getById(id: string) {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) throw new Error('内容不存在');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('创建失败');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('更新失败');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('删除失败');
    return response.json();
  }
};

// 导出到全局（兼容现有代码）
declare global {
  interface Window {
    apiClient: {
      blog: typeof blogAPI;
      life: typeof lifeAPI;
      philosophy: typeof philosophyAPI;
      rants: typeof rantsAPI;
      learning: typeof learningAPI;
      projects: typeof projectsAPI;
    };
    blogManager: typeof blogAPI;
    lifeManager: typeof lifeAPI;
    philosophyManager: typeof philosophyAPI;
    rantsManager: typeof rantsAPI;
    learningManager: typeof learningAPI;
    projectsManager: typeof projectsAPI;
  }
}

window.apiClient = {
  blog: blogAPI,
  life: lifeAPI,
  philosophy: philosophyAPI,
  rants: rantsAPI,
  learning: learningAPI,
  projects: projectsAPI
};

// 兼容旧的 global 变量
window.blogManager = blogAPI;
window.lifeManager = lifeAPI;
window.philosophyManager = philosophyAPI;
window.rantsManager = rantsAPI;
window.learningManager = learningAPI;
window.projectsManager = projectsAPI;
