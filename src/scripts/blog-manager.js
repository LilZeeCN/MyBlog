// 博客管理器 - 处理博客的增删改查

const STORAGE_KEY = 'blog_posts';

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 生成slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 计算阅读时间
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 获取所有博客
function getAllPosts() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 保存所有博客
function saveAllPosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// 获取单个博客
function getPost(slug) {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug);
}

// 创建博客
function createPost(postData) {
  const posts = getAllPosts();
  const newPost = {
    id: generateId(),
    slug: generateSlug(postData.title),
    title: postData.title,
    excerpt: postData.excerpt || postData.title.substring(0, 100) + '...',
    content: postData.content,
    coverImage: postData.coverImage || '📝',
    category: postData.category || '生活',
    tags: postData.tags || [],
    publishedAt: new Date().toISOString(),
    readingTime: calculateReadingTime(postData.content),
    mood: postData.mood || 'neutral'
  };
  posts.unshift(newPost);
  saveAllPosts(posts);
  return newPost;
}

// 更新博客
function updatePost(id, postData) {
  const posts = getAllPosts();
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      title: postData.title,
      excerpt: postData.excerpt || postData.title.substring(0, 100) + '...',
      content: postData.content,
      coverImage: postData.coverImage || posts[index].coverImage,
      category: postData.category,
      tags: postData.tags,
      readingTime: calculateReadingTime(postData.content),
      mood: postData.mood || 'neutral',
      updatedAt: new Date().toISOString()
    };
    saveAllPosts(posts);
    return posts[index];
  }
  return null;
}

// 删除博客
function deletePost(id) {
  const posts = getAllPosts();
  const filtered = posts.filter(post => post.id !== id);
  saveAllPosts(filtered);
}

// 按分类获取博客
function getPostsByCategory(category) {
  const posts = getAllPosts();
  return posts.filter(post => post.category === category);
}

// 搜索博客
function searchPosts(query) {
  const posts = getAllPosts();
  const lowerQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 初始化示例数据
function initSampleData() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    const samples = [
      {
        title: '如何在忙碌的生活中保持内心的平静',
        excerpt: '在这个快节奏的时代，我们常常被各种事务所淹没。但即使在这样的环境中，我们仍然可以找到属于自己的宁静时刻...',
        content: `# 如何在忙碌的生活中保持内心的平静

在这个快节奏的时代，我们常常被各种事务所淹没。工作、学习、社交、家庭……无数的 obligations 像潮水一样涌来，让我们几乎没有喘息的空间。

但即使在这样的环境中，我们仍然可以找到属于自己的宁静时刻。

## 学会暂停

每天给自己留出10分钟，什么都不做，只是静静地坐着。可以是早晨起床后，可以是晚上睡觉前，也可以是工作间隙。

## 专注于当下

当我们感到焦虑时，往往是因为我们在担心未来，或者后悔过去。试着把注意力拉回到当下——此时此刻，你在做什么？你看到什么？听到什么？

## 接纳不完美

没有人能一直保持高效，也没有人能永远保持积极。允许自己有疲惫的时候，允许自己有消极的情绪。这很正常。

## 小练习

今天试试看：当你感到压力很大时，停下来，深呼吸三次，问自己："这件事，一年后还重要吗？"

你会发现，大多数让我们焦虑的事情，其实都不那么重要。`,
        coverImage: '🌸',
        category: '生活',
        tags: ['生活感悟', '内心平静', '自我成长'],
        mood: 'calm'
      },
      {
        title: '深入理解 React Server Components',
        excerpt: 'React Server Components 是一个革命性的特性，它改变了我们构建 React 应用的方式。让我们一起深入探索它的原理和最佳实践...',
        content: `# 深入理解 React Server Components

React Server Components (RSC) 是 React 团队在 2020 年底推出的一个革命性特性，它改变了我们构建 React 应用的方式。

## 什么是 Server Components？

Server Components 是一种在服务器上渲染的组件，它们不会被打包发送到客户端。这意味着：

- 可以直接访问服务器资源
- 不会增加客户端 bundle 大小
- 可以使用 Node.js 生态系统的所有功能

## 核心优势

### 1. 零客户端 Bundle

Server Components 的代码不会发送到浏览器，这意味着更小的下载量和更快的加载速度。

\`\`\`jsx
// ServerComponent.server.jsx - 不会发送到客户端
import fs from 'fs';
import db from './database';

export default function BlogPost({ id }) {
  const post = db.post.find(id);
  const content = fs.readFileSync(\`./posts/\${id}.md\`, 'utf-8');
  return <article>{content}</article>;
}
\`\`\`

### 2. 直接访问后端资源

不需要再创建 API 端点，可以直接在组件中查询数据库或读取文件系统。

## 最佳实践

1. 默认使用 Server Components
2. 只在需要交互时使用 Client Components
3. 在组件边界处传递数据，而不是层层传递

Server Components 正在改变我们构建 React 应用的思维方式，值得深入学习和探索。`,
        coverImage: '⚛️',
        category: '技术',
        tags: ['React', '前端开发', 'Web开发'],
        mood: 'excited'
      },
      {
        title: '论自由与责任的辩证关系',
        excerpt: '自由是人类永恒的追求，但真正的自由从来不是绝对的。自由与责任如同一枚硬币的两面，相辅相成，缺一不可...',
        content: `# 论自由与责任的辩证关系

自由是人类永恒的追求。从古至今，无数哲人、思想家都在探讨自由的意义。

但真正的自由从来不是绝对的。自由与责任，如同一枚硬币的两面，相辅相成，缺一不可。

## 自由的本质

自由不是想做什么就做什么，而是有能力选择做什么，并且有能力承担这个选择的后果。

萨特说："人是被判定为自由的。"这句话的意思是，我们别无选择，只能自由。我们每时每刻都在做选择，即使不做选择，也是一种选择。

## 责任的必然性

有自由，就必然有责任。因为：

1. 你的选择会影响他人
2. 你的选择会产生后果
3. 你需要对这些后果负责

## 真正的自由

真正的自由是：

- 明知选择的风险，依然敢于选择
- 明知责任的重担，依然勇于承担
- 在限制中寻找可能，在责任中实现自由

自由不是逃避责任，而是主动承担责任的勇气。`,
        coverImage: '🧠',
        category: '哲学',
        tags: ['哲学思考', '自由', '责任'],
        mood: 'thoughtful'
      }
    ];

    samples.forEach(sample => createPost(sample));
  }
}

// 导出到全局
window.blogManager = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostsByCategory,
  searchPosts,
  initSampleData
};

// 初始化示例数据（无论 DOM 是否已加载）
function initWhenReady() {
  initSampleData();
}

// 如果 DOM 已经加载完成，立即执行；否则等待 DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}
