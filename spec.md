# 网文开篇测评系统 — 项目设计文档

## 一、项目概述

**核心理念**：作者提交网文开篇（5,000\~10,000 字），系统调度 100\~1,000 个 AI 模拟读者进行阅读与评价，通过**多 Agent 协作架构**生成包含阅读行为模拟、共识分歧分析、市场预测、改稿建议在内的**完整评测报告**。

**反同质化策略**：系统通过**统一代理网关**（支持阿里百炼 / OpenRouter 双网关切换）同时调用 **DeepSeek、通义千问（Qwen）、智谱（GLM）三家模型**均衡分配读者模拟任务，从模型底层打破单一 LLM 的审美偏好收敛问题，让 AI 读者的评价分布更接近真实读者群体。一个 API Key 即可调用所有模型，无需分别注册各家平台。

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
| AI 模拟读者 | ✅ 成熟 | 国产 LLM（DeepSeek / 通义千问 / 智谱 GLM 等）完全有能力扮演特定人设的读者并给出有逻辑的评价；通过统一代理网关（百炼/OpenRouter）调用 |
| 人设多样性   | ✅ 可行 | 通过组合维度（年龄×性别×阅读偏好×性格×阅读经验）可生成远超 1,000 的独立人设               |
| 并发处理    | ✅ 可行 | 代理网关（百炼/OpenRouter）支持并发调用，配合队列系统可在分钟级完成 1,000 次调用          |
| 结果汇总    | ✅ 可行 | 先分组摘要再总汇总的层级聚合策略，可规避单次上下文长度限制                             |


### 2.2 成本可行性 ⚠️ 需要优化策略

这是本项目最核心的挑战。以下是基于国产模型的详细成本估算：

**单次评测成本估算（1,000 读者）：**


| 模型                  | 输入价格 (¥/百万token) | 输出价格 (¥/百万token) | 1,000 次总输入 (4M) | 1,000 次总输出 (400K) | 单次评测总费用   |
| ------------------- | ---------------- | ---------------- | --------------- | ----------------- | --------- |
| DeepSeek V3         | 1                | 2                | ¥4              | ¥0.8              | **~¥5**   |
| 通义千问 Qwen-Plus      | 0.8              | 2                | ¥3.2            | ¥0.8              | **~¥4**   |
| 智谱 GLM-5            | 5                  | 10                 | ¥20             | ¥4                | **~¥24**  |
| 月之暗面 Moonshot-v1-8k | 12               | 12               | ¥48             | ¥4.8              | **~¥53**  |
| 百川 Baichuan4-Air    | 0.98             | 0.98             | ¥3.9            | ¥0.4              | **~¥4.3** |


> 注：输入含小说文本（\~3,000 token）+ 预生成的人设 prompt（\~500 token）+ 评价指令（\~500 token）；输出为评分+短评（\~400 token）。汇总阶段额外费用约 ¥0.5\~¥2。
> 价格数据为 2025 年参考价，实际以各平台最新定价为准。

**结论**：通过代理网关（百炼/OpenRouter）统一调用 DeepSeek V3 / 通义千问 / 智谱 GLM-5 三模型均衡混用 + Batch Reader 优化（1 call = 10 readers），单次完整评测成本约 **¥0.2~¥5**，商业上完全可行。三模型混用从根本上解决评价同质化问题，双网关可切换架构还提供了额外的容灾能力和成本优化空间。

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
│  快速评测（¥1）：10 位代表性读者         │  ← 核心维度快速反馈，秒级出结果
├─────────────────────────────────────────┤
│  标准评测（¥9.9）：100 位多样化读者      │  ← 统计可靠，分钟级出结果
├─────────────────────────────────────────┤
│  深度评测（¥29.9）：1,000 位全谱读者     │  ← 完整覆盖，差异化卖点
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
│    LLM 代理网关（.env 切换：阿里百炼 / OpenRouter）           │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │   DeepSeek V3  │ │  通义千问 Qwen  │ │   智谱 GLM     │  │
│  │  (~34% 读者)   │ │  (~33% 读者)   │ │  (~33% 读者)   │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│  统一 OpenAI 兼容接口，三模型均衡分配，打破评价同质化           │
│  百炼/OpenRouter 均为 OpenAI 格式，切换无需改业务代码          │
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


| 模型             | 百炼 model 名称 | OpenRouter model 名称       | 分配比例 | 特点          | 角色定位          |
| -------------- | ------------ | ------------------------- | ---- | ----------- | ------------- |
| DeepSeek V3    | deepseek-v3  | deepseek/deepseek-chat    | ~34% | 性价比高，推理能力强  | 分析型/挑剔型读者为主   |
| 通义千问 Qwen-Plus | qwen3.5-plus | qwen/qwen3.5-plus-02-15  | ~33% | 中文理解优秀，表达自然 | 感性型/文笔敏感型读者为主 |
| 智谱 GLM-5       | glm-5        | z-ai/glm-5               | ~33% | 综合能力强，理解深入  | 大众型/综合型读者为主   |


