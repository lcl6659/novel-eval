# 网文开篇测评系统 — 项目设计文档

## 一、项目概述

**核心理念**：作者提交网文开篇（5,000~10,000 字），系统调度 1,000 个 AI 模拟读者进行阅读与评价，最终由 AI 汇总生成综合评分及改进建议。

**目标市场**：中国网文作者（起点/番茄/七猫等平台）

**项目形式**：Web 应用（响应式，兼顾移动端）

---

## 二、可行性分析

### 2.1 技术可行性 ✅ 可行

| 能力 | 评估 | 说明 |
|------|------|------|
| AI 模拟读者 | ✅ 成熟 | 国产 LLM（DeepSeek / 通义千问 / 智谱 GLM 等）完全有能力扮演特定人设的读者并给出有逻辑的评价 |
| 人设多样性 | ✅ 可行 | 通过组合维度（年龄×性别×阅读偏好×性格×阅读经验）可生成远超 1,000 的独立人设 |
| 并发处理 | ✅ 可行 | 国产模型 API 支持并发调用，配合队列系统可在分钟级完成 1,000 次调用 |
| 结果汇总 | ✅ 可行 | 先分组摘要再总汇总的层级聚合策略，可规避单次上下文长度限制 |

### 2.2 成本可行性 ⚠️ 需要优化策略

这是本项目最核心的挑战。以下是基于国产模型的详细成本估算：

**单次评测成本估算（1,000 读者）：**

| 模型 | 输入价格 (¥/百万token) | 输出价格 (¥/百万token) | 1,000 次总输入 (4M) | 1,000 次总输出 (400K) | 单次评测总费用 |
|------|----------------------|----------------------|--------------------|--------------------|---------------|
| DeepSeek V3 | 1 | 2 | ¥4 | ¥0.8 | **~¥5** |
| 通义千问 Qwen-Plus | 0.8 | 2 | ¥3.2 | ¥0.8 | **~¥4** |
| 智谱 GLM-4-Flash | 0 (免费) | 0 (免费) | ¥0 | ¥0 | **~¥0** |
| 月之暗面 Moonshot-v1-8k | 12 | 12 | ¥48 | ¥4.8 | **~¥53** |
| 百川 Baichuan4-Air | 0.98 | 0.98 | ¥3.9 | ¥0.4 | **~¥4.3** |

> 注：输入含小说文本（~3,000 token）+ 预生成的人设 prompt（~500 token）+ 评价指令（~500 token）；输出为评分+短评（~400 token）。汇总阶段额外费用约 ¥0.5~¥2。
> 价格数据为 2025 年参考价，实际以各平台最新定价为准。

**结论**：使用 DeepSeek V3 / 通义千问 / 百川 等性价比模型，单次完整评测成本约 **¥4~¥6**，商业上完全可行。智谱 GLM-4-Flash 免费额度甚至可以做零成本评测。

### 2.3 效果可行性 ⚠️ 核心质疑点

**关键问题：1,000 个读者 vs 更少但更精细的读者？**

| 维度 | 分析 |
|------|------|
| 统计学角度 | 调查研究中，30+ 样本即可近似正态分布，100~200 样本已非常可靠。1,000 个读者在统计上存在过度采样的可能 |
| 边际收益 | 超过 100 个多样化读者后，新增读者带来的信息增量急剧下降 |
| 噪音问题 | LLM 扮演不同人设时，评价的差异性可能不如预期——核心 LLM 的"审美偏好"会渗透到所有人设中 |
| 营销价值 | "1,000 位读者为你的小说打分"极具传播力和说服力 |

**推荐策略：分层评测**

```
┌─────────────────────────────────────────┐
│  快速评测（免费/低价）：30 位代表性读者   │  ← 覆盖核心维度，秒级出结果
├─────────────────────────────────────────┤
│  标准评测（付费）：100 位多样化读者       │  ← 统计可靠，分钟级出结果
├─────────────────────────────────────────┤
│  深度评测（高级）：1,000 位全谱读者       │  ← 完整覆盖，差异化卖点
└─────────────────────────────────────────┘
```

