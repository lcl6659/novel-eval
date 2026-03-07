# 网文开篇测评系统 — 项目设计文档

## 一、项目概述

**核心理念**：作者提交网文开篇（5,000~~10,000 字），系统调度 100~~1,000 个 AI 模拟读者进行阅读与评价，通过**多 Agent 协作架构**生成包含阅读行为模拟、共识分歧分析、市场预测、改稿建议在内的**完整评测报告**。

**反同质化策略**：系统通过**阿里百炼（DashScope）统一网关**同时调用 **DeepSeek、通义千问（Qwen）、智谱（GLM）三家模型**均衡分配读者模拟任务，从模型底层打破单一 LLM 的审美偏好收敛问题，让 AI 读者的评价分布更接近真实读者群体。一个 API Key 即可调用所有模型，无需分别注册。

**目标市场**：中国网文作者（起点/番茄/七猫等平台）

**项目形式**：Web 应用（响应式，兼顾移动端）

**产品帮助作者回答三个核心问题**：

1. **读者会不会喜欢这本书**
2. **问题出在哪**
3. **应该怎么改**

---

## 二、可行性分析

### 2.1 技术可行性 ✅ 可行


| 能力      | 评估   | 说明                                                        |
| ------- | ---- | --------------------------------------------------------- |
| AI 模拟读者 | ✅ 成熟 | 国产 LLM（DeepSeek / 通义千问 / 智谱 GLM 等）完全有能力扮演特定人设的读者并给出有逻辑的评价；通过阿里百炼统一网关调用 |
| 人设多样性   | ✅ 可行 | 通过组合维度（年龄×性别×阅读偏好×性格×阅读经验）可生成远超 1,000 的独立人设               |
| 并发处理    | ✅ 可行 | 百炼统一网关支持并发调用，配合队列系统可在分钟级完成 1,000 次调用                       |
| 结果汇总    | ✅ 可行 | 先分组摘要再总汇总的层级聚合策略，可规避单次上下文长度限制                             |


### 2.2 成本可行性 ⚠️ 需要优化策略

这是本项目最核心的挑战。以下是基于国产模型的详细成本估算：

**单次评测成本估算（1,000 读者）：**


| 模型                  | 输入价格 (¥/百万token) | 输出价格 (¥/百万token) | 1,000 次总输入 (4M) | 1,000 次总输出 (400K) | 单次评测总费用   |
| ------------------- | ---------------- | ---------------- | --------------- | ----------------- | --------- |
| DeepSeek V3         | 1                | 2                | ¥4              | ¥0.8              | **~¥5**   |
| 通义千问 Qwen-Plus      | 0.8              | 2                | ¥3.2            | ¥0.8              | **~¥4**   |
| 智谱 GLM-4-Flash      | 0 (免费)           | 0 (免费)           | ¥0              | ¥0                | **~¥0**   |
| 月之暗面 Moonshot-v1-8k | 12               | 12               | ¥48             | ¥4.8              | **~¥53**  |
| 百川 Baichuan4-Air    | 0.98             | 0.98             | ¥3.9            | ¥0.4              | **~¥4.3** |


> 注：输入含小说文本（~~3,000 token）+ 预生成的人设 prompt（~~500 token）+ 评价指令（~~500 token）；输出为评分+短评（~~400 token）。汇总阶段额外费用约 ¥0.5~¥2。
> 价格数据为 2025 年参考价，实际以各平台最新定价为准。

**结论**：通过阿里百炼统一网关调用 DeepSeek V3 / 通义千问 / 智谱 GLM 三模型均衡混用 + Batch Reader 优化（1 call = 10 readers），单次完整评测成本约 **¥0.5~¥3**，商业上完全可行。三模型混用不仅降低成本（GLM 免费额度占 ~1/3），更从根本上解决评价同质化问题。统一网关还大幅简化了多模型接入和运维成本。

### 2.3 效果可行性 ⚠️ 核心质疑点

**关键问题：1,000 个读者 vs 更少但更精细的读者？**


| 维度    | 分析                                                          |
| ----- | ----------------------------------------------------------- |
| 统计学角度 | 调查研究中，30+ 样本即可近似正态分布，100~200 样本已非常可靠。1,000 个读者在统计上存在过度采样的可能 |
| 边际收益  | 超过 100 个多样化读者后，新增读者带来的信息增量急剧下降                              |
| 噪音问题  | 单一 LLM 扮演不同人设时评价趋同——通过三模型混合分配 + 认知偏差层 + 评分风格模型三重机制解决        |
| 营销价值  | "1,000 位读者为你的小说打分"极具传播力和说服力                                 |


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
- **竞争壁垒**：10,000+ 读者人设库（含认知偏差）+ 多 Agent 分析体系 + 三模型混合架构 + 阅读行为模拟

---

## 三、项目形式：Web 应用


