/* ===== Mock Readers ===== */
export interface MockReader {
  id: string;
  name: string;
  emoji: string;
  age: number;
  gender: '男' | '女';
  readingYears: number;
  preferredGenres: string[];
  personality: string;
  catchphrase: string;
  avatarColor: string;
}

export const MOCK_READERS: MockReader[] = [
  { id: 'r1', name: '老陈', emoji: '🧔', age: 35, gender: '男', readingYears: 12, preferredGenres: ['玄幻', '仙侠'], personality: '挑剔型', catchphrase: '开篇3千字抓不住我就划走', avatarColor: '#f56a00' },
  { id: 'r2', name: '小鹿', emoji: '🦌', age: 19, gender: '女', readingYears: 3, preferredGenres: ['言情'], personality: '感性型', catchphrase: '氛围感对了就追下去', avatarColor: '#7265e6' },
  { id: 'r3', name: '阿杰', emoji: '🎮', age: 24, gender: '男', readingYears: 6, preferredGenres: ['游戏', '科幻'], personality: '速读型', catchphrase: '没金手指我就划走', avatarColor: '#ffbf00' },
  { id: 'r4', name: '秋月', emoji: '📚', age: 28, gender: '女', readingYears: 8, preferredGenres: ['悬疑'], personality: '分析型', catchphrase: '逻辑线有没有问题', avatarColor: '#00a2ae' },
  { id: 'r5', name: '张教授', emoji: '🔍', age: 45, gender: '男', readingYears: 20, preferredGenres: ['历史', '现实'], personality: '分析型', catchphrase: '笔力尚可，但格局小', avatarColor: '#87d068' },
  { id: 'r6', name: '萌萌', emoji: '🐱', age: 16, gender: '女', readingYears: 2, preferredGenres: ['轻小说', '言情'], personality: '宽容型', catchphrase: '只要男主帅就行', avatarColor: '#eb2f96' },
  { id: 'r7', name: '大刘', emoji: '🚀', age: 32, gender: '男', readingYears: 10, preferredGenres: ['科幻'], personality: '挑剔型', catchphrase: '硬核科幻才是正道', avatarColor: '#1890ff' },
  { id: 'r8', name: '书虫小王', emoji: '📖', age: 22, gender: '男', readingYears: 5, preferredGenres: ['都市', '玄幻'], personality: '宽容型', catchphrase: '有爽点就能追', avatarColor: '#52c41a' },
  { id: 'r9', name: '冷月', emoji: '🌙', age: 30, gender: '女', readingYears: 9, preferredGenres: ['仙侠', '玄幻'], personality: '感性型', catchphrase: '意境到位我就给高分', avatarColor: '#722ed1' },
  { id: 'r10', name: '老铁', emoji: '💪', age: 27, gender: '男', readingYears: 7, preferredGenres: ['都市', '游戏'], personality: '速读型', catchphrase: '三章不爽直接弃', avatarColor: '#fa541c' },
  { id: 'r11', name: '文青', emoji: '🎭', age: 25, gender: '女', readingYears: 6, preferredGenres: ['现实', '悬疑'], personality: '分析型', catchphrase: '叙事结构得有讲究', avatarColor: '#13c2c2' },
  { id: 'r12', name: '阿宝', emoji: '🐼', age: 20, gender: '男', readingYears: 4, preferredGenres: ['玄幻', '游戏'], personality: '宽容型', catchphrase: '升级打怪我就爱看', avatarColor: '#2f54eb' },
];

/* ===== Mock Report Data ===== */
export interface DimensionScore {
  dimension: string;
  score: number;
  fullMark: number;
}

export const MOCK_DIMENSION_SCORES: DimensionScore[] = [
  { dimension: '开篇吸引力', score: 8.1, fullMark: 10 },
  { dimension: '人物塑造', score: 6.5, fullMark: 10 },
  { dimension: '世界观设定', score: 7.8, fullMark: 10 },
  { dimension: '文笔质量', score: 7.0, fullMark: 10 },
  { dimension: '节奏感', score: 5.2, fullMark: 10 },
  { dimension: '代入感', score: 7.5, fullMark: 10 },
];

export interface FunnelStage {
  stage: string;
  count: number;
  percent: number;
}

export const MOCK_FUNNEL_DATA: FunnelStage[] = [
  { stage: '开始阅读', count: 100, percent: 100 },
  { stage: '读完 2000 字', count: 89, percent: 89 },
  { stage: '读完 4000 字', count: 82, percent: 82 },
  { stage: '读完 6000 字', count: 78, percent: 78 },
  { stage: '读完全文', count: 73, percent: 73 },
];

export interface GroupScore {
  group: string;
  score: number;
  type: 'genre' | 'personality';
}

