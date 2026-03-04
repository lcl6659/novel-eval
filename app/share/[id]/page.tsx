'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Card, Statistic, Button, Divider, Space, Row, Col, Tag } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { MOCK_DIMENSION_SCORES, MOCK_SUGGESTIONS } from '@/lib/mock-data';
import dynamic from 'next/dynamic';

const { Title, Text, Paragraph } = Typography;

const RadarChart = dynamic(() => import('@/components/charts/RadarChart'), { ssr: false });

function getScoreColor(score: number) {
  if (score >= 8) return '#52c41a';
  if (score >= 6) return '#1677ff';
  return '#fa8c16';
}

export default function SharePage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16, color: '#d4a853', letterSpacing: 2 }}>
          千读测评
        </Text>
        <Title level={3} style={{ marginTop: 8, marginBottom: 4 }}>
          《我在异界开网吧》的评测报告
        </Title>
      </div>

      {/* Core Metrics */}
      <Card style={{ marginBottom: 24 }} styles={{ body: { padding: '24px 16px' } }}>
        <Row gutter={16} justify="center">
          <Col span={8} style={{ textAlign: 'center' }}>
            <Statistic
              title="综合评分"
              value={7.2}
              suffix="/ 10"
              valueStyle={{ color: getScoreColor(7.2), fontSize: 28, fontWeight: 700 }}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <Statistic
              title="留存率"
              value={73}
              suffix="%"
              valueStyle={{ color: '#1677ff', fontSize: 28, fontWeight: 700 }}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <Statistic
              title="评测读者"
              value={100}
              suffix="位"
              valueStyle={{ fontSize: 28, fontWeight: 700 }}
            />
          </Col>
        </Row>
      </Card>

      {/* Radar */}
      <Card title="多维度评分" style={{ marginBottom: 24 }}>
        <RadarChart data={MOCK_DIMENSION_SCORES} />
      </Card>

      {/* Top 3 Suggestions */}
      <Card title="Top 3 改进建议" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MOCK_SUGGESTIONS.map((s, i) => {
            const priorityColors: Record<string, string> = { P0: '#ff4d4f', P1: '#faad14', P2: '#52c41a' };
            return (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <Tag
                  color={priorityColors[s.priority]}
                  style={{ fontWeight: 600, flexShrink: 0, height: 22 }}
                >
                  {s.priority}
                </Tag>
                <div>
                  <Text strong style={{ fontSize: 14 }}>{s.title}</Text>
                  <Paragraph style={{ margin: '4px 0 0', fontSize: 13, color: '#595959' }}>
                    {s.problem}
                  </Paragraph>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* CTA */}
      <Divider style={{ borderColor: '#f0f0f0' }} />
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          想知道你的网文开篇能打几分？
        </Title>
        <Button
          type="primary"
          size="large"
          className="gold-btn"
          icon={<RocketOutlined />}
          onClick={() => router.push('/')}
          style={{ height: 48, padding: '0 32px', fontSize: 16 }}
        >
          免费体验千读测评
        </Button>
      </div>
      <Divider style={{ borderColor: '#f0f0f0' }} />
    </div>
  );
}