| 对比维度 | Web 应用             | 桌面工具    |
| ---- | ------------------ | ------- |
| 用户门槛 | 零安装，浏览器打开即用        | 需下载安装   |
| 跨平台  | 天然跨平台              | 需多平台适配  |
| 异步处理 | 提交后可关闭页面，回来查看结果    | 需保持运行   |
| 分享传播 | 结果页可分享链接，利于口碑传播    | 不便分享    |
| 更新维护 | 服务端更新，用户无感知        | 需用户手动更新 |
| 商业化  | 微信支付集成方便，SaaS 模式自然 | 授权管理复杂  |


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
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Orchestrator Agent (调度中枢)             │  │
│  │  负责：任务调度、Agent 生成、读者分配、结果收集         │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────┴───────┐  ┌──────────────┐                        │
│  │  BullMQ 队列  │  │ 预置人设库    │                        │
│  │  并发控制     │  │(10,000+ 条   │                        │
│  │  重试机制     │  │ persona)     │                        │
│  └──────┬───────┘  └──────────────┘                        │
│         │                                                   │
│  ┌──────┴───────────────────────────────────────────────┐  │
│  │                  多 Agent 协作层                       │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐             │  │
│  │  │ Reader  │ │ Behavior │ │  Critic   │             │  │
│  │  │ Agent   │ │ Agent    │ │  Agent    │             │  │
│  │  │(评分评论)│ │(行为模拟) │ │(深度分析)  │             │  │
│  │  └─────────┘ └──────────┘ └───────────┘             │  │
│  │  ┌───────────┐ ┌──────────┐ ┌───────────┐          │  │
│  │  │ Consensus │ │ Editor   │ │  Market   │          │  │
│  │  │ Agent     │ │ Agent    │ │  Agent    │          │  │
│  │  │(共识分歧)  │ │(改稿建议) │ │(市场预测)  │          │  │
│  │  └───────────┘ └──────────┘ └───────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────┬──────────────────────────────────────────────────┘
          │
┌─────────┴──────────────────────────────────────────────────┐
│      阿里百炼（DashScope）统一网关 — 一个 Key 调用所有模型     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │   DeepSeek V3  │ │  通义千问 Qwen  │ │   智谱 GLM     │  │
│  │  (~34% 读者)   │ │  (~33% 读者)   │ │  (~33% 读者)   │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│  统一 OpenAI 兼容接口，三模型均衡分配，打破评价同质化           │
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

### 4.2 核心流程（多 Agent 协作）

```
用户提交小说文本
      │
      ▼
  ① 文本预处理（字数校验、敏感词检测、分段标记）
      │
      ▼
  ② Orchestrator 调度
      ├─ 从预置人设库随机抽取 N 个 Reader Persona
      ├─ 按三模型均衡分配读者（DeepSeek / Qwen / GLM 各约 1/3）
      └─ 创建 Batch Reader 任务（每批 10 个读者 = 1 次 API 调用）
      │
      ▼
  ③ Reader Agent — 批量并发评测（BullMQ 队列分发）
      │                                    ┌─→ Batch 1 (10 readers) → DeepSeek
      │                                    ├─→ Batch 2 (10 readers) → Qwen
      ├─→ 并发批次（每批 10 读者）──────────┤─→ Batch 3 (10 readers) → GLM
      ├─→ ...                              └─→ ...
      └─→ Batch N
      │  输出：评分 + 评论 + 阅读深度
      ▼
  ④ Behavior Agent — 阅读行为模拟
      │  输出：兴趣曲线、情绪曲线、弃书点
      ▼
  ⑤ Critic Agent — 深度文学分析
      │  输出：节奏分析、人物分析、设定分析
      ▼
  ⑥ Consensus Agent — 共识与分歧分析
      │  输出：读者共识（"78% 认为节奏慢"）、群体分歧
      ▼
  ⑦ Market Agent — 平台市场预测
      │  输出：起点/番茄/七猫潜力评分
      ▼
  ⑧ Editor Agent — AI 改稿建议
      │  输出：改进建议 + 重写示例
      ▼
  ⑨ 报告生成（综合所有 Agent 输出，生成完整评测报告）
      │
      ▼
  用户查看结果报告
```

### 4.3 多模型混合分配策略

**核心目标**：通过使用不同底层模型模拟不同读者，从根本上打破单一 LLM 的审美偏好收敛。

**使用模型**：


| 模型             | 百炼 model 名称 | 分配比例 | 特点          | 角色定位          |
| -------------- | ------------ | ---- | ----------- | ------------- |
| DeepSeek V3    | deepseek-v3  | ~34% | 性价比高，推理能力强  | 分析型/挑剔型读者为主   |
| 通义千问 Qwen-Plus | qwen3.5-plus | ~33% | 中文理解优秀，表达自然 | 感性型/文笔敏感型读者为主 |
| 智谱 GLM-4-Flash | glm-4-flash  | ~33% | 免费额度，响应快    | 大众型/速读型读者为主   |


**分配规则**：

```
1. 根据 Reader Persona 的性格特征倾向性分配模型
   - 挑剔型/分析型 persona → 优先分配 DeepSeek（推理强）
   - 感性型/文笔敏感型 persona → 优先分配 Qwen（中文表达自然）
   - 宽容型/速读型 persona → 优先分配 GLM（快速响应）

2. 在倾向性基础上引入随机扰动（±10%），避免固定映射

3. 最终保证三模型的调用量大致均衡（误差 ±5%）

4. 同一批 Batch Reader（10 人）使用同一模型，减少切换开销
```

**反同质化效果**：

- 不同模型有不同的"审美底色"，即使相同人设 prompt，三个模型的评价措辞和侧重点也会不同
- 评分分布的方差显著增大，更接近真实读者群体
- 如果某模型 API 故障，其他两个模型可以承接对应读者，具备天然容灾能力

---

## 五、核心模块设计

### 5.1 读者人设系统（预生成方案）

#### 设计原则

**预生成 10,000+ 个读者人设**的完整 prompt 并持久化存储，评测时从库中随机抽取 N 个（30/100/1000），不做实时拼装。

好处：

- 避免每次评测重复拼装 prompt，节省时间
- 避免动态拼装消耗的额外 token
- 人设 prompt 经过人工审核和微调，质量更高
- 每个人设有独特的"语气"和"口头禅"，不是简单的维度拼接
- 人格稳定可复用，不同评测之间有可比性