export const MOCK_GROUP_SCORES: GroupScore[] = [
  { group: '玄幻爱好者', score: 8.1, type: 'genre' },
  { group: '仙侠爱好者', score: 7.5, type: 'genre' },
  { group: '科幻爱好者', score: 7.2, type: 'genre' },
  { group: '都市爱好者', score: 6.8, type: 'genre' },
  { group: '言情爱好者', score: 5.3, type: 'genre' },
  { group: '宽容型', score: 8.3, type: 'personality' },
  { group: '感性型', score: 7.8, type: 'personality' },
  { group: '速读型', score: 6.9, type: 'personality' },
  { group: '分析型', score: 6.5, type: 'personality' },
  { group: '挑剔型', score: 6.0, type: 'personality' },
];

export interface ReaderComment {
  readerId: string;
  readerName: string;
  readerEmoji: string;
  age: number;
  readingYears: number;
  genre: string;
  personality: string;
  score: number;
  comment: string;
  type: 'positive' | 'negative';
  avatarColor: string;
}

export const MOCK_COMMENTS: ReaderComment[] = [
  {
    readerId: 'r1', readerName: '老陈', readerEmoji: '🧔', age: 35, readingYears: 12,
    genre: '玄幻', personality: '挑剔型', score: 7.5, avatarColor: '#f56a00',
    comment: '开头直接丢进战场，没有废话，这点好评。金手指是异界网吧，设定很新颖，之前没见过这种。扣分在于第二章节奏断了，花太多篇幅解释网吧系统面板。',
    type: 'positive',
  },
  {
    readerId: 'r2', readerName: '小鹿', readerEmoji: '🦌', age: 19, readingYears: 3,
    genre: '言情', personality: '感性型', score: 8.0, avatarColor: '#7265e6',
    comment: '男主角出场很有画面感，在战场上的描写让我很有代入感！但是后面到了网吧部分就有点无聊了，希望快点出女主。',
    type: 'positive',
  },
  {
    readerId: 'r8', readerName: '书虫小王', readerEmoji: '📖', age: 22, readingYears: 5,
    genre: '都市', personality: '宽容型', score: 8.5, avatarColor: '#52c41a',
    comment: '异界开网吧这个点子太妙了！前面战斗写得不错，后面网吧经营的部分也很有趣味性，期待后续发展。',
    type: 'positive',
  },
  {
    readerId: 'r4', readerName: '秋月', readerEmoji: '📚', age: 28, readingYears: 8,
    genre: '悬疑', personality: '分析型', score: 4.5, avatarColor: '#00a2ae',
    comment: '逻辑硬伤：异界为什么有电？网吧怎么联网？作者没有解释世界观底层逻辑就开始推剧情了。',
    type: 'negative',
  },
  {
    readerId: 'r10', readerName: '老铁', readerEmoji: '💪', age: 27, readingYears: 7,
    genre: '都市', personality: '速读型', score: 5.0, avatarColor: '#fa541c',
    comment: '前面战斗还行，后面开网吧的部分太水了，三章了还没看到明确的升级体系，我选择弃书。',
    type: 'negative',
  },
  {
    readerId: 'r5', readerName: '张教授', readerEmoji: '🔍', age: 45, readingYears: 20,
    genre: '历史', personality: '分析型', score: 6.0, avatarColor: '#87d068',
    comment: '文笔中规中矩，叙事节奏前快后慢。异界网吧的概念有趣但缺乏深度。建议加强世界观的内在逻辑性。',
    type: 'negative',
  },
];

export interface Suggestion {
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  problem: string;
  advice: string;
  reference: string;
}

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    priority: 'P0',
    title: '节奏优化',
    problem: '前 2000 字缺少核心冲突，41% 的弃读发生在此区间',
    advice: '将第三章的"异界网吧第一位客人"事件前移到前 1500 字内，让读者尽早看到核心设定的运作方式。目前前 2000 字大部分在描写环境和背景，建议削减到 800 字以内。',
    reference: '73% 的玄幻读者表示"希望前三章就能看到金手指运作"',
  },
  {
    priority: 'P1',
    title: '人物塑造',
    problem: '主角性格特征不够鲜明，53% 的读者表示"对主角印象模糊"',
    advice: '在开篇 500 字内通过一个具体的行为/选择来展示主角的核心性格特质，而不是通过内心独白来叙述。比如让主角在战场上做一个出人意料但符合性格的选择。',
    reference: '感性型读者和宽容型读者给人物塑造的平均分差异达到 2.3 分',
  },
  {
    priority: 'P2',
    title: '世界观展示方式',
    problem: '设定信息密度过高，25% 的读者反馈"信息量过大"',
    advice: '采用"冰山理论"，只展示世界观的 1/10，其余通过剧情自然展开。将网吧系统面板的介绍从一次性说明改为随着经营逐步解锁。',
    reference: '分析型读者虽然喜欢详细设定，但也有 60% 认为"过早的信息灌注影响阅读体验"',
  },
];

/* ===== Mock Evaluation History ===== */
export type EvalStatus = 'completed' | 'running' | 'failed' | 'pending_payment';