### 2.4 市场可行性 ✅ 有需求

- 网文市场庞大（起点/番茄/七猫等平台数百万作者）
- 开篇质量直接决定读者留存，作者对此有强烈的优化需求
- 现有方案：人工互评（慢、主观）、编辑反馈（难获取）、无专业工具
- **竞争壁垒**：读者人设库 + 评价 prompt 工程 + 汇总分析质量

---

## 三、项目形式：Web 应用

| 对比维度 | Web 应用 | 桌面工具 |
|----------|---------|---------|
| 用户门槛 | 零安装，浏览器打开即用 | 需下载安装 |
| 跨平台 | 天然跨平台 | 需多平台适配 |
| 异步处理 | 提交后可关闭页面，回来查看结果 | 需保持运行 |
| 分享传播 | 结果页可分享链接，利于口碑传播 | 不便分享 |
| 更新维护 | 服务端更新，用户无感知 | 需用户手动更新 |
| 商业化 | 微信支付集成方便，SaaS 模式自然 | 授权管理复杂 |

**结论**：Web 应用在几乎所有维度上更适合本项目。数据安全顾虑可通过隐私政策 + 评测后自动清除原文来解决。

---

## 四、系统架构设计

### 4.1 整体架构

```
┌───────────────────────────────────────────────────────────┐
│                Frontend (Next.js + Ant Design)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ 提交页面  │  │ 进度展示  │  │ 结果报告  │  │ 历史记录  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────┬───────────────────────────────────┘
                        │ Next.js API Routes + SSE (实时进度)
┌───────────────────────┴───────────────────────────────────┐
│               Backend (Next.js API Routes)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ 评测调度引擎  │  │ 预置人设库    │  │  汇总分析引擎    │ │
│  └──────┬───────┘  │ (1000条prompt)│  └──────────────────┘ │
│         │          └──────────────┘                         │
│  ┌──────┴───────┐                                          │
│  │  BullMQ 队列  │  ← Redis 作为队列后端                    │
│  │  并发控制     │                                          │
│  │  重试机制     │                                          │
│  └──────┬───────┘                                          │
└─────────┼──────────────────────────────────────────────────┘
          │
┌─────────┴──────────────────────────────────────────────────┐
│                   国产 LLM API Layer                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ DeepSeek   │  │ 通义千问    │  │ 智谱 GLM   │           │
│  │  (主力)     │  │  (备选)     │  │  (备选)    │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│  ┌────────────┐  ┌────────────┐                            │
│  │ 百川智能    │  │ 月之暗面    │                            │
│  │  (备选)     │  │  (备选)     │                            │
│  └────────────┘  └────────────┘                            │
└────────────────────────────────────────────────────────────┘
          │
┌─────────┴──────────────────────────────────────────────────┐
│                    数据层（国内云服务）                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ MySQL     │  │  Redis   │  │ 阿里云OSS │                 │
│  │(阿里云RDS)│  │(阿里云)   │  │ 报告存储  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└────────────────────────────────────────────────────────────┘
```

### 4.2 核心流程

```
用户提交小说文本
      │
      ▼
  ① 文本预处理（字数校验、敏感词检测、分段）
      │
      ▼
  ② 读者分配（从预置的 1,000 条人设 prompt 中按评测等级抽取 N 条）
      │
      ▼
  ③ 并发评测（BullMQ 队列分发，每个读者独立调用 LLM）
      │                                    ┌─→ 读者 1 评价
      │                                    ├─→ 读者 2 评价
      ├─→ 批次 1（50 个并发）──────────────┤    ...
      ├─→ 批次 2（50 个并发）              └─→ 读者 50 评价
      ├─→ ...
      └─→ 批次 N
      │
      ▼
  ④ 分组汇总（按读者类型分组，每组生成小结）
      │
      ▼
  ⑤ 总汇总（AI 综合所有分组小结，生成最终报告）
      │
      ▼
  ⑥ 报告生成（评分 + 多维度分析 + 改进建议 + 可视化图表）
      │
      ▼
  用户查看结果报告
```

---

## 五、核心模块设计

