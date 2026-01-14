// 博客编辑页面脚本

// 等待 blogManager 初始化完成
function waitForBlogManager() {
  return new Promise((resolve) => {
    const check = () => {
      if (window.blogManager && window.blogManager.getAllPosts && window.blogManager.getAllPosts().length > 0) {
        resolve();
      } else {
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
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-primary-400 hover:underline" target="_blank">$1</a>');

  // 引用
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary-300 pl-4 italic my-4 text-text-secondary">$1</blockquote>');

  // 列表
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>');
  html = html.replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>');

  // 段落
  html = html.replace(/\n\n/g, '</p><p class="my-4">');
  html = '<p class="my-4">' + html + '</p>';

  // 清理空段落
  html = html.replace(/<p class="my-4"><\/p>/g, '');
  html = html.replace(/<p class="my-4">(h[1-6])/g, '$1');
  html = html.replace(/<\/(h[1-6])><\/p>/g, '</$1>');

  return html;
}

// 加载文章到表单
waitForBlogManager().then(() => {
  const pathParts = window.location.pathname.split('/');
  const slug = decodeURIComponent(pathParts[pathParts.length - 2]);

  const loading = document.getElementById('loading');
  const notFound = document.getElementById('not-found');
  const form = document.getElementById('blog-form');

  const post = window.blogManager.getPost(slug);

  if (!post) {
    loading.classList.add('hidden');
    notFound.classList.remove('hidden');
    return;
  }

  // 填充表单数据
  document.getElementById('title').value = post.title;
  document.getElementById('excerpt').value = post.excerpt || '';
  document.getElementById('category').value = post.category;
  document.getElementById('mood').value = post.mood;
  document.getElementById('coverImage').value = post.coverImage || '📝';
  document.getElementById('tags').value = post.tags ? post.tags.join(', ') : '';
  document.getElementById('content').value = post.content;

  // 保存文章 ID 到表单
  form.dataset.postId = post.id;
  form.dataset.originalSlug = slug;

  loading.classList.add('hidden');
  form.classList.remove('hidden');
});

// 插入 Markdown 到光标位置
function insertMarkdown(before, after = '') {
  const textarea = document.getElementById('content');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);

  const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
  textarea.value = newText;

  // 设置光标位置
  const newCursorPos = start + before.length + selectedText.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  textarea.focus();
}

// 工具栏按钮事件
document.querySelectorAll('.toolbar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    switch (action) {
      case 'bold':
        insertMarkdown('**', '**');
        break;
      case 'italic':
        insertMarkdown('*', '*');
        break;
      case 'heading':
        insertMarkdown('## ', '');
        break;
      case 'link':
        insertMarkdown('[', '](url)');
        break;
      case 'code':
        insertMarkdown('`', '`');
        break;
      case 'list':
        insertMarkdown('- ', '');
        break;
      case 'quote':
        insertMarkdown('> ', '');
        break;
    }
  });
});

// 预览功能
const previewBtn = document.getElementById('preview-btn');
const previewModal = document.getElementById('preview-modal');
const closePreview = document.getElementById('close-preview');
const previewContent = document.getElementById('preview-content');

previewBtn.addEventListener('click', () => {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  let html = '';
  if (title) {
    html += `<h1 class="text-4xl font-bold mb-4">${title}</h1>`;
  }
  if (content) {
    html += parseMarkdown(content);
  }

  previewContent.innerHTML = html || '<p class="text-text-muted">暂无内容</p>';
  previewModal.showModal();
});

closePreview.addEventListener('click', () => {
  previewModal.close();
});

// 表单提交
const form = document.getElementById('blog-form');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const postId = form.dataset.postId;
  const originalSlug = form.dataset.originalSlug;

  const formData = new FormData(form);
  const tagsValue = formData.get('tags');
  const tags = tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const postData = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    mood: formData.get('mood'),
    coverImage: formData.get('coverImage') || '📝',
    tags: tags
  };

  try {
    window.blogManager.updatePost(postId, postData);
    alert('文章更新成功！');
    // 使用原来的 slug 重定向，而不是生成新的
    window.location.href = `/blog/${originalSlug}`;
  } catch (error) {
    alert('更新失败：' + error.message);
  }
});

cancelBtn.addEventListener('click', () => {
  if (confirm('确定要取消吗？未保存的修改将会丢失。')) {
    window.location.href = `/blog/${form.dataset.originalSlug}`;
  }
});

deleteBtn.addEventListener('click', () => {
  if (confirm('确定要删除这篇文章吗？删除后无法恢复！')) {
    if (confirm('再次确认：真的要删除吗？')) {
      try {
        window.blogManager.deletePost(form.dataset.postId);
        alert('文章已删除');
        window.location.href = '/blog';
      } catch (error) {
        alert('删除失败：' + error.message);
      }
    }
  }
});
