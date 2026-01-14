import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase.js';
import { verifySession } from '@/lib/auth.js';

export const prerender = false;

type SeedSummary = { inserted: number; skipped: number };

const lifeExamples = [
  {
    slug: 'spring-cherry-blossoms',
    title: '春日赏樱',
    date: '2024年3月',
    content:
      '今天和朋友们一起去公园赏樱花。阳光透过粉色的花瓣洒下来，空气中弥漫着淡淡的花香。我们在树下野餐，聊天，拍照，度过了美好的一天。这种简单的快乐让我觉得生活真的很美好。',
    mood: '😊 开心',
    tags: ['春天', '樱花', '朋友', '野餐', '美好时光'],
    created_at: new Date('2024-03-15').toISOString(),
    updated_at: new Date('2024-03-15').toISOString()
  },
  {
    slug: 'midnight-coding',
    title: '深夜编程的灵感',
    date: '2024年2月',
    content:
      '凌晨两点，突然想到了一个解决bug的方法。打开电脑，沉浸在代码的世界里，周围一片寂静，只有键盘敲击的声音。当程序终于跑通的那一刻，成就感油然而生。虽然熬夜不好，但这种专注的状态真的很迷人。',
    mood: '🤓 专注',
    tags: ['编程', '深夜', '灵感', '成就感', '代码'],
    created_at: new Date('2024-02-20').toISOString(),
    updated_at: new Date('2024-02-20').toISOString()
  },
  {
    slug: 'first-coffee',
    title: '学会做咖啡',
    date: '2024年1月',
    content:
      '终于入手了一台咖啡机！今天第一次尝试做手冲咖啡，从磨豆到萃取，整个过程充满仪式感。虽然第一杯有点苦，但闻着咖啡香，感觉自己像个专业的咖啡师。期待明天做出更好喝的咖啡。',
    mood: '☕ 充实',
    tags: ['咖啡', '新技能', '生活仪式感', '学习'],
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString()
  }
];

const philosophyExamples = [
  {
    slug: 'existence-precedes-essence',
    quote: '存在先于本质',
    author: '萨特',
    category: '存在主义',
    content:
      '这句话深深触动了我。我们不是被预先定义好的，而是通过自己的选择和行动来定义自己。每一个决定都在塑造着我们成为什么样的人。这既让人感到自由，又让人感到责任重大。我们每个人都是自己人生的作者。',
    tags: ['存在主义', '自由意志', '选择', '人生意义'],
    created_at: new Date('2024-03-10').toISOString(),
    updated_at: new Date('2024-03-10').toISOString()
  },
  {
    slug: 'know-thyself',
    quote: '认识你自己',
    author: '苏格拉底',
    category: '古希腊哲学',
    content:
      '在这个信息爆炸的时代，我们很容易迷失在外界的声音中。什么是真正的自己？我的价值观、信念、梦想是从哪里来的？是自己思考得出的，还是被社会灌输的？认识自己是一生的功课，也是最困难的功课。',
    tags: ['自我认知', '反思', '古希腊哲学', '智慧'],
    created_at: new Date('2024-02-25').toISOString(),
    updated_at: new Date('2024-02-25').toISOString()
  },
  {
    slug: 'absurd-hero',
    quote: '我们必须想象西西弗斯是幸福的',
    author: '加缪',
    category: '荒诞主义',
    content:
      '生活本身可能没有意义，但我们可以在这种荒诞中找到自己的意义。就像西西弗斯推石头上山，明知会滚下来还要继续推。这不是悲剧，而是一种积极的反抗。我们在重复的日常中，依然可以找到属于自己的快乐和价值。',
    tags: ['荒诞主义', '人生意义', '积极态度', '反抗'],
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString()
  }
];

const rantsExamples = [
  {
    slug: 'useless-meeting',
    title: '又是一场毫无意义的会议',
    content:
      '今天开了3个小时的会，结果啥也没决定！每个人都在说车轱辘话，重要的问题避而不谈，不重要的细节反复讨论。最后还要"会后再讨论"。拜托，能不能直接点？我的时间真的很宝贵好吗！这种会议完全可以用一封邮件解决。',
    anger_level: 7,
    category: '工作',
    reactions: 0,
    created_at: new Date('2024-03-18').toISOString(),
    updated_at: new Date('2024-03-18').toISOString()
  },
  {
    slug: 'bad-code-review',
    title: '看不懂的代码评审',
    content:
      '刚收到一个代码评审意见："这里可以优化"。什么？！怎么优化？为什么要优化？有什么问题吗？能不能说清楚一点？我又不是你肚子里的蛔虫。要么就说具体点，要么就别提！这种模糊的评审意见只会浪费大家时间。',
    anger_level: 8,
    category: '技术',
    reactions: 0,
    created_at: new Date('2024-03-05').toISOString(),
    updated_at: new Date('2024-03-05').toISOString()
  },
  {
    slug: 'slow-wifi',
    title: '咖啡馆的网速能不能争点气',
    content:
      '明明宣传说"提供高速WiFi"，结果连个网页都打不开。发个消息要等半天，更别提视频会议了。关键是密码还设置得超级复杂，连上去发现还不如用手机流量快。这年头，没有好网络还敢开咖啡馆？',
    anger_level: 5,
    category: '生活',
    reactions: 0,
    created_at: new Date('2024-02-28').toISOString(),
    updated_at: new Date('2024-02-28').toISOString()
  }
];

