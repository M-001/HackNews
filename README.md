# 中文版Hacker News

这是一个使用Next.js开发的中文版Hacker News，它自动获取Hacker News的内容并使用OpenRouter API通过DeepSeek模型进行翻译。

## 功能特点

- 自动获取Hacker News的热门、最新和问答内容
- 使用OpenRouter API (DeepSeek模型)自动翻译标题和内容
- 响应式设计，适配各种设备
- 支持查看原文对照翻译
- 定时更新内容

## 技术栈

- **框架和UI**：
  - Next.js 15 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui 组件库
  - Lucide Icons 图标库

- **数据和API**：
  - Hacker News官方API
  - PostgreSQL数据库
  - Prisma ORM
  - OpenRouter API (DeepSeek模型)

- **部署方案**：
  - Vercel托管
  - Vercel Postgres数据库
  - Vercel Cron Jobs定时更新

## 快速开始

### 环境准备

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量：

创建`.env`文件并添加以下内容：

```
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/hack_news"

# OpenRouter API 配置
OPENROUTER_API_KEY="your-api-key-here"

# Hacker News API基础URL
HACKER_NEWS_API_URL="https://hacker-news.firebaseio.com/v0"

# 环境变量
NODE_ENV="development"
```

3. 初始化数据库：

```bash
npx prisma db push
```

4. 初始化数据：

```bash
npm run init-data
```

### 开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到Vercel

1. 在Vercel中创建新项目
2. 设置环境变量 (包括 `OPENROUTER_API_KEY`)
3. 添加Vercel Postgres数据库
4. 设置Vercel Cron Job (通过`vercel.json`配置文件，每3小时调用一次 `/api/cron`)

## 贡献

欢迎提交Issue和Pull Request来完善这个项目！

## 许可

MIT