#### 人设维度


| 维度   | 取值示例                                             | 数量  |
| ---- | ------------------------------------------------ | --- |
| 年龄段  | 15-18 / 19-25 / 26-35 / 36-45 / 46+              | 5   |
| 性别   | 男 / 女 / 不限                                       | 3   |
| 阅读经验 | 新手（<1年）/ 入门（1-3年）/ 资深（3-7年）/ 老书虫（7年+）            | 4   |
| 偏好类型 | 玄幻 / 都市 / 仙侠 / 科幻 / 言情 / 悬疑 / 历史 / 游戏 / 轻小说 / 现实 | 10  |
| 阅读性格 | 挑剔型 / 宽容型 / 分析型 / 感性型 / 速读型                      | 5   |
| 阅读动机 | 打发时间 / 追求爽感 / 欣赏文笔 / 寻找共鸣 / 学习写作                 | 5   |


**组合池**：5 × 3 × 4 × 10 × 5 × 5 = **15,000 种**，从中精选 10,000 个代表性组合，评测时随机抽取。

#### 认知偏差层（防止人格塌缩的关键机制）

**问题**：当读者数量到 100~1000 时，LLM 的"基础人格"会覆盖人设人格，导致所有读者评价趋同（"节奏有点慢"、"设定不错"——走入默认审稿模式）。

**解决方案**：为每个读者人设增加**量化的判断偏置参数（taste_bias）**，在 prompt 中明确转化为行为指令。

```json
{
  "taste_bias": {
    "prefer_fast_pacing": 0.8,
    "care_about_writing": 0.3,
    "love_power_fantasy": 0.9,
    "romance_sensitivity": 0.1,
    "world_building": 0.7
  }
}
```

在 prompt 中转化为具体行为：

```
当节奏慢时你会非常不耐烦，可能直接弃书
当设定普通时你会大幅降低评分
当主角不够强时你会失去兴趣
你对言情线几乎无感，不会因为感情戏加分
```

#### 评分风格模型（防止 AI 评分集中）

**问题**：LLM 评分天然集中在 6~8 分区间，缺乏真实读者的评分多样性。

**解决方案**：每个读者人设分配一个评分风格。


| 类型             | 占比  | 评分特征                | 示例      |
| -------------- | --- | ------------------- | ------- |
| harsh（严格型）     | 30% | 好书 8 分，普通 5 分，差 3 分 | 老书虫、挑剔型 |
| generous（宽容型）  | 40% | 好书 9 分，普通 7 分，差 5 分 | 新读者、感性型 |
| polarized（极端型） | 30% | 喜欢 9 分，不喜欢 3 分      | 情绪驱动型   |


年龄分布参考：

```
18-22 岁  25%
23-30 岁  35%
31-40 岁  25%
40+ 岁    15%
```

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

#### Reader Persona 完整 Schema

```json
{
  "id": "R0042",
  "name": "老陈",

  "profile": {
    "age": 35,
    "gender": "male",
    "reading_years": 12,
    "reading_frequency": "daily"
  },

  "genre_preference": {
    "xianxia": 0.9,
    "urban": 0.5,
    "romance": 0.2,
    "sci_fi": 0.6
  },

  "taste_bias": {
    "prefer_fast_pacing": 0.7,
    "care_about_writing": 0.6,
    "power_fantasy": 0.8,
    "world_building": 0.9,
    "romance_sensitivity": 0.2
  },

  "personality": {
    "patience": 0.5,
    "critical_level": 0.7,
    "emotion": 0.4
  },

  "rating_style": "harsh",

  "preferred_model": "deepseek"
}
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

【你的认知偏好】
节奏偏好：0.7（偏快节奏）→ 当节奏慢时你会非常不耐烦
爽点偏好：0.8（喜欢主角变强）→ 主角不够强你会失去兴趣
文笔要求：0.6（有一定要求）→ 文笔太差会扣分但不至于弃书
世界观偏好：0.9（非常看重设定）→ 设定普通会大幅降低评分

【你的评判风格】
你是个比较挑剔但公平的读者（评分风格：严格型）。
你会直说问题，但也会认可做得好的地方。
你经常在起点书评区留言，风格就是那种"老书虫点评"的感觉。
你评分偏严格：好书给 8 分，普通给 5 分，差的给 3 分。

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

【你的认知偏好】
节奏偏好：0.4（不太在意节奏）→ 慢热型故事你也能接受
爽点偏好：0.2（不看重爽点）→ 你更关注情感而非打斗升级
文笔要求：0.7（较看重文笔）→ 好的氛围描写会让你加分
言情敏感度：0.9（非常看重感情线）→ 没有感情戏你很快会失去兴趣

【你的评判风格】
你是感性型读者（评分风格：极端型），评价主要看"感觉对不对"。
你不太会分析结构和技巧，但对"氛围感"和"代入感"非常敏感。
如果你觉得故事无聊，你会很直接地说"看不下去"（给 3 分）；
但如果你被打动了，评价会非常热情（给 9 分以上）。

【任务】
请阅读以下网文开篇内容，以你（小鹿）的身份和阅读习惯进行评价。
你的评价应该体现你作为感性型年轻读者的真实反应。
```

### 5.2 评价体系

**每位读者的评价输出（结构化 JSON）：**

```json
{
  "reader_id": "R0042",
  "model_used": "deepseek-v3",
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
  "detailed_comment": "...",
  "behavior": {
    "read_depth": 0.85,
    "drop_point_char": null,
    "attention_curve": [0.8, 0.7, 0.6, 0.5, 0.7],
    "emotion_curve": [0.4, 0.5, 0.6, 0.3, 0.5],
    "skip_sections": []
  }
}
```

