# 模块管理功能指南（Supabase 版）

## 项目架构

### 数据存储（Supabase）
- **数据库**：Supabase Postgres
- **客户端**：`src/lib/supabase.ts`
- **表结构**：`supabase-schema.sql`（在 Supabase SQL Editor 中运行）

### 服务端（Astro API Routes）
- Astro 配置为 `output: 'server'`，支持动态 API 路由
- API 路由目录：`src/pages/api/**`
- 读接口默认公开；写接口需要管理员会话（见下文）

### 管理员认证
- 登录页：`/login`（`src/pages/login.astro`）
- 登录接口：`POST /api/auth/login`（密码来自 `ADMIN_PASSWORD` 环境变量）
- 会话机制：`session` HttpOnly Cookie + 服务器内存 Map（`src/lib/auth.ts`）
  - 注意：如果部署到 Serverless（如 Vercel Functions），内存会话可能不稳定；更稳妥的做法是用 Supabase Auth / JWT / 持久化会话存储。

## API 接口

### 通用 CRUD（5 个模块）

每个模块支持以下 API 端点（`{id-or-slug}` 支持传 **id 或 slug**）：

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/{module}` | 获取列表（支持 search/category/status 等 query） |
| GET | `/api/{module}/{id-or-slug}` | 获取单条数据 |
| POST | `/api/{module}` | 创建新数据（需登录） |
| PUT | `/api/{module}/{id-or-slug}` | 更新数据（需登录；吐槽共鸣除外） |
| DELETE | `/api/{module}/{id-or-slug}` | 删除数据（需登录） |

模块与数据表对照：
- `life` → `life_moments`
- `philosophy` → `philosophy_thoughts`
- `rants` → `rants`
- `learning` → `learning_projects`
- `projects` → `code_projects`

### 聚合内容（`/blog` 页面）
- `GET /api/posts?type=all|life|philosophy|rants|learning|projects&search=...`
- 会将 5 个模块合并后按时间倒序返回，并补充：
  - `contentType`（life/philosophy/...）
  - `typeName`（生活/哲学/...）

## 数据字段说明

- 数据库字段多为 `snake_case`（如 `created_at`），API 返回会映射成前端使用的 `camelCase`（如 `createdAt`）。
- `tags` / `resources` / `technologies` 在 Supabase 表中为 `jsonb` 类型。

## 示例数据（写入 Supabase）

- 访问 `/setup`，管理员登录后可初始化/重置示例数据
- 对应接口：
  - `POST /api/setup/examples`
  - `DELETE /api/setup/examples`
  - 代码位置：`src/pages/api/setup/examples.ts`

## 环境变量

参考 `.env.example`：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `SITE_URL`（可选）
