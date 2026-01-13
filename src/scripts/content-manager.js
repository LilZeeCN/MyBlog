// 通用内容管理器 - 用于管理各类内容（生活、哲学、吐槽、学习、项目）

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

// 格式化日期
function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 创建内容管理器实例
function createContentManager(storageKey) {
  // 获取所有内容
  function getAllItems() {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  }

  // 保存内容
  function saveItems(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  // 获取单个内容
  function getItem(slug) {
    const items = getAllItems();
    return items.find(item => item.slug === slug);
  }

  // 根据ID获取内容
  function getItemById(id) {
    const items = getAllItems();
    return items.find(item => item.id === id);
  }

  // 创建内容
  function createItem(itemData) {
    const items = getAllItems();
    const id = generateId();
    const slug = itemData.slug || generateSlug(itemData.title || itemData.content?.substring(0, 30) || id);

    const newItem = {
      id,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...itemData
    };

    items.unshift(newItem);
    saveItems(items);
    return newItem;
  }

  // 更新内容
  function updateItem(id, updates) {
    const items = getAllItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('内容不存在');
    }

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveItems(items);
    return items[index];
  }

  // 删除内容
  function deleteItem(id) {
    const items = getAllItems();
    const filtered = items.filter(item => item.id !== id);
    saveItems(filtered);
  }

  // 搜索内容
  function searchItems(query) {
    const items = getAllItems();
    const lowerQuery = query.toLowerCase();

    return items.filter(item => {
      const searchFields = [
        item.title,
        item.content,
        item.quote,
        item.description,
        item.tags?.join(' ')
      ].filter(Boolean);

      return searchFields.some(field =>
        field.toLowerCase().includes(lowerQuery)
      );
    });
  }

  // 按分类过滤
  function getItemsByCategory(category) {
    const items = getAllItems();
    return items.filter(item => item.category === category);
  }

  // 按标签过滤
  function getItemsByTag(tag) {
    const items = getAllItems();
    return items.filter(item => item.tags?.includes(tag));
  }

  return {
    getAllItems,
    getItem,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
    getItemsByCategory,
    getItemsByTag,
    formatDate
  };
}

// 创建各模块的管理器
window.lifeManager = createContentManager('life_moments');
window.philosophyManager = createContentManager('philosophy_thoughts');
window.rantsManager = createContentManager('rants');
window.learningManager = createContentManager('learning_projects');
window.projectsManager = createContentManager('code_projects');

// 导出辅助函数
window.contentUtils = {
  generateId,
  generateSlug,
  formatDate
};