**评分维度说明：**


| 字段               | 中文名    | 评分范围      | 说明              |
| ---------------- | ------ | --------- | --------------- |
| hook             | 开篇吸引力  | 1-10      | 前 1000 字能否抓住注意力 |
| character        | 人物塑造   | 1-10      | 主角是否有辨识度和吸引力    |
| worldbuilding    | 世界观/设定 | 1-10      | 设定是否有新意、是否清晰    |
| writing          | 文笔质量   | 1-10      | 文字功底、描写能力       |
| pacing           | 节奏感    | 1-10      | 信息密度、冲突推进速度     |
| immersion        | 代入感    | 1-10      | 是否让人有"身临其境"的感觉  |
| overall          | 综合印象   | 1-10      | 总体评价            |
| continue_reading | 继续阅读意愿 | 是/否       | 是否愿意继续追读        |
| drop_point       | 弃读点    | 段落位置/null | 如果弃读，在哪里失去兴趣    |
| model_used       | 使用模型   | string    | 记录该读者由哪个模型模拟    |
| behavior         | 阅读行为数据 | object    | 兴趣曲线/情绪曲线/弃书点等  |


### 5.3 阅读行为模拟（Behavior Agent）

真实读者不会"读完再评价"，而是：阅读 → 产生情绪 → 兴趣变化 → 可能弃书。系统通过 Behavior Agent 模拟这一过程。

**行为数据结构：**

```json
{
  "read_depth": 0.63,
  "drop_point": 3200,
  "attention_curve": [0.8, 0.7, 0.6, 0.4, 0.3],
  "emotion_curve": [0.4, 0.5, 0.7, 0.3, 0.2],
  "skip_sections": ["环境描写", "设定介绍"]
}
```


| 字段              | 含义        | 可视化价值           |
| --------------- | --------- | --------------- |
| read_depth      | 阅读深度（0~1） | 总体留存率           |
| drop_point      | 弃书位置（字数）  | "第 3200 字处兴趣断崖" |
| attention_curve | 兴趣变化曲线    | 逐段兴趣折线图         |
| emotion_curve   | 情绪变化曲线    | 情绪波动热力图         |
| skip_sections   | 跳读的段落类型   | "45% 读者跳过环境描写"  |


**关键可视化输出**（报告中最有价值的部分之一）：

```
读者兴趣曲线：
  ┌────────────────────────────────────┐
  │ ■■■■■■■■                            │  第 1-1000 字：兴趣 0.8
  │ ■■■■■■■                             │  第 1001-2000 字：兴趣 0.7
  │ ■■■■■                               │  第 2001-3000 字：兴趣 0.5  ← 兴趣拐点
  │ ■■■                                 │  第 3001-4000 字：兴趣 0.3  ← 弃书高发区
  └────────────────────────────────────┘
  ⚠️ 第 2000-3000 字区间出现兴趣断崖，67% 读者在此区间弃书
```

### 5.4 共识与分歧分析（Consensus Agent）

**共识分析** — 找出读者群体的统一意见：

```
读者共识（≥70% 一致）：
  ✅ 78% 读者认为节奏偏慢
  ✅ 82% 读者认可设定有新意
  ✅ 71% 读者觉得主角形象不够鲜明
```

**分歧分析** — 找出不同读者群体的观点差异（对作者最有价值的 insight）：

```
读者分歧：
  📊 关于开头叙事方式：
     年轻读者（18-25）：60% 觉得铺垫太长，希望直入冲突
     资深读者（30+）：  55% 认为铺垫合理，欣赏世界观展开

  📊 关于文笔风格：
     文笔敏感型：认为描写过于简略，缺乏氛围
     爽文爱好者：认为文笔够用，关键是节奏要快

  📊 关于金手指设定：
     玄幻读者：评分 8.2，认为设定有创意
     都市读者：评分 5.1，认为设定过于复杂
```

### 5.5 平台市场预测（Market Agent）

模拟不同平台的读者特征，预测小说在各平台的潜力。

**平台读者模型：**


| 平台     | 核心读者特征         | 关注重点              |
| ------ | -------------- | ----------------- |
| 起点中文网  | 升级敏感、爽点敏感、节奏敏感 | 金手指、主角成长、战力体系     |
| 番茄小说   | 剧情驱动、情绪驱动      | 故事吸引力、情感共鸣        |
| 七猫免费小说 | 短平快、冲突密集       | 前 1000 字能否抓住、信息密度 |


**输出示例：**

```
📈 平台潜力预测：
  起点中文网：7.3 / 10  ███████▎░░  适合连载
  番茄小说：  8.1 / 10  ████████░░  强烈推荐
  七猫小说：  6.2 / 10  ██████▏░░░  需优化节奏

💡 平台建议：
  本文剧情驱动型特征明显，更适合番茄小说的读者群体。
  若投起点，建议在前 3 章加强升级爽点和金手指展示。
  若投七猫，需要大幅压缩前置铺垫，第一段就要有冲突。
```

### 5.6 AI 改稿建议（Editor Agent）

不仅告诉作者"问题在哪"，还给出"怎么改"。

**输出内容：**


| 类型   | 说明         | 示例                |
| ---- | ---------- | ----------------- |
| 结构优化 | 节奏/结构层面的建议 | "前移第一个冲突至 500 字内" |
| 开头重写 | AI 重写前三段示范 | 提供 2-3 个不同风格的开头改写 |
| 人物强化 | 主角形象优化建议   | "增加一个标志性口癖或行为"    |
| 钩子优化 | 优化开篇 hook  | "将悬念前置，先展示结果再回溯"  |