### 5.1 读者人设系统（预生成方案）

#### 设计原则

**所有 1,000 个读者人设的完整 prompt 在项目初始化时一次性生成并持久化存储**，评测时直接从数据库读取，不做实时拼装。

好处：
- 避免每次评测重复拼装 prompt，节省时间
- 避免动态拼装消耗的额外 token
- 人设 prompt 经过人工审核和微调，质量更高
- 每个人设有独特的"语气"和"口头禅"，不是简单的维度拼接

#### 人设维度

| 维度 | 取值示例 | 数量 |
|------|---------|------|
| 年龄段 | 15-18 / 19-25 / 26-35 / 36-45 / 46+ | 5 |
| 性别 | 男 / 女 / 不限 | 3 |
| 阅读经验 | 新手（<1年）/ 入门（1-3年）/ 资深（3-7年）/ 老书虫（7年+）| 4 |
| 偏好类型 | 玄幻 / 都市 / 仙侠 / 科幻 / 言情 / 悬疑 / 历史 / 游戏 / 轻小说 / 现实 | 10 |
| 阅读性格 | 挑剔型 / 宽容型 / 分析型 / 感性型 / 速读型 | 5 |
| 阅读动机 | 打发时间 / 追求爽感 / 欣赏文笔 / 寻找共鸣 / 学习写作 | 5 |

**组合池**：5 × 3 × 4 × 10 × 5 × 5 = **15,000 种**，从中精选 1,000 个代表性组合。

#### 预生成流程

```
Step 1: 定义 1,000 个维度组合（确保覆盖均匀、无偏差）
         │
         ▼
Step 2: 使用高质量 LLM（如 DeepSeek R1）为每个组合生成完整的人设 prompt
        要求：不是简单的维度拼接，而是有个性化的背景故事、语气特征、评判标准
         │
         ▼
Step 3: 人工审核 + 微调（确保人设差异足够大、评价角度确实不同）
         │
         ▼
Step 4: 存入数据库 reader_personas 表，每条记录包含：
        - 维度标签（用于分组汇总）
        - 完整 prompt（直接发送给 LLM，无需二次处理）
        - 分组标签（用于汇总阶段的分组依据）
```

#### 预生成的人设 Prompt 示例

**读者 R0042 — 完整 prompt（存储于数据库，评测时直接使用）：**

```
【你的身份】
你叫"老陈"，35 岁，在一家互联网公司做产品经理。你从大学开始看网文，
至今已经看了 12 年，书龄算很长的了。你主要看玄幻和仙侠类，偶尔也会
翻翻都市文换换口味。

【你的阅读习惯】
你每天通勤地铁上看 1-2 小时网文，属于稳定的日更追书党。你追过上百本书，
养成了很强的鉴别力——开篇 3000 字之内如果抓不住你，你就会划走。
你对"金手指"设定要求很高，讨厌烂大街的系统流，喜欢有新意的设定。
你对节奏感非常敏感，受不了前三章还在铺垫身世的写法。

【你的评判风格】
你是个比较挑剔但公平的读者。你会直说问题，但也会认可做得好的地方。
你经常在起点书评区留言，风格就是那种"老书虫点评"的感觉。
你评分偏严格，一般的书在你这里也就 6-7 分。

【任务】
请阅读以下网文开篇内容，以你（老陈）的身份和阅读习惯进行评价。
你的评价应该体现你 12 年书龄的鉴别力和挑剔但公平的风格。
```

**读者 R0217 — 完整 prompt（对比不同风格）：**

```
【你的身份】
你叫"小鹿"，19 岁，大一女生，学的是中文系。你从高中开始接触网文，
主要看言情和轻小说，书龄大概 3 年左右。

【你的阅读习惯】
你每天睡前会花 30-60 分钟看小说，属于沉浸式阅读——喜欢被故事带着走，
特别容易被人物的情感打动。你选书主要看封面和简介，如果开头氛围感好、
男女主的初印象有"磕点"，你就会追下去。
你对设定不太在意，更看重人物之间的化学反应和情感张力。

【你的评判风格】
你是感性型读者，评价主要看"感觉对不对"。你不太会分析结构和技巧，
但对"氛围感"和"代入感"非常敏感。如果你觉得故事无聊，你会很直接地说
"看不下去"；但如果你被打动了，评价会非常热情。
你评分偏感性，喜欢的书可以给到 9 分以上。

【任务】
请阅读以下网文开篇内容，以你（小鹿）的身份和阅读习惯进行评价。
你的评价应该体现你作为感性型年轻读者的真实反应。
```

