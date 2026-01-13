// 示例模板数据 - 为每个模块提供优秀的示例

// 生成唯一ID（与content-manager.js保持一致）
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 生成slug（与content-manager.js保持一致）
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ========== 生活模块示例 (Life) ==========
export const lifeExamples = [
  {
    id: generateId(),
    slug: 'spring-cherry-blossoms',
    title: '春日赏樱',
    date: '2024年3月',
    content: '今天和朋友们一起去公园赏樱花。阳光透过粉色的花瓣洒下来，空气中弥漫着淡淡的花香。我们在树下野餐，聊天，拍照，度过了美好的一天。这种简单的快乐让我觉得生活真的很美好。',
    mood: '😊 开心',
    tags: ['春天', '樱花', '朋友', '野餐', '美好时光'],
    createdAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-03-15').toISOString()
  },
  {
    id: generateId(),
    slug: 'midnight-coding',
    title: '深夜编程的灵感',
    date: '2024年2月',
    content: '凌晨两点，突然想到了一个解决bug的方法。打开电脑，沉浸在代码的世界里，周围一片寂静，只有键盘敲击的声音。当程序终于跑通的那一刻，成就感油然而生。虽然熬夜不好，但这种专注的状态真的很迷人。',
    mood: '🤓 专注',
    tags: ['编程', '深夜', '灵感', '成就感', '代码'],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString()
  },
  {
    id: generateId(),
    slug: 'first-coffee',
    title: '学会做咖啡',
    date: '2024年1月',
    content: '终于入手了一台咖啡机！今天第一次尝试做手冲咖啡，从磨豆到萃取，整个过程充满仪式感。虽然第一杯有点苦，但闻着咖啡香，感觉自己像个专业的咖啡师。期待明天做出更好喝的咖啡。',
    mood: '☕ 充实',
    tags: ['咖啡', '新技能', '生活仪式感', '学习'],
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  }
];

