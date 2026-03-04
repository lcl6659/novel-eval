'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Card, Statistic, Button, Space, Tag, Progress as AntProgress,
  Collapse, Alert, Tabs, List, Avatar, Divider, Row, Col,
} from 'antd';
import {
  ShareAltOutlined, DownloadOutlined, RedoOutlined, ArrowLeftOutlined,
  EditOutlined, RocketOutlined, CheckCircleFilled, WarningFilled,
  BulbOutlined, RiseOutlined, FallOutlined,
} from '@ant-design/icons';
import {
  MOCK_DIMENSION_SCORES, MOCK_FUNNEL_DATA, MOCK_GROUP_SCORES,
  MOCK_COMMENTS, MOCK_SUGGESTIONS,
} from '@/lib/mock-data';
import dynamic from 'next/dynamic';

const { Title, Text, Paragraph } = Typography;

/* Dynamic imports for charts (SSR-safe) */
const RadarChart = dynamic(() => import('@/components/charts/RadarChart'), { ssr: false });
const FunnelChart = dynamic(() => import('@/components/charts/FunnelChart'), { ssr: false });
const GroupBarChart = dynamic(() => import('@/components/charts/GroupBarChart'), { ssr: false });

function getScoreColor(score: number) {
  if (score >= 8) return '#52c41a';
  if (score >= 6) return '#1677ff';
  return '#fa8c16';
}