export interface EvalRecord {
  id: string;
  title: string;
  genre: string;
  wordCount: number;
  plan: string;
  readers: number;
  status: EvalStatus;
  score?: number;
  progress?: number;
  createdAt: string;
}

export const MOCK_EVAL_HISTORY: EvalRecord[] = [
  { id: 'eval-001', title: '我在异界开网吧', genre: '玄幻', wordCount: 8234, plan: '标准评测', readers: 100, status: 'completed', score: 7.2, createdAt: '2025-03-04 14:32' },
  { id: 'eval-002', title: '重生之都市修仙', genre: '都市', wordCount: 6100, plan: '快速评测', readers: 30, status: 'completed', score: 6.8, createdAt: '2025-03-03 09:15' },
  { id: 'eval-003', title: '星际迷途', genre: '科幻', wordCount: 9800, plan: '深度评测', readers: 1000, status: 'running', progress: 83, createdAt: '2025-03-04 16:00' },
  { id: 'eval-004', title: '没有名字的剑客', genre: '仙侠', wordCount: 5200, plan: '标准评测', readers: 100, status: 'failed', createdAt: '2025-03-02 20:45' },
  { id: 'eval-005', title: '末日档案馆', genre: '悬疑', wordCount: 7500, plan: '标准评测', readers: 100, status: 'pending_payment', createdAt: '2025-03-01 11:20' },
  { id: 'eval-006', title: '大明第一锦衣卫', genre: '历史', wordCount: 8900, plan: '深度评测', readers: 1000, status: 'completed', score: 8.1, createdAt: '2025-02-28 15:10' },
  { id: 'eval-007', title: '网游之神级玩家', genre: '游戏', wordCount: 6800, plan: '快速评测', readers: 30, status: 'completed', score: 5.9, createdAt: '2025-02-27 08:30' },
];

/* ===== Mock User ===== */
export interface MockUser {
  name: string;
  phone: string;
  avatar: string;
  plan: string;
  credits: number;
}

export const MOCK_USER: MockUser = {
  name: '写书的小明',
  phone: '138****1234',
  avatar: '',
  plan: '标准会员',
  credits: 5,
};

/* ===== Mock Consumption Records ===== */
export interface ConsumptionRecord {
  key: string;
  time: string;
  title: string;
  plan: string;
  cost: string;
}

export const MOCK_CONSUMPTION: ConsumptionRecord[] = [
  { key: '1', time: '2025-03-04 14:32', title: '《我在异界开网吧》', plan: '标准评测', cost: '1 次标准评测' },
  { key: '2', time: '2025-03-03 09:15', title: '《重生之都市修仙》', plan: '快速评测', cost: '免费额度' },
  { key: '3', time: '2025-02-28 15:10', title: '《大明第一锦衣卫》', plan: '深度评测', cost: '¥29.9' },
  { key: '4', time: '2025-02-27 08:30', title: '《网游之神级玩家》', plan: '快速评测', cost: '免费额度' },
];

export interface RechargeRecord {
  key: string;
  time: string;
  product: string;
  amount: string;
  method: string;
  status: string;
}

export const MOCK_RECHARGE: RechargeRecord[] = [
  { key: '1', time: '2025-03-01 10:00', product: '标准评测 x5', amount: '¥49.5', method: '微信支付', status: '成功' },
  { key: '2', time: '2025-02-20 18:30', product: '深度评测 x1', amount: '¥29.9', method: '微信支付', status: '成功' },
  { key: '3', time: '2025-02-15 09:00', product: '月度会员', amount: '¥99.0', method: '微信支付', status: '已过期' },
];

/* ===== Mock Progress Data ===== */
export interface ProgressGroup {
  name: string;
  completed: number;
  total: number;
}

export const MOCK_PROGRESS_GROUPS: ProgressGroup[] = [
  { name: '玄幻类读者', completed: 15, total: 20 },
  { name: '都市类读者', completed: 12, total: 15 },
  { name: '言情类读者', completed: 10, total: 10 },
  { name: '仙侠类读者', completed: 8, total: 15 },
  { name: '科幻类读者', completed: 7, total: 10 },
  { name: '其他类型', completed: 15, total: 30 },
];

export interface ReaderFeedItem {
  reader: MockReader;
  comment: string;
  timeAgo: string;
}

export const MOCK_READER_FEED: ReaderFeedItem[] = [
  { reader: MOCK_READERS[0], comment: '开头直接进入战斗场景，节奏很快，但金手指出现太晚了', timeAgo: '刚刚' },
  { reader: MOCK_READERS[1], comment: '男主出场很有画面感！想看后面跟女主的互动', timeAgo: '30秒前' },
  { reader: MOCK_READERS[2], comment: '系统面板的描写太拖了，建议压缩', timeAgo: '1分钟前' },
  { reader: MOCK_READERS[3], comment: '世界观底层逻辑有缺陷，需要补充设定', timeAgo: '2分钟前' },
  { reader: MOCK_READERS[7], comment: '异界开网吧这个点子太妙了，继续追！', timeAgo: '3分钟前' },
];
