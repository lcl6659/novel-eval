'use client';

import React from 'react';
import { Card, Progress, Tag, Space, Typography } from 'antd';
import { MOCK_DIMENSION_SCORES, MOCK_GROUP_SCORES } from '@/lib/mock-data';

const { Title, Text } = Typography;

export default function ReportPreview() {
  const genreScores = MOCK_GROUP_SCORES.filter((g) => g.type === 'genre').slice(0, 4);

  return (
    <section
      style={{
        padding: '80px 24px',
        background: '#f0f2f5',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 12,
          }}
        >
          看看评测报告长什么样
        </h2>
        <p style={{ color: '#8c8c8c', fontSize: 16, marginBottom: 48 }}>
          这是一份真实的评测报告（已脱敏）
        </p>

        <Card
          style={{
            maxWidth: 900,
            margin: '0 auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: 'none',
            textAlign: 'left',
            transform: 'perspective(1200px) rotateY(-2deg)',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'perspective(1200px) rotateY(0deg)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'perspective(1200px) rotateY(-2deg)';
          }}
        >
          {/* Report Header */}
          <div style={{ marginBottom: 24 }}>
            <Tag color="#d4a853" style={{ marginBottom: 8, color: '#1a1a2e', fontWeight: 600 }}>
              示例评测报告
            </Tag>
            <div
              style={{
                display: 'flex',
                gap: 40,
                flexWrap: 'wrap',
                marginTop: 16,
              }}
            >
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>综合评分</Text>
                <Title level={3} style={{ margin: '4px 0 0', color: '#1677ff' }}>
                  7.2 <span style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c' }}>/ 10</span>
                </Title>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>读者留存率</Text>
                <Title level={3} style={{ margin: '4px 0 0', color: '#52c41a' }}>73%</Title>
              </div>
            </div>
          </div>

          {/* Two columns on desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 32,
              marginBottom: 24,
            }}
          >
            {/* Radar substitute - dimension list */}
            <div>
              <Title level={5} style={{ marginBottom: 16 }}>六维度评分</Title>
              {MOCK_DIMENSION_SCORES.map((d) => (
                <div key={d.dimension} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{d.dimension}</Text>
                    <Text strong style={{ fontSize: 13 }}>{d.score}</Text>
                  </div>
                  <Progress
                    percent={d.score * 10}
                    showInfo={false}
                    size="small"
                    strokeColor={d.score >= 8 ? '#52c41a' : d.score >= 6 ? '#1677ff' : '#fa8c16'}
                  />
                </div>
              ))}
            </div>

            {/* Group scores */}
            <div>
              <Title level={5} style={{ marginBottom: 16 }}>读者分组评分</Title>
              {genreScores.map((g) => (
                <div key={g.group} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{g.group}</Text>
                    <Text strong style={{ fontSize: 13 }}>{g.score}</Text>
                  </div>
                  <Progress
                    percent={g.score * 10}
                    showInfo={false}
                    size="small"
                    strokeColor={g.score >= 8 ? '#52c41a' : g.score >= 6 ? '#1677ff' : '#fa8c16'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top improvements */}
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Top 改进建议</Title>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Tag color="red" style={{ flexShrink: 0 }}>P0</Tag>
                <Text style={{ fontSize: 13 }}>前 2000 字缺少核心冲突，建议将核心事件前移</Text>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Tag color="gold" style={{ flexShrink: 0 }}>P1</Tag>
                <Text style={{ fontSize: 13 }}>主角性格特征不够鲜明，需通过行为展示</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    </section>
  );
}
