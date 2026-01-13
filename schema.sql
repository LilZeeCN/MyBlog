-- 创建数据库
CREATE DATABASE IF NOT EXISTS warm_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE warm_blog;

-- 用户表 (如果需要认证)
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 博客文章表
CREATE TABLE IF NOT EXISTS posts (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  category ENUM('生活', '哲学', '技术', '学习', '其他') DEFAULT '生活',
  cover_image VARCHAR(100) DEFAULT '📝',
  mood VARCHAR(50) DEFAULT 'neutral',
  reading_time INT DEFAULT 1,
  view_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_search (title, content),
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_published_at (published_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  post_id CHAR(36),
  tag_id INT,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 生活瞬间表
CREATE TABLE IF NOT EXISTS life_moments (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  date VARCHAR(50),
  mood VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_search (title, content),
  INDEX idx_date (date DESC),
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 生活瞬间标签
CREATE TABLE IF NOT EXISTS life_moment_tags (
  moment_id CHAR(36),
  tag_name VARCHAR(50),
  PRIMARY KEY (moment_id, tag_name),
  FOREIGN KEY (moment_id) REFERENCES life_moments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 哲学思考表
CREATE TABLE IF NOT EXISTS philosophy_thoughts (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  quote TEXT NOT NULL,
  author VARCHAR(100),
  category VARCHAR(50),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_search (quote, content),
  INDEX idx_author (author),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 哲学思考标签
CREATE TABLE IF NOT EXISTS philosophy_tags (
  thought_id CHAR(36),
  tag_name VARCHAR(50),
  PRIMARY KEY (thought_id, tag_name),
  FOREIGN KEY (thought_id) REFERENCES philosophy_thoughts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 吐槽表
CREATE TABLE IF NOT EXISTS rants (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  anger_level INT DEFAULT 5,
  category VARCHAR(50),
  reactions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_search (title, content),
  INDEX idx_anger_level (anger_level),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习项目表
CREATE TABLE IF NOT EXISTS learning_projects (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('计划中', '进行中', '已完成', '暂停') DEFAULT '计划中',
  progress INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_progress (progress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习资源表
CREATE TABLE IF NOT EXISTS learning_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id CHAR(36),
  url VARCHAR(500) NOT NULL,
  title VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES learning_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 代码项目表
CREATE TABLE IF NOT EXISTS code_projects (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cover_emoji VARCHAR(10) DEFAULT '💻',
  status ENUM('Concept', 'WIP', 'Beta', 'Stable', 'Archived') DEFAULT 'WIP',
  technologies JSON,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  stars INT DEFAULT 0,
  forks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_stars (stars DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
