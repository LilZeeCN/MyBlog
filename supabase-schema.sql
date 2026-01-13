-- 在 Supabase 的 SQL Editor 中运行以下脚本

-- 1. 生活瞬间表
CREATE TABLE IF NOT EXISTS life_moments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT,
  mood TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 哲学思考表
CREATE TABLE IF NOT EXISTS philosophy_thoughts (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  category TEXT,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 吐槽表
CREATE TABLE IF NOT EXISTS rants (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  anger_level INTEGER DEFAULT 5,
  category TEXT,
  reactions INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 学习项目表
CREATE TABLE IF NOT EXISTS learning_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT '计划中',
  progress INTEGER DEFAULT 0,
  resources JSONB DEFAULT '[]'::jsonb,
  start_date DATE,
  end_date DATE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 代码项目表
CREATE TABLE IF NOT EXISTS code_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_emoji TEXT DEFAULT '💻',
  status TEXT DEFAULT 'WIP',
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  demo_url TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用行级安全性 (RLS)
ALTER TABLE life_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE philosophy_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rants ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_projects ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取和写入（用于公开博客）
CREATE POLICY "Allow all access on life_moments" ON life_moments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on philosophy_thoughts" ON philosophy_thoughts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on rants" ON rants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on learning_projects" ON learning_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on code_projects" ON code_projects FOR ALL USING (true) WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_life_moments_created_at ON life_moments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_philosophy_thoughts_created_at ON philosophy_thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rants_created_at ON rants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rants_anger_level ON rants(anger_level DESC);
CREATE INDEX IF NOT EXISTS idx_learning_projects_progress ON learning_projects(progress DESC);
CREATE INDEX IF NOT EXISTS idx_code_projects_stars ON code_projects(stars DESC);
