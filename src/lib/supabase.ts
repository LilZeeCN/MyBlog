import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bxzqzkrizlflajixncvf.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'sb_publishable_NAIVUzurK4L6Tc1CGMckOw_t3YKXgYc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据表类型定义
export interface LifeMoment {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface PhilosophyThought {
  id: string;
  quote: string;
  author: string;
  category: string;
  content: string;
  tags: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Rant {
  id: string;
  title: string;
  content: string;
  anger_level: number;
  category: string;
  reactions: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface LearningProject {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  resources: string[];
  start_date: string | null;
  end_date: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CodeProject {
  id: string;
  title: string;
  description: string;
  cover_emoji: string;
  status: string;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  stars: number;
  forks: number;
  slug: string;
  created_at: string;
  updated_at: string;
}