**分配规则**：

```
1. 根据 Reader Persona 的性格特征倾向性分配模型
   - 挑剔型/分析型 persona → 优先分配 DeepSeek（推理强）
   - 感性型/文笔敏感型 persona → 优先分配 Qwen（中文表达自然）
   - 宽容型/大众型 persona → 优先分配 GLM（综合理解）

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

### 5.1 读者人设系统（管理后台管控）

#### 设计原则

读者人设通过**管理后台**创建和管理，支持 **AI 辅助批量生成 + 人工审核确认** 和 **手动逐个添加** 两种方式。所有人设存储在数据库中，评测时从库中随机抽取 N 个（10/100/1000）。

好处：

- 人设 prompt 经过管理员审核和微调，质量有保障
- 每个人设有独特的"语气"和"口头禅"，不是简单的维度拼接
- 人格稳定可复用，不同评测之间有可比性
- 管理员可随时编辑、删除不合格的人设，持续优化人设库质量
- 维度组合去重，确保人设库多样性

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

#### 人设管理流程（管理后台）

**方式一：AI 辅助批量生成（推荐）**

```
管理员点击「一键生成 10 个读者」
      │
      ▼
系统自动生成 10 个不重复的维度组合（查重：与库中已有人设的维度组合去重）
      │
      ▼
调用高质量 LLM（如 DeepSeek R1）为每个组合生成完整的人设 prompt
要求：不是简单的维度拼接，而是有个性化的背景故事、语气特征、评判标准
      │
      ▼
生成结果以列表形式展示给管理员预览
（包含：昵称、维度标签、完整 prompt、认知偏差参数、评分风格等）
      │
      ▼
管理员逐个审核：
  ├─ ✅ 通过 → 确认入库
  ├─ ✏️ 需微调 → 编辑后入库
  └─ ❌ 不合格 → 丢弃
```

**方式二：手动添加**

```
管理员手动填写人设各维度 + 编写完整 prompt
      │
      ▼
系统校验维度组合是否与已有人设重复
      │
      ├─ 重复 → 提示冲突，需调整维度
      │
      ▼
确认入库
```

**维度去重规则**：以 `年龄段 + 性别 + 阅读经验 + 偏好类型 + 阅读性格 + 阅读动机` 六维度组合为唯一键。同一组合不允许重复入库，确保人设库的多样性。

**CRUD 操作**：

- **查看**：人设列表（分页），支持按任意维度（年龄段/性别/阅读经验/偏好类型/阅读性格/阅读动机/评分风格）筛选搜索
- **编辑**：修改任意字段（维度标签、完整 prompt、认知偏差参数等），编辑后重新校验维度唯一性
- **删除**：删除人设（已被评测引用的人设标记为「已归档」而非物理删除，保证历史评测数据完整性）

**入库后每条记录包含**：

```
- 维度标签（用于分组汇总和去重校验）
- 完整 prompt（直接发送给 LLM，无需二次处理）
- Batch 摘要版 prompt（Batch Reader 模式使用）
- 认知偏差参数 taste_bias
- 评分风格 rating_style
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