export default function ReportPage() {
  const router = useRouter();
  const [commentFilter, setCommentFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [showCount, setShowCount] = useState(3);

  const overallScore = 7.2;
  const retention = 73;
  const readerCount = 100;

  const filteredComments = MOCK_COMMENTS.filter(
    (c) => commentFilter === 'all' || c.type === commentFilter,
  );

  const minDim = [...MOCK_DIMENSION_SCORES].sort((a, b) => a.score - b.score)[0];
  const maxDim = [...MOCK_DIMENSION_SCORES].sort((a, b) => b.score - a.score)[0];

  const genreScores = MOCK_GROUP_SCORES.filter((g) => g.type === 'genre');
  const personalityScores = MOCK_GROUP_SCORES.filter((g) => g.type === 'personality');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Back */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/history')}
        style={{ padding: 0, marginBottom: 16, color: '#8c8c8c' }}
      >
        返回历史记录
      </Button>

      {/* ====== Section A: Report Header ====== */}
      <Card style={{ marginBottom: 24, textAlign: 'center' }} styles={{ body: { padding: '32px 24px' } }}>
        <Title level={4} style={{ marginBottom: 4 }}>评测报告</Title>
        <Title level={3} style={{ marginBottom: 8 }}>《我在异界开网吧》</Title>
        <Text type="secondary">
          玄幻 &middot; 8,234 字 &middot; 标准评测 &middot; 100 位读者
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>评测时间：2025-03-04 14:32</Text>

        <Row gutter={24} justify="center" style={{ marginTop: 32 }}>
          <Col xs={8}>
            <Statistic
              title="综合评分"
              value={overallScore}
              suffix="/ 10"
              valueStyle={{ color: getScoreColor(overallScore), fontSize: 36, fontWeight: 700 }}
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title="读者留存率"
              value={retention}
              suffix="%"
              valueStyle={{ color: '#1677ff', fontSize: 36, fontWeight: 700 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{retention}位愿意继续阅读</Text>
          </Col>
          <Col xs={8}>
            <Statistic
              title="评测读者数"
              value={readerCount}
              suffix="位"
              valueStyle={{ color: '#1a1a2e', fontSize: 36, fontWeight: 700 }}
            />
          </Col>
        </Row>

        <Space wrap style={{ marginTop: 24 }}>
          <Button icon={<ShareAltOutlined />} onClick={() => router.push('/share/eval-001')}>
            分享报告
          </Button>
          <Button icon={<DownloadOutlined />}>下载 PDF</Button>
          <Button icon={<RedoOutlined />} onClick={() => router.push('/submit')}>
            重新评测
          </Button>
        </Space>
      </Card>

      {/* ====== Section B: Radar Chart ====== */}
      <Card title="多维度评分" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <RadarChart data={MOCK_DIMENSION_SCORES} />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
              {MOCK_DIMENSION_SCORES.map((d) => (
                <div key={d.dimension}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 14 }}>{d.dimension}</Text>
                    <Text strong style={{ color: getScoreColor(d.score) }}>{d.score}</Text>
                  </div>
                  <AntProgress
                    percent={d.score * 10}
                    showInfo={false}
                    strokeColor={getScoreColor(d.score)}
                    size="small"
                  />
                </div>
              ))}
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 13 }}>
                <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                最高分维度：{maxDim.dimension}（{maxDim.score}）
              </Text>
              <Text style={{ fontSize: 13 }}>
                <FallOutlined style={{ color: '#fa8c16', marginRight: 4 }} />
                最低分维度：{minDim.dimension}（{minDim.score}）
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* ====== Section C: Funnel ====== */}
      <Card title="读者留存分析" style={{ marginBottom: 24 }}>
        <FunnelChart data={MOCK_FUNNEL_DATA} />
        <Alert
          type="warning"
          showIcon
          icon={<WarningFilled />}
          style={{ marginTop: 16 }}
          message="主要弃读区间：第 1,500 ~ 2,500 字"
          description="11 位读者在此区间选择弃读，占弃读总数的 41%。读者反馈关键词：节奏拖沓、缺乏冲突、信息量过大"
        />
      </Card>

      {/* ====== Section D: Group Scores ====== */}
      <Card title="不同类型读者怎么看？" style={{ marginBottom: 24 }}>
        <Tabs
          items={[
            {
              key: 'genre',
              label: '按偏好类型分组',
              children: <GroupBarChart data={genreScores} />,
            },
            {
              key: 'personality',
              label: '按阅读性格分组',
              children: <GroupBarChart data={personalityScores} />,
            },
          ]}
        />
        <Card
          size="small"
          style={{ background: '#f6ffed', border: '1px solid #b7eb8f', marginTop: 16 }}
        >
          <Text strong style={{ fontSize: 13 }}>
            <BulbOutlined style={{ color: '#52c41a', marginRight: 6 }} />
            关键发现：
          </Text>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20, fontSize: 13, color: '#595959' }}>
            <li>你的开篇最受玄幻爱好者欢迎（8.1分），言情爱好者评价最低（5.3）</li>
            <li>挑剔型读者普遍扣分在"节奏感"维度，宽容型读者整体好评</li>
          </ul>
        </Card>
      </Card>

      {/* ====== Section E: Comments ====== */}
      <Card
        title="读者怎么说？"
        extra={
          <Tabs
            size="small"
            activeKey={commentFilter}
            onChange={(k) => { setCommentFilter(k as typeof commentFilter); setShowCount(3); }}
            items={[
              { key: 'all', label: '全部评价' },
              { key: 'positive', label: '好评精选' },
              { key: 'negative', label: '差评精选' },
            ]}
          />
        }
        style={{ marginBottom: 24 }}
      >
        <List
          itemLayout="vertical"
          dataSource={filteredComments.slice(0, showCount)}
          renderItem={(item) => (
            <List.Item style={{ padding: '16px 0' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Avatar style={{ background: item.avatarColor, flexShrink: 0, fontSize: 16 }} size={40}>
                  {item.readerName[0]}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <Text strong>{item.readerName}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.age}岁 &middot; 书龄{item.readingYears}年 &middot; {item.genre} &middot; {item.personality}
                    </Text>
                    <Tag
                      color={item.score >= 7 ? 'green' : item.score >= 5 ? 'blue' : 'orange'}
                      style={{ marginLeft: 'auto' }}
                    >
                      评分 {item.score}
                    </Tag>
                  </div>
                  <Paragraph style={{ margin: 0, color: '#595959', fontSize: 14 }}>
                    {`"${item.comment}"`}
                  </Paragraph>
                </div>
              </div>
            </List.Item>
          )}
        />
        {showCount < filteredComments.length && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 13, marginRight: 12 }}>
              显示 {showCount} / {filteredComments.length} 条评价
            </Text>
            <Button type="link" onClick={() => setShowCount((c) => c + 10)}>
              加载更多
            </Button>
          </div>
        )}
      </Card>

      {/* ====== Section F: Suggestions ====== */}
      <Card
        title={
          <Space>
            <BulbOutlined style={{ color: '#d4a853' }} />
            <span>改进建议</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          基于 100 位读者的反馈，AI 为你总结了以下改进方向：
        </Text>
        <Collapse
          defaultActiveKey={['0']}
          accordion
          items={MOCK_SUGGESTIONS.map((s, i) => {
            const priorityColors: Record<string, string> = { P0: '#ff4d4f', P1: '#faad14', P2: '#52c41a' };
            return {
              key: String(i),
              label: (
                <Space>
                  <Tag color={priorityColors[s.priority]} style={{ fontWeight: 600 }}>
                    {s.priority}
                  </Tag>
                  <Text strong>{s.title}</Text>
                </Space>
              ),
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>问题</Text>
                    <Paragraph style={{ margin: 0 }}>{s.problem}</Paragraph>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>建议</Text>
                    <Paragraph style={{ margin: 0 }}>{s.advice}</Paragraph>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>数据支撑</Text>
                    <Paragraph style={{ margin: 0, color: '#8c8c8c', fontStyle: 'italic' }}>
                      {s.reference}
                    </Paragraph>
                  </div>
                </div>
              ),
            };
          })}
        />
      </Card>

      {/* ====== Section G: Bottom Actions ====== */}
      <Row gutter={[16, 16]}>
        <Col xs={12}>
          <Card
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => router.push('/share/eval-001')}
          >
            <ShareAltOutlined style={{ fontSize: 28, color: '#1677ff', marginBottom: 8 }} />
            <div><Text strong>分享给朋友</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>生成分享图片/链接</Text>
          </Card>
        </Col>
        <Col xs={12}>
          <Card
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => router.push('/submit')}
          >
            <RedoOutlined style={{ fontSize: 28, color: '#52c41a', marginBottom: 8 }} />
            <div><Text strong>修改后重新评测</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>看看修改后是否有提升</Text>
          </Card>
        </Col>
        <Col xs={12}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
            <RocketOutlined style={{ fontSize: 28, color: '#d4a853', marginBottom: 8 }} />
            <div><Text strong>升级深度评测</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>解锁1000读者完整分析</Text>
          </Card>
        </Col>
        <Col xs={12}>
          <Card
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => router.push('/submit')}
          >
            <EditOutlined style={{ fontSize: 28, color: '#722ed1', marginBottom: 8 }} />
            <div><Text strong>提交新作品</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>评测另一篇开篇</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
