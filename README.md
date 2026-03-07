# AI 读者评测系统（novel-eval）

模拟 100~1000 个 AI 读者为网文开篇打分，生成包含阅读行为分析、共识分歧分析、市场预测、改稿建议的完整评测报告。

## 技术栈

- **前端**：Next.js 15 + React 19 + Ant Design 5
- **后端**：Next.js API Routes + BullMQ
- **数据库**：MySQL 8.0 + Redis 7
- **AI 模型**：DeepSeek V3 / 通义千问 Qwen / 智谱 GLM（三模型均衡混用）

---

## 环境要求

- Node.js >= 20
- pnpm
- Docker + Docker Compose

---

## 快速启动

### 1. 启动 Docker 服务（MySQL + Redis）

```bash
open -a Docker
# 启动（后台运行）
docker compose up -d

# 停止服务（数据保留）
docker compose down

# 查看运行状态
docker compose ps

# 查看日志（如果启动有问题）
docker compose logs -f
```

启动后会创建：

| 服务 | 端口 | 说明 |
|------|------|------|
| MySQL | 3306 | 用户 root，密码 root123，数据库 novel_eval |
| Redis | 6379 | 无密码（本地开发） |

数据通过 Docker Volume 持久化，容器删除后数据不丢失。

### 2. 配置环境变量

复制 `.env` 文件并填入你的 API Key：

```bash
# .env 已创建好模板，直接编辑填入即可
# 至少需要填入以下三个 Key 才能运行：
# - DEEPSEEK_API_KEY
# - DASHSCOPE_API_KEY
# - ZHIPU_API_KEY
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client 并执行数据库迁移
pnpm prisma migrate dev
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开 http://localhost:3000 查看。

---

## Docker 常用命令

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务（数据保留）
docker compose down

# 停止并删除数据卷（⚠️ 会清空所有数据）
docker compose down -v

# 重启某个服务
docker compose restart mysql
docker compose restart redis

# 查看 MySQL 日志
docker compose logs -f mysql

# 查看 Redis 日志
docker compose logs -f redis

# 进入 MySQL 命令行
docker compose exec mysql mysql -uroot -proot123 novel_eval

# 进入 Redis 命令行
docker compose exec redis redis-cli

# 查看数据卷占用空间
docker volume ls
docker system df
```

---

## 项目结构

```
novel-eval/
├── src/
│   ├── app/                  # Next.js 页面和 API
│   ├── lib/                  # 核心业务逻辑
│   │   ├── llm/              # LLM 统一调用层（三模型）
│   │   ├── agents/           # 多 Agent 系统
│   │   ├── evaluation/       # 评测引擎
│   │   └── queue/            # BullMQ 任务队列
│   ├── components/           # UI 组件
│   └── types/                # 类型定义
├── prisma/                   # 数据库 Schema
├── data/personas/            # 预生成读者人设
├── docker-compose.yml        # 本地 MySQL + Redis
├── .env                      # 环境变量（不提交到 Git）
└── package.json
```