### 5.2 评价体系

**每位读者的评价输出（结构化 JSON）：**

```json
{
  "reader_id": "R0042",
  "scores": {
    "hook": 7,
    "character": 6,
    "worldbuilding": 8,
    "writing": 7,
    "pacing": 5,
    "immersion": 6,
    "overall": 6.5
  },
  "continue_reading": true,
  "drop_point": null,
  "one_line_comment": "设定有新意但节奏太慢，前 2000 字没有冲突",
  "detailed_comment": "..."
}
```

**评分维度说明：**

| 字段 | 中文名 | 评分范围 | 说明 |
|------|--------|---------|------|
| hook | 开篇吸引力 | 1-10 | 前 1000 字能否抓住注意力 |
| character | 人物塑造 | 1-10 | 主角是否有辨识度和吸引力 |
| worldbuilding | 世界观/设定 | 1-10 | 设定是否有新意、是否清晰 |
| writing | 文笔质量 | 1-10 | 文字功底、描写能力 |
| pacing | 节奏感 | 1-10 | 信息密度、冲突推进速度 |
| immersion | 代入感 | 1-10 | 是否让人有"身临其境"的感觉 |
| overall | 综合印象 | 1-10 | 总体评价 |
| continue_reading | 继续阅读意愿 | 是/否 | 是否愿意继续追读 |
| drop_point | 弃读点 | 段落位置/null | 如果弃读，在哪里失去兴趣 |

### 5.3 汇总分析引擎

**两阶段汇总：**

**阶段一：分组小结**
- 按读者类型（偏好类型 × 阅读性格）分成 ~20 组
- 每组 ~50 个读者的评价 → 一个分组小结
- 输出：该类型读者的共性反馈、平均分、关键意见

**阶段二：总汇总**
- 输入：~20 个分组小结
- 输出最终报告：

```
📊 综合评分：7.2 / 10

📈 各维度得分：
  开篇吸引力：8.1  ████████░░
  人物塑造：  6.5  ██████▌░░░
  世界观设定：7.8  ███████▊░░
  文笔质量：  7.0  ███████░░░
  节奏感：    5.2  █████▏░░░░
  代入感：    7.5  ███████▌░░

📖 读者留存率：73%（730/1000 位读者愿意继续阅读）

🎯 读者画像分析：
  - 玄幻爱好者（评分 8.1）：对金手指设定评价较高
  - 言情爱好者（评分 5.3）：认为感情线薄弱
  - 挑剔型读者（评分 6.0）：指出节奏问题
  - 新手读者（评分 8.5）：整体好评

💡 改进建议（按优先级）：
  1. 【节奏】前 2000 字缺少核心冲突，建议前移第一个小高潮
  2. 【人物】主角性格特征不够鲜明，建议增加标志性行为
  3. 【代入】开头信息量过大，建议减少设定介绍，改用"展示"代替"叙述"
```

### 5.4 实时进度系统

通过 Server-Sent Events (SSE) 实时推送评测进度：

```
评测进行中...
  ✅ 文本预处理完成
  ✅ 已分配 100 位读者
  📖 读者评测中... 67/100 [██████████████████░░░░░░░░] 67%
     ├─ 玄幻类读者 (15/20) 评测中...
     ├─ 都市类读者 (12/15) 评测中...
     └─ 言情类读者 (10/10) ✅ 完成
  ⏳ 汇总分析... 等待中
  ⏳ 报告生成... 等待中
  预计剩余时间：45 秒
```

---

## 六、技术选型