```
📝 AI 改稿建议：

1.【开头重写建议】（优先级：最高）
  原文前三段过于平淡，建议改为：
  ───────────────────────────
  方案 A（悬念开头）：
  "三天前，我还只是个普通的高中生。
   现在我站在万米高空，脚下是一座漂浮的城市。"
  ───────────────────────────
  方案 B（冲突开头）：
  "当那个声音在我脑中响起的时候，我正在被三个人追杀。"
  ───────────────────────────

2.【节奏优化】
  第 1000-2500 字区间信息密度过低，建议：
  - 删减 300 字环境描写
  - 将第 3 章的核心冲突前移至此处
```

### 5.7 Batch Reader 成本优化

直接 1000 次 API 调用成本较高，使用 Batch Reader 策略降低 90% 成本。

**策略**：一次 API 调用同时生成 10 个读者的评价。

**Batch Prompt 示例：**

```
以下是 10 个不同读者，请分别以各自身份评价这篇小说。

读者 1（老陈，35 岁，老书虫，评分严格）：[人设摘要]
读者 2（小鹿，19 岁，言情党，评分极端）：[人设摘要]
读者 3（大飞，27 岁，玄幻党，评分宽容）：[人设摘要]
...

请分别输出 10 个读者的 JSON 评价：
[
  {"reader_id": "R0042", "score": 6.5, "comment": "...", "read_depth": 0.8},
  {"reader_id": "R0217", "score": 3.0, "comment": "...", "read_depth": 0.3},
  ...
]
```

**成本变化：**

```
直接调用：1000 readers = 1000 API calls
Batch 优化：1000 readers = 100 API calls（每次 10 个读者）

节省：约 70~90% 成本（input token 共享小说文本）
```

> 注：Batch 模式下每个读者的人设描述会被压缩为摘要版（~100 token），完整 prompt 在独立调用时使用。Batch 适合标准评测和深度评测，快速评测（30 读者）仍采用独立调用以保证质量。

### 5.8 汇总分析引擎

**两阶段汇总：**

**阶段一：分组小结**

- 按读者类型（偏好类型 × 阅读性格）分成 ~20 组
- 每组 ~50 个读者的评价 → 一个分组小结
- 输出：该类型读者的共性反馈、平均分、关键意见

**阶段二：总汇总**

- 输入：~20 个分组小结 + Behavior 数据 + Consensus 分析 + Market 预测 + Editor 建议
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

📉 阅读兴趣曲线：第 2000-3000 字区间出现兴趣断崖

🎯 读者画像分析：
  - 玄幻爱好者（评分 8.1）：对金手指设定评价较高
  - 言情爱好者（评分 5.3）：认为感情线薄弱
  - 挑剔型读者（评分 6.0）：指出节奏问题
  - 新手读者（评分 8.5）：整体好评

🤝 读者共识：78% 认为节奏偏慢 | 82% 认可设定新意
⚡ 读者分歧：年轻读者嫌铺垫长，资深读者认为合理

📈 平台潜力：番茄 8.1 > 起点 7.3 > 七猫 6.2

💡 改进建议（按优先级）：
  1. 【节奏】前 2000 字缺少核心冲突，建议前移第一个小高潮
  2. 【人物】主角性格特征不够鲜明，建议增加标志性行为
  3. 【代入】开头信息量过大，建议减少设定介绍，改用"展示"代替"叙述"

✏️ AI 改稿：提供 2 个开头重写方案
```

### 5.9 实时进度系统

通过 Server-Sent Events (SSE) 实时推送评测进度：

```
评测进行中...
  ✅ 文本预处理完成
  ✅ 已分配 100 位读者（DeepSeek 34 / Qwen 33 / GLM 33）
  📖 Reader Agent 评测中... 67/100 [██████████████████░░░░░░░░] 67%
     ├─ DeepSeek 批次 (5/7) 评测中...
     ├─ Qwen 批次 (4/7) 评测中...
     └─ GLM 批次 (7/7) ✅ 完成
  🔄 Behavior Agent... 等待中
  🔄 Consensus Agent... 等待中
  🔄 Market Agent... 等待中
  🔄 Editor Agent... 等待中
  ⏳ 报告生成... 等待中
  预计剩余时间：45 秒
