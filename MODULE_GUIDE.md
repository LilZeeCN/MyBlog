# 模块管理功能指南

## 项目架构

### 数据存储 (IndexedDB)
- **数据库**: `WarmBlogDB` - IndexedDB 数据库
- **容量**: 50MB ~ 几 GB（远超 localStorage 的 5MB 限制）
- **存储层**: `src/lib/utils/storage.ts`
- **API**: RESTful 接口 (`src/pages/api/*/index.ts`)
- **前端**: API 客户端 (`src/lib/api-client.ts`)

### 数据迁移
首次访问时，系统会自动将 localStorage 中的旧数据迁移到 IndexedDB。

## API 接口

### 通用 CRUD 操作

每个模块都支持以下 API 端点：

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/{module}` | 获取所有数据（支持 ?search= 和 ?category= 参数） |
| GET | `/api/{module}/{id}` | 获取单条数据 |
| POST | `/api/{module}` | 创建新数据 |
| PUT | `/api/{module}/{id}` | 更新数据 |
| DELETE | `/api/{module}/{id}` | 删除数据 |

### 前端调用示例

```javascript
// 创建
await window.lifeManager.create({
  title: "美好的一天",
  content: "今天天气真好！",
  mood: "😊",
  tags: ["晴天"]
});

// 获取所有
const moments = await window.lifeManager.getAll();

// 更新
await window.lifeManager.update(id, { title: "更新后的标题" });

// 删除
await window.lifeManager.delete(id);
```

## 各模块数据结构

### 博客文章
```typescript
{
  title: string;
  content: string;
  excerpt?: string;
  category?: string;  // 默认: "生活"
  coverImage?: string; // 默认: "📝"
  mood?: string;       // 默认: "neutral"
  tags?: string[];
}
```

### 生活瞬间
```typescript
{
  title: string;
  content: string;
  date?: string;   // 默认: 今天
  mood?: string;   // 默认: "😊"
  tags?: string[];
}
```

### 哲学思考
```typescript
{
  quote: string;
  content: string;
  author?: string;    // 默认: "未知"
  category?: string;  // 默认: "未分类"
  tags?: string[];
}
```

### 吐槽
```typescript
{
  title: string;
  content: string;
  angerLevel?: number; // 1-10, 默认: 5
  category?: string;   // 默认: "其他"
}
```

### 学习项目
```typescript
{
  title: string;
  description?: string;
  status?: '计划中' | '进行中' | '已完成' | '暂停'; // 默认: "计划中"
  progress?: number;  // 0-100, 默认: 0
  startDate?: string;
  endDate?: string;
  resources?: string[];
}
```

### 代码项目
```typescript
{
  title: string;
  description: string;
  coverEmoji?: string;  // 默认: "💻"
  status?: 'Concept' | 'WIP' | 'Beta' | 'Stable' | 'Archived'; // 默认: "WIP"
  technologies?: string[];
  githubUrl?: string;
  demoUrl?: string;
}
```

## IndexedDB vs localStorage

| 特性 | localStorage | IndexedDB |
|------|--------------|-----------|
| 容量 | ~5-10 MB | 50MB ~ 几 GB |
| 性能 | 同步，阻塞主线程 | 异步，不阻塞 |
| 数据类型 | 仅字符串 | 对象、数组、二进制等 |
| 索引 | 无 | 支持索引查询 |
| 事务 | 无 | 支持事务 |

## 查看数据库

打开浏览器开发者工具（F12）：

1. **Application 标签** → **Storage** → **IndexedDB** → `WarmBlogDB`
2. 可以看到所有对象存储和数据

## 存储统计

在浏览器控制台运行以下命令查看存储使用情况：

```javascript
// 查看存储统计
import { getStorageStats } from './src/lib/utils/storage';
const stats = await getStorageStats();
console.log(`总容量: ${(stats.total / 1024 / 1024).toFixed(2)} MB`);
console.table(stats.byStore);
```

## 注意事项

1. **数据持久化**: 数据存储在浏览器 IndexedDB，清除浏览器数据会丢失
2. **容量限制**: IndexedDB 容量远大于 localStorage，但仍有限制
3. **服务端模式**: Astro 配置为 `output: 'server'`，支持动态 API 路由
4. **自动迁移**: localStorage 数据会自动迁移到 IndexedDB

## 清理旧文件

重构后可以删除以下文件：
```bash
rm src/lib/db.ts          # 旧的 MySQL 连接
rm schema.sql              # MySQL 数据库结构
# npm uninstall mysql2     # 卸载 mysql2 依赖（可选）
```

祝使用愉快！🎉