### 6.1 确定技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| **前端框架** | Next.js 14+ (App Router) | 全栈统一，SSR/SSG 支持 |
| **UI 组件库** | Ant Design 5.x | 阿里出品，中文生态完善，企业级组件丰富 |
| **样式方案** | Ant Design 内置 + CSS Modules | 配合 Ant Design 的 ConfigProvider 主题定制 |
| **图表可视化** | @ant-design/charts 或 ECharts | 评测报告的可视化图表 |
| **后端** | Next.js API Routes (Route Handlers) | 与前端同项目，无需独立后端服务 |
| **任务队列** | BullMQ | 管理大量并发 LLM 调用，支持重试、优先级、进度追踪 |
| **数据库** | MySQL 8.0（阿里云 RDS / 腾讯云 CDB） | 国内云服务，稳定可靠，团队熟悉度高 |
| **ORM** | Prisma | 类型安全，支持 MySQL，迁移管理方便 |
| **缓存/队列后端** | Redis（阿里云 Redis / 腾讯云 Redis） | BullMQ 后端 + 评测进度缓存 + 会话管理 |
| **对象存储** | 阿里云 OSS / 腾讯云 COS | 存储生成的评测报告（PDF/图片） |
| **LLM（主力）** | DeepSeek V3 | 性价比最优，中文理解能力强 |
| **LLM（备选）** | 通义千问 Qwen-Plus / 智谱 GLM-4 / 百川 Baichuan4 | 多模型冗余，防单点故障 |
| **实时通信** | Server-Sent Events (SSE) | 单向推送评测进度，比 WebSocket 更轻量 |
| **用户认证** | 微信登录 + 手机号登录 | 符合国内用户习惯 |
| **支付** | 微信支付（JSAPI / Native） | 当前唯一支付方式 |
| **部署** | 阿里云 ECS / 腾讯云 CVM + Docker | 国内服务器，合规无延迟 |
| **域名/备案** | 国内备案域名 | 必须完成 ICP 备案才可上线 |

### 6.2 项目结构

```
novel-eval/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 全局布局（Ant Design ConfigProvider）
│   │   ├── page.tsx                  # 首页
│   │   ├── submit/                   # 提交评测页
│   │   ├── progress/[id]/            # 评测进度页
│   │   ├── report/[id]/             # 评测报告页
│   │   ├── history/                  # 历史记录页
│   │   ├── pricing/                  # 定价页
│   │   ├── login/                    # 登录页
│   │   └── api/                      # API Route Handlers
│   │       ├── evaluation/
│   │       │   ├── submit/route.ts   # 提交评测
│   │       │   ├── progress/route.ts # SSE 进度推送
│   │       │   └── report/route.ts   # 获取报告
│   │       ├── auth/
│   │       │   ├── wechat/route.ts   # 微信登录回调
│   │       │   └── phone/route.ts    # 手机号登录
│   │       └── payment/
│   │           ├── create/route.ts   # 创建支付订单
│   │           └── callback/route.ts # 微信支付回调
│   ├── lib/
│   │   ├── llm/
│   │   │   ├── client.ts            # LLM 统一调用接口
│   │   │   ├── deepseek.ts          # DeepSeek 适配
│   │   │   ├── qwen.ts              # 通义千问适配
│   │   │   ├── zhipu.ts             # 智谱 GLM 适配
│   │   │   └── baichuan.ts          # 百川适配
│   │   ├── evaluation/
│   │   │   ├── engine.ts            # 评测调度引擎
│   │   │   ├── aggregator.ts        # 两阶段汇总引擎
│   │   │   └── report.ts            # 报告生成
│   │   ├── queue/
│   │   │   ├── worker.ts            # BullMQ Worker
│   │   │   └── jobs.ts              # 任务定义
│   │   ├── payment/
│   │   │   └── wechat.ts            # 微信支付封装
│   │   └── db/
│   │       └── prisma.ts            # Prisma Client 单例
│   ├── components/                   # Ant Design 组合组件
│   │   ├── SubmitForm.tsx            # 文本提交表单
│   │   ├── ProgressCard.tsx          # 评测进度卡片
│   │   ├── ReportView.tsx            # 报告展示组件
│   │   ├── ScoreRadar.tsx            # 雷达图评分
│   │   └── ReaderGroupChart.tsx      # 读者分组图表
│   └── types/
│       └── index.ts                  # 全局类型定义
├── prisma/
│   ├── schema.prisma                 # 数据库 Schema
│   └── seed.ts                       # 种子数据（1000 个读者人设）
├── data/
│   └── personas/                     # 预生成的 1000 个人设 prompt
│       ├── personas.json             # 完整人设数据
│       └── generate.ts               # 人设生成脚本
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
└── docker-compose.yml               # 本地开发 MySQL + Redis
```