> 注：Batch 模式下每个读者的人设描述会被压缩为摘要版（~100 token），完整 prompt 在独立调用时使用。Batch 适合标准评测和深度评测，快速评测（10 读者）仍采用独立调用以保证质量。

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
| **LLM（均衡混用）** | 代理网关（百炼/OpenRouter 可切换）调用：DeepSeek V3 + Qwen3.5-Plus + GLM-5 | 双网关切换，三模型均衡分配，打破同质化 + 天然容灾   |
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
│   │   ├── report/[id]/              # 评测报告页
│   │   ├── history/                  # 历史记录页
│   │   ├── pricing/                  # 积分购买页
│   │   ├── profile/                  # 个人中心（积分余额、流水、邀请码）
│   │   ├── login/                    # 登录页
│   │   ├── admin/                    # 管理后台
│   │   │   ├── layout.tsx            # 后台布局（侧边栏导航 + 权限校验）
│   │   │   ├── personas/             # 读者人设管理（列表/生成/添加/编辑）
│   │   │   ├── users/                # 用户管理
│   │   │   ├── evaluations/          # 评测管理
│   │   │   ├── orders/               # 订单管理
│   │   │   ├── llm-usage/            # LLM 用量仪表盘
│   │   │   └── referrals/            # 邀请统计
│   │   └── api/                      # API Route Handlers
│   │       ├── evaluation/
│   │       │   ├── submit/route.ts   # 提交评测（含积分预扣）
│   │       │   ├── progress/route.ts # SSE 进度推送
│   │       │   └── report/route.ts   # 获取报告
│   │       ├── auth/
│   │       │   ├── wechat/route.ts   # 微信登录回调
│   │       │   └── phone/route.ts    # 手机号登录
│   │       ├── points/
│   │       │   ├── balance/route.ts  # 查询积分余额
│   │       │   └── history/route.ts  # 积分流水
│   │       ├── payment/
│   │       │   ├── create/route.ts   # 创建积分购买订单
│   │       │   └── callback/route.ts # 微信支付回调（到账+邀请奖励）
│   │       ├── invite/
│   │       │   └── route.ts          # 邀请码查询 / 邀请记录
│   │       └── admin/                # 管理后台 API
│   │           ├── personas/route.ts # 人设 CRUD + 一键生成
│   │           ├── users/route.ts    # 用户列表 / 手动调整积分
│   │           ├── evaluations/route.ts
│   │           ├── orders/route.ts
│   │           └── llm-usage/route.ts # LLM 用量统计
│   ├── lib/
│   │   ├── llm/
│   │   │   ├── client.ts            # LLM 统一调用接口（OpenAI 兼容）
│   │   │   ├── provider.ts          # 网关配置层（百炼/OpenRouter 自动切换）
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
│   │   ├── points/
│   │   │   └── service.ts           # 积分服务（充值、扣费、退还、邀请奖励）
│   │   ├── payment/
│   │   │   └── wechat.ts            # 微信支付封装
│   │   └── db/
│   │       └── prisma.ts            # Prisma Client 单例
│   ├── components/                   # Ant Design 组合组件
│   │   ├── SubmitForm.tsx            # 文本提交表单
│   │   ├── ProgressCard.tsx          # 评测进度卡片
│   │   ├── ReportView.tsx            # 报告展示组件
│   │   ├── ScoreRadar.tsx            # 雷达图评分
│   │   ├── ReaderGroupChart.tsx      # 读者分组图表
│   │   └── PointsDisplay.tsx         # 积分余额展示
│   └── types/
│       └── index.ts                  # 全局类型定义
├── prisma/
│   ├── schema.prisma                 # 数据库 Schema
│   └── seed.ts                       # 种子数据（管理员账户等基础数据）
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
└── docker-compose.yml               # 本地开发 MySQL + Redis
```

### 6.3 LLM 统一调用层设计

系统支持**阿里百炼（DashScope）和 OpenRouter 双网关**，通过 `.env` 中的 `LLM_PROVIDER` 一键切换。两家网关均兼容 OpenAI Chat Completions API 格式，业务代码完全无需修改。

**双网关配置：**

```
LLM_PROVIDER=bailian          # 切换为 openrouter 即可切换网关

# 百炼：https://dashscope.aliyuncs.com/compatible-mode/v1
# OpenRouter：https://openrouter.ai/api/v1
```

**模型名称映射（不同网关的 model ID 不同，由配置层自动映射）：**

```
逻辑角色        百炼 model ID       OpenRouter model ID
───────────   ─────────────────   ──────────────────────────
DeepSeek      deepseek-v3         deepseek/deepseek-chat
Qwen          qwen3.5-plus        qwen/qwen3.5-plus-02-15
GLM           glm-5               z-ai/glm-5
```

```typescript
// lib/llm/client.ts 接口设计
// 通过 LLM_PROVIDER 环境变量自动选择网关和对应的 model ID
// 业务层只关心逻辑角色（deepseek / qwen / glm），不关心具体网关

type ModelRole = 'deepseek' | 'qwen' | 'glm';

interface LLMRequest {
  modelRole: ModelRole;     // 逻辑角色，由配置层映射为实际 model ID
  systemPrompt: string;     // 预生成的读者人设 prompt
  userPrompt: string;       // 小说文本 + 评价指令
  temperature?: number;     // 控制评价多样性 (建议 0.7-0.9)
  responseFormat?: 'json';  // 强制 JSON 输出
  batchMode?: boolean;      // 是否为 Batch Reader 模式（1 call = 10 readers）
}

interface LLMResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
  provider: string;         // 'bailian' | 'openrouter'
  latencyMs: number;
}

// lib/llm/provider.ts 网关配置层
// 读取 LLM_PROVIDER 环境变量，返回对应的 apiKey / baseUrl / modelMap
function getProviderConfig(): { apiKey: string; baseUrl: string; models: Record<ModelRole, string> }

// lib/llm/model-allocator.ts 模型分配器（与网关无关，只关心逻辑角色）
interface ModelAllocation {
  personaId: string;
  assignedRole: ModelRole;  // 'deepseek' | 'qwen' | 'glm'
  batchGroup: number;       // 同模型的读者按 10 人一组分批
}

