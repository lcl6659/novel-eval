export const NOVEL_TYPES = [
  '玄幻', '都市', '仙侠', '科幻', '言情',
  '悬疑', '历史', '游戏', '轻小说', '现实',
] as const;

export type NovelType = typeof NOVEL_TYPES[number];

export interface PricingPlan {
  key: 'quick' | 'standard' | 'deep';
  name: string;
  readers: number;
  duration: string;
  price: number;
  priceLabel: string;
  recommended?: boolean;
  badge?: string;
  features: { label: string; included: boolean }[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    key: 'quick',
    name: '快速评测',
    readers: 30,
    duration: '约 30 秒',
    price: 0,
    priceLabel: '免费',
    features: [
      { label: '综合评分', included: true },
      { label: '六维度打分', included: true },
      { label: '3条改进建议', included: true },
      { label: '读者留存率', included: true },
      { label: '读者分组分析', included: false },
      { label: '精选评价展示', included: false },
      { label: '弃读点分析', included: false },
      { label: '完整读者画像', included: false },
      { label: '对比评测', included: false },
    ],
  },
  {
    key: 'standard',
    name: '标准评测',
    readers: 100,
    duration: '约 2 分钟',
    price: 9.9,
    priceLabel: '¥9.9',
    recommended: true,
    badge: '推荐',
    features: [
      { label: '综合评分', included: true },
      { label: '六维度打分', included: true },
      { label: '5条改进建议', included: true },
      { label: '读者留存率', included: true },
      { label: '读者分组分析', included: true },
      { label: '精选评价展示', included: true },
      { label: '弃读点分析', included: false },
      { label: '完整读者画像', included: false },
      { label: '对比评测', included: false },
    ],
  },
  {
    key: 'deep',
    name: '深度评测',
    readers: 1000,
    duration: '约 5 分钟',
    price: 29.9,
    priceLabel: '¥29.9',
    badge: '性价比最高',
    features: [
      { label: '综合评分', included: true },
      { label: '六维度打分', included: true },
      { label: '10条改进建议', included: true },
      { label: '读者留存率', included: true },
      { label: '读者分组分析', included: true },
      { label: '精选评价展示', included: true },
      { label: '弃读点分析', included: true },
      { label: '完整读者画像', included: true },
      { label: '对比评测', included: true },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    key: '1',
    question: 'AI 读者的评价准确吗？',
    answer: '我们的 AI 读者基于大量真实读者行为数据训练，每位读者都有独特的阅读偏好、性格特点和审美标准。经实测，AI 读者的评分与真实读者群体的平均评分误差在 5% 以内。',
  },
  {
    key: '2',
    question: '我的小说内容安全吗？会不会泄露？',
    answer: '您的小说内容仅用于评测分析，评测完成后内容将从服务器中自动清除。我们不会存储、分享或二次使用您的作品内容。所有数据传输均使用 HTTPS 加密。',
  },
  {
    key: '3',
    question: '快速评测和标准评测有什么区别？',
    answer: '快速评测使用 30 位 AI 读者，约 30 秒出结果，适合快速了解整体评分。标准评测使用 100 位读者，增加了分组分析和精选评价，能更全面地了解不同类型读者的反馈。深度评测使用 1000 位读者，提供最完整的分析包括弃读点分析和完整读者画像。',
  },
  {
    key: '4',
    question: '评测后还能重新评测吗？',
    answer: '可以。修改作品后可以重新提交评测。系统会保留历史评测记录，您可以对比修改前后的评分变化，看到具体的改进效果。',
  },
  {
    key: '5',
    question: '支持哪些网文类型？',
    answer: '支持所有主流网文类型，包括玄幻、都市、仙侠、科幻、言情、悬疑、历史、游戏、轻小说、现实等。AI 读者群体会根据您选择的类型自动调整比例。',
  },
  {
    key: '6',
    question: '如何申请退款？',
    answer: '如果评测出现异常（如评测失败、结果明显错误等），您可以在个人中心提交退款申请，我们会在 1-3 个工作日内处理。',
  },
];

export const READER_PERSONALITY_TAGS = [
  '挑剔型', '宽容型', '感性型', '速读型', '分析型',
] as const;

export type ReaderPersonality = typeof READER_PERSONALITY_TAGS[number];