### 6.3 LLM 统一调用层设计

为支持多个国产模型的无缝切换，封装统一的 LLM 调用接口：

```typescript
// lib/llm/client.ts 接口设计
interface LLMRequest {
  model: 'deepseek-v3' | 'qwen-plus' | 'glm-4-flash' | 'baichuan4-air';
  systemPrompt: string;   // 预生成的读者人设 prompt
  userPrompt: string;     // 小说文本 + 评价指令
  temperature?: number;   // 控制评价多样性 (建议 0.7-0.9)
  responseFormat?: 'json'; // 强制 JSON 输出
}

interface LLMResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
  latencyMs: number;
}
```

所有国产模型都兼容 OpenAI Chat Completions API 格式，适配层非常薄。

---

## 七、数据模型 (Prisma Schema)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ========== 用户相关 ==========

model User {
  id          String   @id @default(cuid())
  phone       String?  @unique
  wechatOpenId String? @unique @map("wechat_open_id")
  nickname    String?
  avatar      String?
  credits     Int      @default(0)           // 剩余评测次数
  plan        PlanType @default(FREE)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  evaluations Evaluation[]
  orders      Order[]

  @@map("users")
}

enum PlanType {
  FREE
  STANDARD
  PREMIUM
  MONTHLY
}

// ========== 读者人设（预生成，1000条） ==========

model ReaderPersona {
  id              String  @id                  // R0001 ~ R1000
  name            String                       // 人设昵称，如"老陈"
  ageGroup        String  @map("age_group")    // 15-18 / 19-25 / ...
  gender          String                       // 男 / 女 / 不限
  experience      String                       // 新手 / 入门 / 资深 / 老书虫
  genrePreference String  @map("genre_pref")   // 玄幻 / 都市 / ...
  personality     String                       // 挑剔型 / 宽容型 / ...
  motivation      String                       // 打发时间 / 追求爽感 / ...
  fullPrompt      String  @db.Text             // 完整的人设 prompt（直接发送给 LLM）
  groupTag        String  @map("group_tag")    // 分组标签，用于汇总阶段

  reviews         ReaderReview[]

  @@index([genrePreference])
  @@index([personality])
  @@index([groupTag])
  @@map("reader_personas")
}

// ========== 评测相关 ==========

model Evaluation {
  id          String           @id @default(cuid())
  userId      String           @map("user_id")
  title       String                              // 小说标题
  content     String           @db.MediumText     // 小说内容（5000-10000字）
  wordCount   Int              @map("word_count")
  tier        EvalTier                             // 评测等级
  status      EvalStatus       @default(PENDING)
  readerCount Int              @map("reader_count") // 实际参与评测的读者数
  model       String           @default("deepseek-v3") // 使用的 LLM 模型
  progress    Int              @default(0)         // 进度百分比 0-100
  finalReport Json?            @map("final_report") // 最终汇总报告
  totalCost   Decimal?         @map("total_cost") @db.Decimal(10,4) // 本次评测实际成本
  startedAt   DateTime?        @map("started_at")
  completedAt DateTime?        @map("completed_at")
  createdAt   DateTime         @default(now()) @map("created_at")

  user        User             @relation(fields: [userId], references: [id])
  reviews     ReaderReview[]

  @@index([userId])
  @@index([status])
  @@map("evaluations")
}

enum EvalTier {
  QUICK      // 30 读者
  STANDARD   // 100 读者
  DEEP       // 1000 读者
}