// 分配策略：
// 1. 根据 persona.preferredModel 做倾向性分配
// 2. 引入随机扰动（±10%）避免固定映射
// 3. 保证三模型调用量均衡（误差 ±5%）
// 4. 同一 batch 内 10 个读者使用同一模型
```

**双网关的优势：**
- **灵活切换**：`.env` 改一行即可切换网关，零代码改动
- **容灾互备**：百炼故障时切 OpenRouter，反之亦然
- **成本优化**：可根据实时价格选择更便宜的网关
- **开发便利**：海外开发环境用 OpenRouter（无需翻墙），生产环境用百炼（国内低延迟）
- **统一接口**：两家均兼容 OpenAI 格式，业务层完全解耦

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
  points      Int      @default(0)           // 积分余额（1元 = 100积分，永不过期）
  inviteCode  String   @unique @map("invite_code")  // 用户专属邀请码（注册时自动生成）
  invitedBy   String?  @map("invited_by")            // 邀请人的 User ID
  isAdmin     Boolean  @default(false) @map("is_admin")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  evaluations       Evaluation[]
  orders            Order[]
  pointTransactions PointTransaction[]
  inviter           User?    @relation("Referral", fields: [invitedBy], references: [id])
  invitees          User[]   @relation("Referral")

  @@index([inviteCode])
  @@index([invitedBy])
  @@map("users")
}

// ========== 积分流水（所有积分变动均记录） ==========

model PointTransaction {
  id        String           @id @default(cuid())
  userId    String           @map("user_id")
  amount    Int                                    // 正数为充入，负数为消耗
  balance   Int                                    // 变动后余额
  type      PointTxType                            // 交易类型
  refId     String?          @map("ref_id")        // 关联的订单/评测/邀请 ID
  remark    String?                                // 备注（管理员手动加积分时填写）
  createdAt DateTime         @default(now()) @map("created_at")

  user      User             @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([type])
  @@index([createdAt])
  @@map("point_transactions")
}

enum PointTxType {
  PURCHASE           // 充值购买
  CONSUME            // 评测消耗
  REFERRAL_REWARD    // 邀请奖励（+100）
  ADMIN_GRANT        // 管理员手动发放
  REFUND             // 退款返还
}

// ========== 读者人设（管理后台管控） ==========

model ReaderPersona {
  id              String        @id @default(cuid())
  name            String                       // 人设昵称，如"老陈"
  ageGroup        String        @map("age_group")    // 15-18 / 19-25 / ...
  gender          String                       // 男 / 女 / 不限
  experience      String                       // 新手 / 入门 / 资深 / 老书虫
  genrePreference String        @map("genre_pref")   // 玄幻 / 都市 / ...
  personality     String                       // 挑剔型 / 宽容型 / ...
  motivation      String                       // 打发时间 / 追求爽感 / ...
  ratingStyle     String        @map("rating_style") // harsh / generous / polarized
  tasteBias       Json          @map("taste_bias")   // 认知偏置参数 JSON
  preferredModel  String        @map("preferred_model") @default("any") // 倾向分配的模型
  fullPrompt      String        @db.Text             // 完整的人设 prompt（直接发送给 LLM）
  batchPrompt     String        @db.Text @map("batch_prompt") // Batch 模式下的压缩版人设摘要
  groupTag        String        @map("group_tag")    // 分组标签，用于汇总阶段
  status          PersonaStatus @default(ACTIVE)      // ACTIVE=可用 / ARCHIVED=已归档
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  reviews         ReaderReview[]

  // 六维度组合唯一索引（确保人设不重复）
  @@unique([ageGroup, gender, experience, genrePreference, personality, motivation], name: "dimension_combo")
  @@index([genrePreference])
  @@index([personality])
  @@index([ratingStyle])
  @@index([groupTag])
  @@index([status])
  @@map("reader_personas")
}

enum PersonaStatus {
  ACTIVE
  ARCHIVED
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
  pointsCost  Int              @map("points_cost")  // 本次评测消耗积分数
  modelConfig Json?            @map("model_config")    // 三模型分配配置 {"deepseek": 34, "qwen": 33, "glm": 33}
  progress    Int              @default(0)         // 进度百分比 0-100
  finalReport     Json?    @map("final_report")      // 最终汇总报告
  consensusData   Json?    @map("consensus_data")    // 共识分歧分析结果
  marketPrediction Json?   @map("market_prediction") // 平台市场预测结果
  editorSuggestion Json?   @map("editor_suggestion") // AI 改稿建议
  behaviorSummary Json?    @map("behavior_summary")  // 阅读行为汇总（兴趣曲线等）

  // LLM 用量统计
  totalInputTokens  Int?     @map("total_input_tokens")   // 总输入 token 数
  totalOutputTokens Int?     @map("total_output_tokens")  // 总输出 token 数
  totalCost         Decimal? @map("total_cost") @db.Decimal(10,4) // 实际 LLM 成本（¥）
  llmUsageBreakdown Json?    @map("llm_usage_breakdown")  // 分模型用量 {"deepseek": {input: N, output: N, cost: N}, ...}

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
  QUICK      // 10 读者
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

// ========== 积分购买订单 ==========

model Order {
  id              String      @id @default(cuid())
  userId          String      @map("user_id")
  amount          Decimal     @db.Decimal(10,2)    // 支付金额（元）
  points          Int                               // 购买积分数量
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
| 智谱 GLM-5       | 5                  | 10                 | ~¥0.024 |


**Batch 优化后的评测成本（1 call = 10 readers）：**


| 评测等级 | 读者数   | API 调用次数   | Reader 成本 | Agent 分析成本 | 总成本/次     |
| ---- | ----- | ---------- | --------- | ---------- | --------- |
| 快速评测 | 10    | 10（独立调用）   | ~¥0.12    | ~¥0.10     | **~¥0.2** |
| 标准评测 | 100   | 10（Batch）  | ~¥0.30    | ~¥0.30     | **~¥0.6** |
| 深度评测 | 1,000 | 100（Batch） | ~¥3.0     | ~¥2.0      | **~¥5.0** |


> 注：Batch 模式下 input token 被 10 个读者共享，综合成本较独立调用降低约 50\~70%。Agent 分析成本包含 Behavior/Critic/Consensus/Market/Editor 五个 Agent 的调用。GLM-5 价格为估算值，以智谱官方最新定价为准。

### 8.2 积分体系与定价

**积分汇率**：**1 元 = 100 积分**，积分永不过期。

**积分购买档位（pricing 页面）：**

| 档位     | 积分数量   | 价格     | 备注         |
| ------ | ------ | ------ | ---------- |
| 入门     | 100    | ¥1     | 可体验 1 次快速评测 |
| 基础     | 1,000  | ¥10    |            |
| 标准     | 3,000  | ¥30    |            |
| 进阶     | 10,000 | ¥100   |            |
| 专业     | 30,000 | ¥300   |            |
| 旗舰     | 50,000 | ¥500   |            |
| 自定义    | N（≥100，整数） | ¥N/100 | 用户自由输入     |

**评测消耗积分：**

| 评测等级 | 读者数   | 消耗积分      | 折合人民币  | 成本   | 毛利率     |
| ---- | ----- | --------- | ------ | ---- | ------- |
| 快速评测 | 10    | **100 积分** | ¥1     | ¥0.2 | **80%** |
| 标准评测 | 100   | **1,000 积分** | ¥10    | ¥0.6 | **94%** |
| 深度评测 | 1,000 | **3,000 积分** | ¥30    | ¥5.0 | **83%** |

**邀请奖励机制：**

- 每个用户注册时自动生成专属邀请码
- 新用户通过邀请码注册 **且完成首次积分购买** 后，邀请人获得 **100 积分奖励**
- 邀请奖励自动到账，通过 `PointTransaction`（类型 `REFERRAL_REWARD`）记录


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

### 9.1 积分购买流程

```
用户在 pricing 页面选择积分档位（或自定义数量）
      │
      ▼