```

---

## 六、技术选型

### 6.1 确定技术栈


| 层级            | 技术                                            | 理由                                  |
| ------------- | --------------------------------------------- | ----------------------------------- |
| **前端框架**      | Next.js 14+ (App Router)                      | 全栈统一，SSR/SSG 支持                     |
| **UI 组件库**    | Ant Design 5.x                                | 阿里出品，中文生态完善，企业级组件丰富                 |
| **样式方案**      | Ant Design 内置 + CSS Modules                   | 配合 Ant Design 的 ConfigProvider 主题定制 |
| **图表可视化**     | @ant-design/charts 或 ECharts                  | 评测报告的可视化图表                          |
| **后端**        | Next.js API Routes (Route Handlers)           | 与前端同项目，无需独立后端服务                     |
| **任务队列**      | BullMQ                                        | 管理大量并发 LLM 调用，支持重试、优先级、进度追踪         |
| **数据库**       | MySQL 8.0（阿里云 RDS / 腾讯云 CDB）                  | 国内云服务，稳定可靠，团队熟悉度高                   |
| **ORM**       | Prisma                                        | 类型安全，支持 MySQL，迁移管理方便                |
| **缓存/队列后端**   | Redis（阿里云 Redis / 腾讯云 Redis）                  | BullMQ 后端 + 评测进度缓存 + 会话管理           |
| **对象存储**      | 阿里云 OSS / 腾讯云 COS                             | 存储生成的评测报告（PDF/图片）                   |
| **LLM（均衡混用）** | 阿里百炼统一网关调用：DeepSeek V3 + Qwen3.5-Plus + GLM-4-Flash | 一个 Key 三模型均衡分配，打破同质化 + 天然容灾        |
| **实时通信**      | Server-Sent Events (SSE)                      | 单向推送评测进度，比 WebSocket 更轻量            |
| **用户认证**      | 微信登录 + 手机号登录                                  | 符合国内用户习惯                            |
| **支付**        | 微信支付（JSAPI / Native）                          | 当前唯一支付方式                            |
| **部署**        | 阿里云 ECS / 腾讯云 CVM + Docker                    | 国内服务器，合规无延迟                         |
| **域名/备案**     | 国内备案域名                                        | 必须完成 ICP 备案才可上线                     |


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
│   │   │   ├── client.ts            # LLM 统一调用接口（百炼 OpenAI 兼容）
│   │   │   └── model-allocator.ts   # 三模型均衡分配器
│   │   ├── agents/
│   │   │   ├── orchestrator.ts      # Orchestrator Agent（调度中枢）
│   │   │   ├── reader.ts            # Reader Agent（评分评论）
│   │   │   ├── behavior.ts          # Behavior Agent（阅读行为模拟）
│   │   │   ├── critic.ts            # Critic Agent（深度文学分析）
│   │   │   ├── consensus.ts         # Consensus Agent（共识分歧分析）
│   │   │   ├── editor.ts            # Editor Agent（AI 改稿建议）
│   │   │   └── market.ts            # Market Agent（平台市场预测）
│   │   ├── evaluation/
│   │   │   ├── engine.ts            # 评测调度引擎
│   │   │   ├── batch-reader.ts      # Batch Reader 批量调用
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
│   └── personas/                     # 预生成的 10,000+ 个人设 prompt
│       ├── personas.json             # 完整人设数据（含认知偏差、评分风格）
│       └── generate.ts               # 人设生成脚本
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
└── docker-compose.yml               # 本地开发 MySQL + Redis
```

### 6.3 LLM 统一调用层设计

通过**阿里百炼（DashScope）统一网关**调用所有模型，只需一个 API Key + 一个 Base URL，切换模型仅需改 model 参数。百炼完全兼容 OpenAI Chat Completions API，适配层极薄。

```typescript
// lib/llm/client.ts 接口设计
// 所有模型通过百炼统一网关调用，配置极简：
// - LLM_API_KEY: 百炼 API Key（一个 Key 调用所有模型）
// - LLM_BASE_URL: https://dashscope.aliyuncs.com/compatible-mode/v1

interface LLMRequest {
  model: 'deepseek-v3' | 'qwen3.5-plus' | 'glm-4-flash';
  systemPrompt: string;   // 预生成的读者人设 prompt
  userPrompt: string;     // 小说文本 + 评价指令
  temperature?: number;   // 控制评价多样性 (建议 0.7-0.9)
  responseFormat?: 'json'; // 强制 JSON 输出
  batchMode?: boolean;    // 是否为 Batch Reader 模式（1 call = 10 readers）
}

interface LLMResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
  latencyMs: number;
}

// lib/llm/model-allocator.ts 模型分配器
interface ModelAllocation {
  personaId: string;
  assignedModel: 'deepseek-v3' | 'qwen3.5-plus' | 'glm-4-flash';
  batchGroup: number;     // 同模型的读者按 10 人一组分批
}

// 分配策略：
// 1. 根据 persona.preferredModel 做倾向性分配
// 2. 引入随机扰动（±10%）避免固定映射
// 3. 保证三模型调用量均衡（误差 ±5%）
// 4. 同一 batch 内 10 个读者使用同一模型
```

**百炼统一网关的优势：**
- 只需注册阿里百炼一个平台，一个 API Key 调用 DeepSeek / Qwen / GLM 所有模型
- 统一计费、统一额度管理，无需管理多个账号
- OpenAI 兼容接口，切换模型仅需改 model 参数
- 百炼自身具备高可用保障，减少单点故障风险

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

// ========== 读者人设（预生成，10000+ 条） ==========