enum EvalStatus {
  PENDING
  PROCESSING
  AGGREGATING
  COMPLETED
  FAILED
}

// ========== 单个读者评价 ==========

model ReaderReview {
  id              String   @id @default(cuid())
  evaluationId    String   @map("evaluation_id")
  personaId       String   @map("persona_id")

  // 评分（1-10）
  scoreHook       Float    @map("score_hook")
  scoreCharacter  Float    @map("score_character")
  scoreWorld      Float    @map("score_world")
  scoreWriting    Float    @map("score_writing")
  scorePacing     Float    @map("score_pacing")
  scoreImmersion  Float    @map("score_immersion")
  scoreOverall    Float    @map("score_overall")

  continueReading Boolean  @map("continue_reading")
  dropPoint       String?  @map("drop_point")
  oneLineComment  String   @map("one_line_comment") @db.VarChar(500)
  detailedComment String   @map("detailed_comment") @db.Text

  rawResponse     String?  @map("raw_response") @db.Text  // LLM 原始返回
  tokenUsage      Json?    @map("token_usage")             // Token 消耗记录
  latencyMs       Int?     @map("latency_ms")              // 响应耗时
  createdAt       DateTime @default(now()) @map("created_at")

  evaluation      Evaluation    @relation(fields: [evaluationId], references: [id])
  persona         ReaderPersona @relation(fields: [personaId], references: [id])

  @@index([evaluationId])
  @@index([personaId])
  @@map("reader_reviews")
}

// ========== 支付订单 ==========

