// 简单的 Markdown 解析器
function parseMarkdown(markdown) {
  let html = markdown;

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');

  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-400 hover:underline" target="_blank">$1</a>');

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
function initToolbar() {
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
}

// 预览功能
function initPreview() {
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
}

// 表单提交
function initForm() {
  const form = document.getElementById('blog-form');
  const cancelBtn = document.getElementById('cancel-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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
      const newPost = window.blogManager.createPost(postData);
      alert('文章发布成功！');
      window.location.href = `/blog/${newPost.slug}`;
    } catch (error) {
      alert('发布失败：' + error.message);
    }
  });

  cancelBtn.addEventListener('click', () => {
    if (confirm('确定要取消吗？未保存的内容将会丢失。')) {
      window.location.href = '/blog';
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initToolbar();
  initPreview();
  initForm();
});