前端调用 /api/payment/create（传入积分数量）
      │
      ▼
后端计算金额（积分数 / 100）→ 创建微信支付订单（JSAPI/Native）
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
验签 → 更新订单状态 → 增加用户积分 → 写入 PointTransaction（PURCHASE）
      │
      ├─ 若该用户是被邀请用户且为首次购买 → 给邀请人发放 100 积分奖励（REFERRAL_REWARD）
      │
      ▼
用户可使用积分发起评测
```

### 9.2 评测扣费流程

```
用户选择评测等级 → 系统计算所需积分（快速 100 / 标准 1000 / 深度 3000）
      │
      ▼
校验用户积分余额 ≥ 所需积分
      │
      ├─ 不足 → 引导用户前往 pricing 页面充值
      │
      ▼
预扣积分（写入 PointTransaction，类型 CONSUME）
      │
      ▼
启动评测任务
      │
      ▼
评测完成 → 记录 LLM 实际用量（token 数 + 成本）至 Evaluation
      │
      ├─ 评测失败 → 积分原路返还（PointTransaction，类型 REFUND）
```

### 9.3 接入要求

- 微信商户号（需企业资质）
- 已备案的域名
- HTTPS 证书（Let's Encrypt 免费）
- 如果做微信内 H5 支付，还需微信公众号

## 十、管理后台

### 10.1 功能概述

管理后台供运营者使用，独立路由 `/admin`，需要 `isAdmin` 权限。

### 10.2 读者人设管理

- **人设列表**：分页展示所有读者人设，显示昵称、维度标签、评分风格、创建时间
- **维度筛选搜索**：按年龄段 / 性别 / 阅读经验 / 偏好类型 / 阅读性格 / 阅读动机 / 评分风格任意组合筛选
- **一键生成 10 个读者**：
  1. 系统自动生成 10 个与库中不重复的维度组合
  2. 调用 LLM 生成完整人设 prompt（含认知偏差参数、评分风格、Batch 摘要版）
  3. 列表预览，管理员逐个审核（通过 / 编辑 / 丢弃）
  4. 确认后批量入库
- **手动添加**：表单填写各维度 + 编写完整 prompt，系统校验维度组合唯一性
- **编辑**：修改任意字段，保存时重新校验维度唯一性
- **删除**：已被评测引用的人设标记为「已归档」（不影响历史数据），未引用的可物理删除
- **统计概览**：各维度分布饼图（当前人设库覆盖情况，帮助发现维度盲区）

### 10.3 用户管理

- 用户列表（分页、搜索：手机号/昵称/邀请码）
- 用户详情：基本信息、积分余额、积分流水、评测历史、邀请记录
- **手动调整积分**：管理员可给任意用户增加/扣减积分，需填写备注原因，记录 `PointTransaction`（类型 `ADMIN_GRANT`）

### 10.4 评测管理

- 评测列表（分页、按状态/时间筛选）
- 评测详情：基本信息、状态、读者评价列表

### 10.5 LLM 用量统计

每次评测的 LLM 消耗数据记录在 `Evaluation` 模型中，管理后台提供汇总视图：

- **单次评测用量**：总 input/output tokens、分模型用量明细、实际成本（¥）
- **汇总仪表盘**：
  - 按天/周/月的 LLM 总调用量（token 数、成本）
  - 分模型用量占比（DeepSeek / Qwen / GLM-5）
  - 平均每次评测成本趋势
  - 成本 vs 收入对比

### 10.6 邀请统计

- 邀请排行榜（邀请人数 Top N）
- 邀请转化率（注册 → 购买）
- 邀请奖励积分总发放量

### 10.7 订单管理

- 订单列表（分页、按状态/时间筛选）
- 收入统计（按天/周/月的充值金额汇总）

---

## 十一、开发计划（一次性完整交付）

> 不分阶段，一次性完成所有功能模块的开发与集成，确保上线即为完整产品。

### 11.1 基础设施与项目骨架

- [ ] 项目初始化（Next.js 14+ App Router + Ant Design 5.x + TypeScript）
- [ ] Docker Compose 本地开发环境（MySQL 8.0 + Redis）
- [ ] Prisma ORM 配置 + 数据库 Schema 迁移
- [ ] 全局布局与 Ant Design ConfigProvider 主题定制
- [ ] 环境变量配置体系（`.env` 分 development / production）

### 11.2 用户体系与认证

- [ ] 手机号登录（短信验证码）
- [ ] 微信登录（OAuth2.0 授权）
- [ ] 用户会话管理（JWT / Session）
- [ ] 用户信息管理（昵称、头像）
- [ ] 注册时自动生成专属邀请码
- [ ] 邀请码注册绑定（记录 invitedBy 关系）

### 11.3 LLM 统一调用层

- [ ] LLM Client 统一接口（OpenAI 兼容格式）
- [ ] 双网关配置层（百炼 / OpenRouter，`.env` 一键切换）
- [ ] 模型名称自动映射（逻辑角色 → 网关对应的 model ID）
- [ ] 多模型均衡分配器（根据 persona 特征倾向性分配 + 随机扰动 + 均衡校验）
- [ ] 错误处理与重试机制（单模型故障自动重分配至其他模型）
- [ ] Token 用量与成本追踪

### 11.4 读者人设系统

- [ ] 管理后台人设列表页（分页 + 多维度筛选搜索）
- [ ] 「一键生成 10 个读者」功能（维度去重 → LLM 生成 → 预览审核 → 确认入库）
- [ ] 手动添加单个人设表单（维度选择 + prompt 编写 + 唯一性校验）
- [ ] 人设编辑 / 删除（已引用的归档，未引用的物理删除）
- [ ] 维度去重逻辑（六维度组合唯一键校验）
- [ ] 人设库维度分布统计（覆盖情况可视化，发现维度盲区）
- [ ] 评测时的人设随机抽取与分组逻辑

### 11.5 评测引擎（核心链路）

- [ ] BullMQ 任务队列（并发控制、优先级、重试、进度追踪）
- [ ] Orchestrator Agent 调度中枢（任务拆分、读者分配、批次编排、结果收集）
- [ ] Reader Agent — 独立调用模式（快速评测 10 人）
- [ ] Reader Agent — Batch Reader 模式（1 call = 10 readers，标准/深度评测）
- [ ] 三档评测等级完整实现（快速 10 / 标准 100 / 深度 1,000）
- [ ] SSE 实时进度推送（分模型进度、分 Agent 阶段进度、预计剩余时间）

### 11.6 多 Agent 分析体系（全部实现）

- [ ] **Behavior Agent**（阅读行为模拟：兴趣曲线、情绪曲线、弃书点、跳读段落）
- [ ] **Critic Agent**（深度文学分析：节奏分析、人物分析、设定分析）
- [ ] **Consensus Agent**（共识与分歧分析：读者群体统一意见、不同群体观点差异）
- [ ] **Market Agent**（平台市场预测：起点/番茄/七猫潜力评分与投稿建议）
- [ ] **Editor Agent**（AI 改稿建议：结构优化、开头重写方案、人物强化、钩子优化）

### 11.7 两阶段汇总引擎

- [ ] 阶段一：按读者类型（偏好 × 性格）分组，每组生成分组小结
- [ ] 阶段二：综合所有分组小结 + 五大 Agent 分析结果，生成完整评测报告
- [ ] 报告数据结构化存储（finalReport / consensusData / marketPrediction / editorSuggestion / behaviorSummary）

### 11.8 评测报告与可视化

- [ ] 综合评分总览（雷达图 + 评分条）
- [ ] 各维度得分详情（hook / character / worldbuilding / writing / pacing / immersion）
- [ ] 读者留存率 & 阅读深度分布
- [ ] 兴趣曲线图 + 情绪曲线图（逐段折线图）
- [ ] 弃书点热力分析
- [ ] 读者画像分组柱状图（按偏好、年龄、性格等维度）
- [ ] 共识与分歧可视化展示
- [ ] 平台潜力预测对比图（起点/番茄/七猫）
- [ ] AI 改稿建议展示（多方案对比）
- [ ] 评测报告分享（生成分享链接 / 分享图片）

### 11.9 积分与支付

- [ ] 积分购买页面（100 / 1,000 / 3,000 / 10,000 / 30,000 / 50,000 + 自定义输入，最少 100）
- [ ] 微信支付集成（JSAPI / Native）
- [ ] 支付回调 → 积分到账 → PointTransaction 记录
- [ ] 评测扣费（预扣积分 → 评测 → 失败退还）
- [ ] 积分余额展示与流水查询
- [ ] 邀请奖励机制（邀请码生成 + 被邀请人首次购买后自动发放 100 积分）

### 11.10 页面与交互

- [ ] 首页（产品介绍 + 核心卖点 + 隐私保障声明）
- [ ] 提交评测页（文本输入/粘贴 + 字数校验 + 评测等级选择 + 积分余额/扣费提示 + 敏感词检测）
- [ ] 评测进度页（SSE 实时进度展示）
- [ ] 评测报告页（完整报告 + 可视化图表）
- [ ] 评测历史页（历史记录列表 + 报告回看）
- [ ] 积分购买页 pricing（档位选择 + 自定义输入 + 微信支付）
- [ ] 个人中心（积分余额、积分流水、邀请码 + 邀请记录）
- [ ] 登录页（手机号 + 微信登录）
- [ ] 响应式适配（桌面端 + 移动端）

### 11.11 管理后台

- [ ] 管理后台路由 `/admin`（isAdmin 权限校验 + 侧边栏导航布局）
- [ ] **读者人设管理**（列表 + 多维度筛选 + 一键生成10个 + 手动添加 + 编辑 + 删除/归档 + 维度分布统计）
- [ ] 用户管理（列表、搜索、详情、手动调整积分 + 备注）
- [ ] 评测管理（列表、详情、状态筛选）
- [ ] LLM 用量仪表盘（按天/周/月汇总 token 用量与成本、分模型占比、单次评测用量明细）
- [ ] 订单管理（列表、收入统计）
- [ ] 邀请统计（排行榜、转化率、奖励发放量）

### 11.12 数据安全与合规

- [ ] 评测完成后 24 小时自动删除原文
- [ ] 敏感内容检测（提交时基础审核）
- [ ] 隐私协议页面
- [ ] 用户数据自助删除功能
- [ ] HTTPS 全站加密

### 11.13 增强功能

- [ ] 对比评测 / AB 测试（提交修改版 vs 原版，对比留存率和评分变化）
- [ ] 爆款对标分析（风格相似度：斗破苍穹 72%、诡秘之主 41%...）
- [ ] 特定类型深度分析（如玄幻专项评测、言情专项评测）
- [ ] 读者人设自定义（用户指定目标读者群体比例）
- [ ] API 开放（第三方平台接入接口）

### 11.14 部署上线

- [ ] 阿里云 ECS 部署（Docker 容器化）
- [ ] 阿里云 RDS MySQL + Redis 云服务配置
- [ ] 阿里云 OSS 对象存储（报告/图片）
- [ ] 域名注册 + ICP 备案
- [ ] HTTPS 证书配置（Let's Encrypt）
- [ ] 生产环境监控与日志

---

## 十二、数据安全与隐私

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
| API 数据不留存 | 通过代理网关（百炼/OpenRouter）调用，选择不使用训练数据的模型 API 版本（DeepSeek/Qwen/GLM 均支持） |
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

## 十三、风险与应对


| 风险                | 影响           | 应对策略                                                                              |
| ----------------- | ------------ | --------------------------------------------------------------------------------- |
| LLM 评价同质化         | 降低产品价值       | **三模型混合分配**（DeepSeek/Qwen/GLM 各 ~1/3）从底层打破同质化；认知偏差层强化人设差异；temperature 调节（0.7-0.9） |
| 单一网关/模型 API 不稳定   | 部分评测中断       | 双网关（百炼/OpenRouter）互为容灾；三模型天然互为备份，某模型故障时自动重分配；BullMQ 内置重试                             |
| AI 评分集中（6~8 分）    | 评分缺乏区分度      | 评分风格模型（harsh/generous/polarized）强制拉开分布；不同模型的评分基线本身有差异                             |
| 小说内容泄露/合规风险       | 用户信任 / 法律    | 评测后自动删除原文；隐私协议；敏感内容审核；ICP 备案                                                      |
| 微信支付资质问题          | 无法商业化        | 已有企业资质，可直接申请微信商户号；流程约 1~2 周                                                        |
| 用户对 AI 评价不信任      | 转化率低         | 快速评测仅 ¥1 低门槛体验；展示评价逻辑透明度；引入"已知好书"的标杆评测；兴趣曲线等行为数据比纯评分更有说服力                        |
| ICP 备案周期长         | 延迟上线         | 尽早启动备案流程；备案期间用 IP 直接访问做内测                                                         |
| Batch Reader 质量下降 | 批量评价不如独立评价精细 | 快速评测（10 人）仍用独立调用保证质量；Batch 结果做质量抽检                                                |


---

## 十四、结论

**项目可行性：✅ 可行，且有明确的市场需求和技术路径。**

核心优势：

1. **概念吸引力强**——"1,000 位 AI 读者为你的开篇打分"极具营销记忆点
2. **技术完全可实现**——三家国产 LLM 混合使用，成本可控（Batch 优化后深度评测 ~¥5）
3. **商业模式清晰**——积分制付费（1元=100积分），毛利率 80%+
4. **壁垒可积累**——持续积累的高质量读者人设库（含认知偏差参数，管理后台精细管控）+ 多 Agent 分析体系
5. **反同质化机制成熟**——三模型混合 + 认知偏差层 + 评分风格模型，三重保障评价多样性
6. **产品深度超越竞品**——兴趣曲线、弃书点分析、平台预测、AI 改稿，不只是"打个分"

核心技术壁垒：

1. **Reader Persona 系统**——管理后台精细管控的读者人格库（含认知偏置、评分风格、六维度去重）
2. **多模型混合架构**——DeepSeek / Qwen / GLM 三模型均衡分配，底层打破同质化
3. **阅读行为模拟**——兴趣曲线、情绪曲线、弃书点，比纯评分有价值得多
4. **共识分析引擎**——AI 读者群体意见挖掘，作者最爱看的 insight
5. **平台市场预测**——起点/番茄/七猫潜力评分，作者最实用的决策依据

关键决策总结：

- **项目形式**：Web 应用
- **技术栈**：Next.js 全栈 + Ant Design + MySQL + Redis
- **部署**：国内云服务器（阿里云）
- **LLM**：通过**双网关（阿里百炼 / OpenRouter，`.env` 一键切换）**调用 **DeepSeek V3 + Qwen3.5-Plus + GLM-5** 三模型均衡混用
- **付费模式**：积分制（1元=100积分，永不过期），微信支付充值，评测消耗积分
- **增长机制**：邀请码裂变，邀请新用户注册并购买积分赠送 100 积分
- **人设方案**：管理后台管控，AI 辅助批量生成 + 人工审核入库（含认知偏差、评分风格、维度去重）
- **成本优化**：Batch Reader（1 call = 10 readers），深度评测成本 ~¥5/次
- **运营工具**：管理后台（用户管理、积分调整、LLM 用量统计、订单/邀请分析）
- **数据安全**：评测后自动删除原文，不用于模型训练

**需求已明确，技术方案已就绪，可立即启动全功能开发。**