model Order {
  id              String      @id @default(cuid())
  userId          String      @map("user_id")
  amount          Decimal     @db.Decimal(10,2)    // 支付金额（元）
  product         String                            // 商品描述
  tier            EvalTier?                          // 关联的评测等级
  wechatTradeNo   String?     @unique @map("wechat_trade_no") // 微信支付交易号
  status          OrderStatus @default(PENDING)
  paidAt          DateTime?   @map("paid_at")
  createdAt       DateTime    @default(now()) @map("created_at")

  user            User        @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

---

## 八、成本与定价模型

### 8.1 运营成本（基于 DeepSeek V3）

| 评测等级 | 读者数 | LLM 成本/次 | 汇总成本/次 | 总成本/次 |
|---------|--------|------------|------------|----------|
| 快速评测 | 30 | ~¥0.15 | ~¥0.10 | **~¥0.3** |
| 标准评测 | 100 | ~¥0.50 | ~¥0.20 | **~¥0.7** |
| 深度评测 | 1,000 | ~¥5.0 | ~¥1.0 | **~¥6.0** |

### 8.2 建议定价

| 等级 | 定价 | 成本 | 毛利率 |
|------|------|------|--------|
| 快速评测 | 免费（每日 1 次） | ¥0.3 | 用于获客 |
| 标准评测 | ¥9.9 / 次 | ¥0.7 | **93%** |
| 深度评测 | ¥29.9 / 次 | ¥6.0 | **80%** |
| 包月（30 次标准） | ¥99 / 月 | ¥21 | **79%** |

### 8.3 服务器成本预估（月）

| 资源 | 规格 | 月费 |
|------|------|------|
| 阿里云 ECS | 2C4G | ~¥100 |
| 阿里云 RDS MySQL | 1C2G 基础版 | ~¥80 |
| 阿里云 Redis | 1G 标准版 | ~¥60 |
| 阿里云 OSS | 按量 | ~¥10 |
| 域名 + 备案 | .com | ~¥50/年 |
| **合计** | | **~¥250/月** |

---

## 九、微信支付集成方案

### 9.1 支付流程

```
用户选择评测等级
      │
      ▼
前端调用 /api/payment/create
      │
      ▼
后端创建微信支付订单（JSAPI/Native）
      │
      ▼
返回支付参数 → 前端唤起微信支付
      │
      ▼
用户完成支付
      │
      ▼
微信回调 /api/payment/callback
      │
      ▼
验签 → 更新订单状态 → 增加用户 credits
      │
      ▼
用户可使用 credits 发起评测
```

### 9.2 接入要求

- 微信商户号（需企业资质）
- 已备案的域名
- HTTPS 证书（Let's Encrypt 免费）
- 如果做微信内 H5 支付，还需微信公众号

### 9.3 替代方案（个人开发者）

如尚无企业资质，初期可考虑：
- 面对面收款码（手动确认，适合内测）
- 第三方聚合支付平台（如虎皮椒等，个人可接入）
- 先做免费版本，积累用户后再接入正式支付

---

## 十、开发路线图

### Phase 1：MVP（2~3 周）

核心目标：**跑通完整评测流程，可以实际使用**

- [ ] 项目初始化（Next.js + Ant Design + Prisma + MySQL）
- [ ] 预生成 1,000 个读者人设 prompt 并入库
- [ ] 基础 Web UI（提交页 + 结果页）
- [ ] LLM 调用层（先接 DeepSeek V3 一个模型）
- [ ] 快速评测功能（30 个读者，同步 Promise.allSettled）
- [ ] 基础两阶段汇总
- [ ] 评测报告展示（Ant Design 表格 + 简单图表）
- [ ] Docker Compose 本地开发环境
- [ ] 部署至阿里云 ECS

### Phase 2：核心体验（2~3 周）

- [ ] BullMQ 任务队列（支持 100/1000 读者并发）
- [ ] SSE 实时进度推送
- [ ] 三档评测等级完整实现
- [ ] 可视化评测报告（雷达图、分组柱状图、留存漏斗）
- [ ] 用户登录（手机号 + 微信登录）
- [ ] 评测历史记录

### Phase 3：商业化（2~3 周）

- [ ] 微信支付集成
- [ ] Credits 充值与消费体系
- [ ] 多模型支持（通义千问 / 智谱 / 百川 备选切换）
- [ ] 评测报告分享（生成分享链接/图片）
- [ ] 移动端适配优化

### Phase 4：增强（持续迭代）

- [ ] 对比评测（提交修改版 vs 原版）
- [ ] 特定类型深度分析（如玄幻专项评测）
- [ ] 读者人设自定义（用户指定目标读者群体）
- [ ] API 开放给第三方平台
- [ ] 写作建议 AI 助手（基于评测结果的改写建议）

---

## 十一、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| LLM 评价同质化（不同人设给出相似评价） | 降低产品价值 | 人设 prompt 预生成时强化差异；引入 temperature 调节（0.7-0.9）；混合使用多个模型 |
| 国产模型 API 不稳定 | 服务中断 | 多模型备选自动切换；BullMQ 内置重试；优雅降级 |
| 小说内容泄露/合规风险 | 用户信任 / 法律 | 评测后自动删除原文；隐私协议；敏感内容审核；ICP 备案 |
| 微信支付资质问题 | 无法商业化 | 初期用免费模式验证需求；使用第三方聚合支付过渡 |
| 用户对 AI 评价不信任 | 转化率低 | 提供免费体验；展示评价逻辑透明度；引入"已知好书"的标杆评测 |
| ICP 备案周期长 | 延迟上线 | 尽早启动备案流程；备案期间用 IP 直接访问做内测 |

---

## 十二、结论

**项目可行性：✅ 可行，且有明确的市场需求和技术路径。**

核心优势：
1. **概念吸引力强**——"1,000 位读者为你的开篇打分"极具营销记忆点
2. **技术完全可实现**——国产 LLM 能力成熟，成本可控（DeepSeek V3 单次深度评测仅 ¥6）
3. **商业模式清晰**——SaaS 按次付费，毛利率 80%+
4. **壁垒可积累**——1,000 个精心设计的预置人设 prompt 是核心资产

关键决策总结：
- **项目形式**：Web 应用
- **技术栈**：Next.js 全栈 + Ant Design + MySQL + Redis
- **部署**：国内云服务器（阿里云/腾讯云）
- **LLM**：DeepSeek V3 主力 + 通义千问/智谱/百川 备选
- **支付**：微信支付
- **人设方案**：预生成 1,000 个完整 prompt，存入数据库直接使用

**建议立即启动 Phase 1 MVP 开发。**