// ========== 哲学模块示例 (Philosophy) ==========
export const philosophyExamples = [
  {
    id: generateId(),
    slug: 'existence-precedes-essence',
    quote: '存在先于本质',
    author: '萨特',
    category: '存在主义',
    content: '这句话深深触动了我。我们不是被预先定义好的，而是通过自己的选择和行动来定义自己。每一个决定都在塑造着我们成为什么样的人。这既让人感到自由，又让人感到责任重大。我们每个人都是自己人生的作者。',
    tags: ['存在主义', '自由意志', '选择', '人生意义'],
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString()
  },
  {
    id: generateId(),
    slug: 'know-thyself',
    quote: '认识你自己',
    author: '苏格拉底',
    category: '古希腊哲学',
    content: '在这个信息爆炸的时代，我们很容易迷失在外界的声音中。什么是真正的自己？我的价值观、信念、梦想是从哪里来的？是自己思考得出的，还是被社会灌输的？认识自己是一生的功课，也是最困难的功课。',
    tags: ['自我认知', '反思', '古希腊哲学', '智慧'],
    createdAt: new Date('2024-02-25').toISOString(),
    updatedAt: new Date('2024-02-25').toISOString()
  },
  {
    id: generateId(),
    slug: 'absurd-hero',
    quote: '我们必须想象西西弗斯是幸福的',
    author: '加缪',
    category: '荒诞主义',
    content: '生活本身可能没有意义，但我们可以在这种荒诞中找到自己的意义。就像西西弗斯推石头上山，明知会滚下来还要继续推。这不是悲剧，而是一种积极的反抗。我们在重复的日常中，依然可以找到属于自己的快乐和价值。',
    tags: ['荒诞主义', '人生意义', '积极态度', '反抗'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  }
];

// ========== 吐槽模块示例 (Rants) ==========
export const rantsExamples = [
  {
    id: generateId(),
    slug: 'useless-meeting',
    title: '又是一场毫无意义的会议',
    content: '今天开了3个小时的会，结果啥也没决定！每个人都在说车轱辘话，重要的问题避而不谈，不重要的细节反复讨论。最后还要"会后再讨论"。拜托，能不能直接点？我的时间真的很宝贵好吗！这种会议完全可以用一封邮件解决。',
    angerLevel: 7,
    category: '工作',
    reactions: 0,
    createdAt: new Date('2024-03-18').toISOString(),
    updatedAt: new Date('2024-03-18').toISOString()
  },
  {
    id: generateId(),
    slug: 'bad-code-review',
    title: '看不懂的代码评审',
    content: '刚收到一个代码评审意见："这里可以优化"。什么？！怎么优化？为什么要优化？有什么问题吗？能不能说清楚一点？我又不是你肚子里的蛔虫。要么就说具体点，要么就别提！这种模糊的评审意见只会浪费大家时间。',
    angerLevel: 8,
    category: '技术',
    reactions: 0,
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString()
  },
  {
    id: generateId(),
    slug: 'slow-wifi',
    title: '咖啡馆的网速能不能争点气',
    content: '明明宣传说"提供高速WiFi"，结果连个网页都打不开。发个消息要等半天，更别提视频会议了。关键是密码还设置得超级复杂，连上去发现还不如用手机流量快。这年头，没有好网络还敢开咖啡馆？',
    angerLevel: 5,
    category: '生活',
    reactions: 0,
    createdAt: new Date('2024-02-28').toISOString(),
    updatedAt: new Date('2024-02-28').toISOString()
  }
];

// ========== 学习模块示例 (Learning) ==========
export const learningExamples = [
  {
    id: generateId(),
    slug: 'react-deep-dive',
    title: 'React 深度学习计划',
    description: '系统学习 React 的核心原理，包括虚拟 DOM、Hooks 原理、性能优化等。目标是能够深入理解 React 的工作机制，并应用到实际项目中。',
    status: '进行中',
    progress: 65,
    resources: [
      'https://react.dev/learn',
      'https://github.com/reactjs/react-basic',
      'https://epicreact.dev/'
    ],
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString()
  },
  {
    id: generateId(),
    slug: 'typescript-mastery',
    title: 'TypeScript 类型体操训练',
    description: '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等。通过实战练习提升类型编程能力，写出更安全、更优雅的代码。',
    status: '已完成',
    progress: 100,
    resources: [
      'https://www.typescriptlang.org/docs/',
      'https://github.com/type-challenges/type-challenges',
      'https://www.totaltypescript.com/'
    ],
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    createdAt: new Date('2023-11-01').toISOString(),
    updatedAt: new Date('2024-01-31').toISOString()
  },
  {
    id: generateId(),
    slug: 'system-design',
    title: '系统设计与架构',
    description: '学习大型系统的设计思路和常见架构模式。包括微服务、负载均衡、缓存策略、数据库设计等。为成为架构师做准备。',
    status: '计划中',
    progress: 0,
    resources: [
      'https://github.com/donnemartin/system-design-primer',
      'https://www.educative.io/courses/grokking-the-system-design-interview'
    ],
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    createdAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-03-15').toISOString()
  }
];

// ========== 项目模块示例 (Projects) ==========
export const projectsExamples = [
  {
    id: generateId(),
    slug: 'ai-writing-assistant',
    title: 'AI 写作助手',
    description: '基于大语言模型的智能写作助手，支持文章润色、语法检查、风格转换等功能。使用 React + Node.js + OpenAI API 构建，提供流畅的用户体验。',
    coverEmoji: '✍️',
    status: 'Stable',
    technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/ai-writing-assistant',
    demoUrl: 'https://ai-writing.demo.com',
    stars: 248,
    forks: 32,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString()
  },
  {
    id: generateId(),
    slug: 'task-tracker',
    title: '极简任务管理器',
    description: '一个极简风格的任务管理工具，专注于提升工作效率。支持番茄钟、项目分组、进度追踪等功能。界面简洁优雅，没有任何多余的干扰。',
    coverEmoji: '📋',
    status: 'Beta',
    technologies: ['Vue 3', 'Vite', 'Pinia', 'IndexedDB'],
    githubUrl: 'https://github.com/yourusername/task-tracker',
    demoUrl: 'https://tasks.demo.com',
    stars: 156,
    forks: 18,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-03-18').toISOString()
  },
  {
    id: generateId(),
    slug: 'design-system',
    title: 'Aurora 设计系统',
    description: '一套现代化的 UI 组件库，包含 50+ 精心设计的组件。支持深色模式、主题定制、响应式设计。为开发者提供一致、优雅的设计解决方案。',
    coverEmoji: '🎨',
    status: 'WIP',
    technologies: ['React', 'Storybook', 'CSS Modules', 'Framer Motion'],
    githubUrl: 'https://github.com/yourusername/aurora-ui',
    demoUrl: '',
    stars: 89,
    forks: 12,
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString()
  }
];

// ========== 初始化所有示例数据 ==========
export function initializeExampleData() {
  try {
    // 检查是否已经初始化过
    const hasInitialized = localStorage.getItem('examples_initialized');
    if (hasInitialized) {
      console.log('示例数据已存在，跳过初始化');
      return {
        success: false,
        message: '示例数据已存在'
      };
    }

    // 生活模块
    const lifeData = lifeExamples.map(item => ({
      ...item,
      slug: generateSlug(item.title)
    }));
    localStorage.setItem('life_moments', JSON.stringify(lifeData));

    // 哲学模块
    const philosophyData = philosophyExamples.map(item => ({
      ...item,
      slug: generateSlug(item.quote)
    }));
    localStorage.setItem('philosophy_thoughts', JSON.stringify(philosophyData));

    // 吐槽模块
    const rantsData = rantsExamples.map(item => ({
      ...item,
      slug: generateSlug(item.title)
    }));
    localStorage.setItem('rants', JSON.stringify(rantsData));

    // 学习模块
    const learningData = learningExamples.map(item => ({
      ...item,
      slug: generateSlug(item.title)
    }));
    localStorage.setItem('learning_projects', JSON.stringify(learningData));

    // 项目模块
    const projectsData = projectsExamples.map(item => ({
      ...item,
      slug: generateSlug(item.title)
    }));
    localStorage.setItem('code_projects', JSON.stringify(projectsData));

    // 标记已初始化
    localStorage.setItem('examples_initialized', 'true');

    console.log('✅ 所有示例数据初始化成功！');
    return {
      success: true,
      message: '所有示例数据初始化成功',
      data: {
        life: lifeData.length,
        philosophy: philosophyData.length,
        rants: rantsData.length,
        learning: learningData.length,
        projects: projectsData.length
      }
    };
  } catch (error) {
    console.error('初始化失败：', error);
    return {
      success: false,
      message: '初始化失败：' + error.message
    };
  }
}

// ========== 重置所有数据 ==========
export function resetAllData() {
  if (confirm('确定要清除所有数据并重新初始化示例吗？此操作不可撤销！')) {
    localStorage.removeItem('life_moments');
    localStorage.removeItem('philosophy_thoughts');
    localStorage.removeItem('rants');
    localStorage.removeItem('learning_projects');
    localStorage.removeItem('code_projects');
    localStorage.removeItem('examples_initialized');

    const result = initializeExampleData();
    if (result.success) {
      alert('数据重置成功！页面即将刷新。');
      window.location.reload();
    }
  }
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.exampleTemplates = {
    lifeExamples,
    philosophyExamples,
    rantsExamples,
    learningExamples,
    projectsExamples,
    initializeExampleData,
    resetAllData
  };
}
