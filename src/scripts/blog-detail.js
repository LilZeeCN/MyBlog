// 博客详情页脚本

// 等待 blogManager 初始化完成并有数据
function waitForBlogManager() {
  return new Promise((resolve) => {
    const check = () => {
      if (window.blogManager && window.blogManager.getAllPosts && window.blogManager.getAllPosts().length > 0) {
        console.log('blogDetail: blogManager 已就绪，文章数量:', window.blogManager.getAllPosts().length);
        resolve();
      } else {
        console.log('blogDetail: 等待 blogManager 初始化...');
        setTimeout(check, 50);
      }
    };
    check();
  });
}

// 简单的 Markdown 解析器
function parseMarkdown(markdown) {
  let html = markdown;

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>');

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-primary-100 px-2 py-1 rounded text-sm font-mono">$1</code>');

  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-10 mb-6">$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // 引用
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary-300 pl-6 my-6 italic text-lg text-text-secondary bg-primary-50 py-4 pr-4 rounded-r">$1</blockquote>');

  // 列表处理
  const lines = html.split('\n');
  let result = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^\d+\. /)) {
      // 有序列表
      if (!inList || listType !== 'ol') {
        if (inList) result.push(inList === 'ul' ? '</ul>' : '</ol>');
        result.push('<ol class="my-4">');
        inList = true;
        listType = 'ol';
      }
      result.push('<li class="ml-6 list-decimal my-2">' + line.replace(/^\d+\. /, '') + '</li>');
    } else if (line.match(/^- /)) {
      // 无序列表
      if (!inList || listType !== 'ul') {
        if (inList) result.push(inList === 'ul' ? '</ul>' : '</ol>');
        result.push('<ul class="my-4">');
        inList = true;
        listType = 'ul';
      }
      result.push('<li class="ml-6 list-disc my-2">' + line.replace(/^- /, '') + '</li>');
    } else {
      if (inList) {
        result.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = '';
      }
      // 段落
      if (line.trim() && !line.startsWith('<h') && !line.startsWith('</h') && !line.startsWith('<p') && !line.startsWith('</p') && !line.startsWith('<pre') && !line.startsWith('</pre') && !line.startsWith('<blockquote') && !line.startsWith('</blockquote>') && !line.startsWith('<li') && !line.startsWith('</li>')) {
        result.push('<p class="my-4 leading-relaxed">' + line + '</p>');
      } else if (line.trim()) {
        result.push(line);
      }
    }
  }

  if (inList) {
    result.push(listType === 'ul' ? '</ul>' : '</ol>');
  }

  return result.join('\n');
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 获取心情 emoji
function getMoodEmoji(mood) {
  const moods = {
    neutral: '😐',
    happy: '😊',
    excited: '🤩',
    thoughtful: '🤔',
    calm: '😌',
    sad: '😢'
  };
  return moods[mood] || '😐';
}

// 获取分类颜色
function getCategoryColor(category) {
  const colors = {
    '生活': 'bg-green-100 text-green-600',
    '哲学': 'bg-purple-100 text-purple-600',
    '技术': 'bg-blue-100 text-blue-600',
    '学习': 'bg-yellow-100 text-yellow-600',
    '其他': 'bg-gray-100 text-gray-600'
  };
  return colors[category] || 'bg-gray-100 text-gray-600';
}

// 加载文章
waitForBlogManager().then(() => {
  console.log('blogDetail: 开始加载文章');

  const pathParts = window.location.pathname.split('/');
  let slug = pathParts[pathParts.length - 1];
  // 解码 URL 编码的 slug（中文会被编码成 %E8%AE%BA 这样的格式）
  slug = decodeURIComponent(slug);

  console.log('blogDetail: 当前路径:', window.location.pathname);
  console.log('blogDetail: 提取的 slug:', slug);

  const loading = document.getElementById('loading');
  const notFound = document.getElementById('not-found');
  const articleContent = document.getElementById('article-content');

  // 打印所有文章的 slug 用于调试
  const allPosts = window.blogManager.getAllPosts();
  console.log('blogDetail: 所有文章的 slug:', allPosts.map(p => p.slug));

  const post = window.blogManager.getPost(slug);

  console.log('blogDetail: 找到的文章:', post);

  if (!post) {
    console.error('blogDetail: 文章未找到, slug:', slug);
    loading.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  document.getElementById('post-cover').textContent = post.coverImage || '📝';
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-date').textContent = '📅 ' + formatDate(post.publishedAt);
  document.getElementById('post-reading-time').textContent = '⏱️ ' + post.readingTime + ' 分钟';
  document.getElementById('post-excerpt').textContent = post.excerpt;
  document.getElementById('post-body').innerHTML = parseMarkdown(post.content);

  const categoryEl = document.getElementById('post-category');
  categoryEl.textContent = post.category;
  categoryEl.className = 'px-3 py-1 rounded-full text-xs font-medium ' + getCategoryColor(post.category);

  document.getElementById('post-mood').textContent = getMoodEmoji(post.mood);

  const tagsContainer = document.getElementById('post-tags');
  if (post.tags && post.tags.length > 0) {
    tagsContainer.innerHTML = post.tags.map(tag =>
      '<span class="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">#' + tag + '</span>'
    ).join('');
  } else {
    tagsContainer.innerHTML = '';
  }

  // 设置编辑和删除按钮
  const editBtn = document.getElementById('edit-btn');
  const deleteBtn = document.getElementById('delete-btn');

  editBtn.href = `/blog/${encodeURIComponent(slug)}/edit`;
  editBtn.classList.remove('hidden');
  deleteBtn.classList.remove('hidden');

  // 删除按钮事件
  deleteBtn.addEventListener('click', () => {
    if (confirm('确定要删除这篇文章吗？删除后无法恢复！')) {
      if (confirm('再次确认：真的要删除吗？')) {
        try {
          window.blogManager.deletePost(post.id);
          alert('文章已删除');
          window.location.href = '/blog';
        } catch (error) {
          alert('删除失败：' + error.message);
        }
      }
    }
  });

  loading.classList.add('hidden');
  articleContent.classList.remove('hidden');
  console.log('blogDetail: 文章加载完成');
});