model ReaderPersona {
  id              String  @id                  // R00001 ~ R10000
  name            String                       // 人设昵称，如"老陈"
  ageGroup        String  @map("age_group")    // 15-18 / 19-25 / ...
  gender          String                       // 男 / 女 / 不限
  experience      String                       // 新手 / 入门 / 资深 / 老书虫
  genrePreference String  @map("genre_pref")   // 玄幻 / 都市 / ...
  personality     String                       // 挑剔型 / 宽容型 / ...
  motivation      String                       // 打发时间 / 追求爽感 / ...
  ratingStyle     String  @map("rating_style") // harsh / generous / polarized
  tasteBias       Json    @map("taste_bias")   // 认知偏置参数 JSON
  preferredModel  String  @map("preferred_model") @default("any") // 倾向分配的模型
  fullPrompt      String  @db.Text             // 完整的人设 prompt（直接发送给 LLM）
  batchPrompt     String  @db.Text @map("batch_prompt") // Batch 模式下的压缩版人设摘要
  groupTag        String  @map("group_tag")    // 分组标签，用于汇总阶段

  reviews         ReaderReview[]

  @@index([genrePreference])
  @@index([personality])
  @@index([ratingStyle])
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
  modelConfig Json?            @map("model_config")    // 三模型分配配置 {"deepseek": 34, "qwen": 33, "glm": 33}
  progress    Int              @default(0)         // 进度百分比 0-100
  finalReport     Json?    @map("final_report")      // 最终汇总报告
  consensusData   Json?    @map("consensus_data")    // 共识分歧分析结果
  marketPrediction Json?   @map("market_prediction") // 平台市场预测结果
  editorSuggestion Json?   @map("editor_suggestion") // AI 改稿建议
  behaviorSummary Json?    @map("behavior_summary")  // 阅读行为汇总（兴趣曲线等）
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
  modelUsed       String   @map("model_used")              // 实际使用的模型 (deepseek/qwen/glm)

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

  // 阅读行为数据
  readDepth       Float?   @map("read_depth")              // 阅读深度 0~1
  dropPointChar   Int?     @map("drop_point_char")         // 弃书位置（字数）
  attentionCurve  Json?    @map("attention_curve")         // 兴趣变化曲线
  emotionCurve    Json?    @map("emotion_curve")           // 情绪变化曲线
  skipSections    Json?    @map("skip_sections")           // 跳读段落类型

  rawResponse     String?  @map("raw_response") @db.Text
  tokenUsage      Json?    @map("token_usage")
  latencyMs       Int?     @map("latency_ms")
  batchId         String?  @map("batch_id")                // Batch 调用的批次 ID
  createdAt       DateTime @default(now()) @map("created_at")

  evaluation      Evaluation    @relation(fields: [evaluationId], references: [id])
  persona         ReaderPersona @relation(fields: [personaId], references: [id])

  @@index([evaluationId])
  @@index([personaId])
  @@index([modelUsed])
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

### 8.1 运营成本（三模型混合 + Batch 优化）

**三模型各自成本参考（单次独立调用，每读者）：**


| 模型             | 输入价格 (¥/百万token) | 输出价格 (¥/百万token) | 单读者成本   |
| -------------- | ---------------- | ---------------- | ------- |
| DeepSeek V3    | 1                | 2                | ~¥0.005 |
| 通义千问 Qwen-Plus | 0.8              | 2                | ~¥0.004 |
| 智谱 GLM-4-Flash | 0 (免费)           | 0 (免费)           | ~¥0     |


**Batch 优化后的评测成本（1 call = 10 readers）：**


| 评测等级 | 读者数   | API 调用次数   | Reader 成本 | Agent 分析成本 | 总成本/次     |
| ---- | ----- | ---------- | --------- | ---------- | --------- |
| 快速评测 | 30    | 30（独立调用）   | ~¥0.10    | ~¥0.15     | **~¥0.3** |
| 标准评测 | 100   | 10（Batch）  | ~¥0.15    | ~¥0.30     | **~¥0.5** |
| 深度评测 | 1,000 | 100（Batch） | ~¥1.5     | ~¥1.5      | **~¥3.0** |


> 注：Batch 模式下 input token 被 10 个读者共享，加上智谱 GLM 免费额度（占 ~~1/3 读者），综合成本较原方案降低约 50~~70%。Agent 分析成本包含 Behavior/Critic/Consensus/Market/Editor 五个 Agent 的调用。

### 8.2 建议定价


| 等级         | 定价         | 成本   | 毛利率     |
| ---------- | ---------- | ---- | ------- |
| 快速评测       | 免费（每日 1 次） | ¥0.3 | 用于获客    |
| 标准评测       | ¥9.9 / 次   | ¥0.7 | **93%** |
| 深度评测       | ¥29.9 / 次  | ¥6.0 | **80%** |
| 包月（30 次标准） | ¥99 / 月    | ¥21  | **79%** |


### 8.3 服务器成本预估（月）


| 资源            | 规格       | 月费          |
| ------------- | -------- | ----------- |
| 阿里云 ECS       | 2C4G     | ~¥100       |
| 阿里云 RDS MySQL | 1C2G 基础版 | ~¥80        |
| 阿里云 Redis     | 1G 标准版   | ~¥60        |
| 阿里云 OSS       | 按量       | ~¥10        |
| 域名 + 备案       | .com     | ~¥50/年      |
| **合计**        |          | **~¥250/月** |


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

核心目标：**跑通完整评测流程 + 三模型混合调用，可以实际使用**

- 项目初始化（Next.js + Ant Design + Prisma + MySQL）
- 预生成 1,000 个读者人设 prompt 并入库（含认知偏差参数、评分风格）
- 基础 Web UI（提交页 + 结果页）
- LLM 统一调用层（通过**阿里百炼统一网关**接入 DeepSeek V3 + Qwen + GLM 三个模型）
- 多模型均衡分配器（将读者按 ~1/3 分配给三个模型）
- 快速评测功能（30 个读者，独立调用，Promise.allSettled）
- 基础两阶段汇总（Reader Agent → 分组 → 总结）
- 评测报告展示（Ant Design 表格 + 简单图表）
- Docker Compose 本地开发环境
- 部署至阿里云 ECS

### Phase 2：核心体验（2~3 周）

- BullMQ 任务队列（支持 100/1000 读者并发）
- **Batch Reader 优化**（1 call = 10 readers，降低 70~90% 成本）
- **Behavior Agent**（阅读行为模拟：兴趣曲线、弃书点、情绪变化）
- **Consensus Agent**（共识与分歧分析）
- SSE 实时进度推送
- 三档评测等级完整实现
- 可视化评测报告（雷达图、兴趣曲线图、分组柱状图、留存漏斗）
- 用户登录（手机号 + 微信登录）
- 评测历史记录
- 数据安全（评测后自动删除原文、隐私声明）

### Phase 3：商业化 + 高级分析（2~3 周）

- 微信支付集成
- Credits 充值与消费体系
- **Market Agent**（平台市场预测：起点/番茄/七猫潜力评分）
- **Editor Agent**（AI 改稿建议 + 开头重写方案）
- **Critic Agent**（深度文学分析：节奏/人物/设定）
- 评测报告分享（生成分享链接/图片）
- 移动端适配优化

### Phase 4：增强（持续迭代）

- 对比评测 / AB 测试（提交修改版 vs 原版，对比留存率和评分）
- **爆款对标**（风格相似度分析：斗破苍穹 72%、诡秘之主 41%...）
- 特定类型深度分析（如玄幻专项评测）
- 读者人设自定义（用户指定目标读者群体）
- 人设库扩展至 10,000+
- API 开放给第三方平台

---

## 十一、数据安全与隐私

网文作者对内容泄露和被模型训练**非常敏感**，必须在产品层面明确保障：

### 核心承诺

```
1. 小说内容不会用于任何模型训练
2. 评测完成后原文自动删除（仅保留评测报告）
3. 所有数据传输使用 HTTPS 加密
4. 用户可随时删除自己的所有数据
```

### 技术实现


| 措施        | 说明                                         |
| --------- | ------------------------------------------ |
| 原文自动清除    | 评测完成后 24 小时内自动删除 `evaluations.content` 字段  |
| API 数据不留存 | 百炼统一网关调用，选择不使用训练数据的模型 API 版本（DeepSeek/Qwen/GLM 均支持） |
| 隐私协议      | 首页和提交页显著位置展示隐私保障声明                         |
| 敏感词审核     | 提交时进行基础敏感内容检测                              |


### 产品展示

在提交页和首页显著位置显示：

```
🔒 你的小说是安全的
✅ 不用于 AI 训练
✅ 评测后自动删除原文
✅ 仅保留评测报告
```

---

## 十二、风险与应对


| 风险                | 影响           | 应对策略                                                                              |
| ----------------- | ------------ | --------------------------------------------------------------------------------- |
| LLM 评价同质化         | 降低产品价值       | **三模型混合分配**（DeepSeek/Qwen/GLM 各 ~1/3）从底层打破同质化；认知偏差层强化人设差异；temperature 调节（0.7-0.9） |
| 单一模型 API 不稳定      | 部分评测中断       | 百炼统一网关自带高可用；三模型天然互为备份，某模型故障时自动重分配给其他模型；BullMQ 内置重试                                |
| AI 评分集中（6~8 分）    | 评分缺乏区分度      | 评分风格模型（harsh/generous/polarized）强制拉开分布；不同模型的评分基线本身有差异                             |
| 小说内容泄露/合规风险       | 用户信任 / 法律    | 评测后自动删除原文；隐私协议；敏感内容审核；ICP 备案                                                      |
| 微信支付资质问题          | 无法商业化        | 初期用免费模式验证需求；使用第三方聚合支付过渡                                                           |
| 用户对 AI 评价不信任      | 转化率低         | 提供免费体验；展示评价逻辑透明度；引入"已知好书"的标杆评测；兴趣曲线等行为数据比纯评分更有说服力                                 |
| ICP 备案周期长         | 延迟上线         | 尽早启动备案流程；备案期间用 IP 直接访问做内测                                                         |
| Batch Reader 质量下降 | 批量评价不如独立评价精细 | 快速评测（30 人）仍用独立调用保证质量；Batch 结果做质量抽检                                                |


---

## 十三、结论

**项目可行性：✅ 可行，且有明确的市场需求和技术路径。**

核心优势：

1. **概念吸引力强**——"1,000 位 AI 读者为你的开篇打分"极具营销记忆点
2. **技术完全可实现**——三家国产 LLM 混合使用，成本可控（Batch 优化后深度评测仅 ~¥3）
3. **商业模式清晰**——SaaS 按次付费，毛利率 80%+
4. **壁垒可积累**——10,000+ 精心设计的预置人设（含认知偏差参数）+ 多 Agent 分析体系
5. **反同质化机制成熟**——三模型混合 + 认知偏差层 + 评分风格模型，三重保障评价多样性
6. **产品深度超越竞品**——兴趣曲线、弃书点分析、平台预测、AI 改稿，不只是"打个分"

核心技术壁垒：

1. **Reader Persona 系统**——10,000+ 真实读者人格（含认知偏置、评分风格）
2. **多模型混合架构**——DeepSeek / Qwen / GLM 三模型均衡分配，底层打破同质化
3. **阅读行为模拟**——兴趣曲线、情绪曲线、弃书点，比纯评分有价值得多
4. **共识分析引擎**——AI 读者群体意见挖掘，作者最爱看的 insight
5. **平台市场预测**——起点/番茄/七猫潜力评分，作者最实用的决策依据

关键决策总结：

- **项目形式**：Web 应用
- **技术栈**：Next.js 全栈 + Ant Design + MySQL + Redis
- **部署**：国内云服务器（阿里云）
- **LLM**：通过**阿里百炼统一网关**调用 **DeepSeek V3 + Qwen3.5-Plus + GLM-4-Flash** 三模型均衡混用
- **支付**：微信支付
- **人设方案**：预生成 10,000+ 个完整 prompt（含认知偏差、评分风格），存入数据库直接使用
- **成本优化**：Batch Reader（1 call = 10 readers）+ GLM 免费额度
- **数据安全**：评测后自动删除原文，不用于模型训练

**建议立即启动 Phase 1 MVP 开发。**