const learningExamples = [
  {
    slug: 'react-deep-dive',
    title: 'React 深度学习计划',
    description:
      '系统学习 React 的核心原理，包括虚拟 DOM、Hooks 原理、性能优化等。目标是能够深入理解 React 的工作机制，并应用到实际项目中。',
    status: '进行中',
    progress: 65,
    resources: ['https://react.dev/learn', 'https://github.com/reactjs/react-basic', 'https://epicreact.dev/'],
    start_date: '2024-01-01',
    end_date: '2024-04-30',
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-03-20').toISOString()
  },
  {
    slug: 'typescript-mastery',
    title: 'TypeScript 类型体操训练',
    description:
      '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等。通过实战练习提升类型编程能力，写出更安全、更优雅的代码。',
    status: '已完成',
    progress: 100,
    resources: [
      'https://www.typescriptlang.org/docs/',
      'https://github.com/type-challenges/type-challenges',
      'https://www.totaltypescript.com/'
    ],
    start_date: '2023-11-01',
    end_date: '2024-01-31',
    created_at: new Date('2023-11-01').toISOString(),
    updated_at: new Date('2024-01-31').toISOString()
  },
  {
    slug: 'system-design',
    title: '系统设计与架构',
    description:
      '学习大型系统的设计思路和常见架构模式。包括微服务、负载均衡、缓存策略、数据库设计等。为成为架构师做准备。',
    status: '计划中',
    progress: 0,
    resources: [
      'https://github.com/donnemartin/system-design-primer',
      'https://www.educative.io/courses/grokking-the-system-design-interview'
    ],
    start_date: '2024-05-01',
    end_date: '2024-08-31',
    created_at: new Date('2024-03-15').toISOString(),
    updated_at: new Date('2024-03-15').toISOString()
  }
];

const projectsExamples = [
  {
    slug: 'ai-writing-assistant',
    title: 'AI 写作助手',
    description:
      '基于大语言模型的智能写作助手，支持文章润色、语法检查、风格转换等功能。使用 React + Node.js + OpenAI API 构建，提供流畅的用户体验。',
    cover_emoji: '✍️',
    status: 'Stable',
    technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
    github_url: 'https://github.com/yourusername/ai-writing-assistant',
    demo_url: 'https://ai-writing.demo.com',
    stars: 248,
    forks: 32,
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-03-20').toISOString()
  },
  {
    slug: 'task-tracker',
    title: '极简任务管理器',
    description:
      '一个极简风格的任务管理工具，专注于提升工作效率。支持番茄钟、项目分组、进度追踪等功能。界面简洁优雅，没有任何多余的干扰。',
    cover_emoji: '📋',
    status: 'Beta',
    technologies: ['Vue 3', 'Vite', 'Pinia', 'IndexedDB'],
    github_url: 'https://github.com/yourusername/task-tracker',
    demo_url: 'https://tasks.demo.com',
    stars: 156,
    forks: 18,
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-03-18').toISOString()
  },
  {
    slug: 'design-system',
    title: 'Aurora 设计系统',
    description:
      '一套现代化的 UI 组件库，包含 50+ 精心设计的组件。支持深色模式、主题定制、响应式设计。为开发者提供一致、优雅的设计解决方案。',
    cover_emoji: '🎨',
    status: 'WIP',
    technologies: ['React', 'Storybook', 'CSS Modules', 'Framer Motion'],
    github_url: 'https://github.com/yourusername/aurora-ui',
    demo_url: null,
    stars: 89,
    forks: 12,
    created_at: new Date('2024-03-01').toISOString(),
    updated_at: new Date('2024-03-20').toISOString()
  }
];

async function seedTable(table: string, rows: Array<Record<string, any>>): Promise<SeedSummary> {
  const slugs = rows.map(r => r.slug);
  if (slugs.length === 0) return { inserted: 0, skipped: 0 };

  const existing = await supabase.from(table).select('slug').in('slug', slugs);
  if (existing.error) throw existing.error;

  const existingSlugs = new Set((existing.data || []).map(r => r.slug));
  const toInsert = rows
    .filter(r => !existingSlugs.has(r.slug))
    .map(r => ({ id: crypto.randomUUID(), ...r }));

  if (toInsert.length === 0) return { inserted: 0, skipped: rows.length };

  const inserted = await supabase.from(table).insert(toInsert);
  if (inserted.error) throw inserted.error;

  return { inserted: toInsert.length, skipped: rows.length - toInsert.length };
}

async function deleteExamples(table: string, slugs: string[]): Promise<number> {
  if (slugs.length === 0) return 0;
  const result = await supabase.from(table).delete({ count: 'exact' }).in('slug', slugs);
  if (result.error) throw result.error;
  return result.count || 0;
}

export const POST: APIRoute = async ({ request }) => {
  const authResult = await verifySession(request);
  if (!authResult.authenticated) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const [life, philosophy, rants, learning, projects] = await Promise.all([
      seedTable('life_moments', lifeExamples),
      seedTable('philosophy_thoughts', philosophyExamples),
      seedTable('rants', rantsExamples),
      seedTable('learning_projects', learningExamples),
      seedTable('code_projects', projectsExamples)
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          life,
          philosophy,
          rants,
          learning,
          projects
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || '初始化失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authResult = await verifySession(request);
  if (!authResult.authenticated) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const [life, philosophy, rants, learning, projects] = await Promise.all([
      deleteExamples('life_moments', lifeExamples.map(r => r.slug)),
      deleteExamples('philosophy_thoughts', philosophyExamples.map(r => r.slug)),
      deleteExamples('rants', rantsExamples.map(r => r.slug)),
      deleteExamples('learning_projects', learningExamples.map(r => r.slug)),
      deleteExamples('code_projects', projectsExamples.map(r => r.slug))
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          life,
          philosophy,
          rants,
          learning,
          projects
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || '清理失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

