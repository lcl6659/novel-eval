'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Card, Button, Tag, Collapse, Divider,
} from 'antd';
import {
  CheckOutlined, CloseOutlined, CrownOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import { PRICING_PLANS, FAQ_ITEMS } from '@/lib/constants';

const { Title, Text, Paragraph } = Typography;

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 64px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={2}>选择评测方案</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          每一种方案都能为你的开篇提供有价值的反馈
        </Text>
      </div>

      {/* Plan Cards */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 48,
        }}
      >
        {PRICING_PLANS.map((plan) => (
          <Card
            key={plan.key}
            hoverable
            style={{
              width: 300,
              position: 'relative',
              border: plan.recommended ? '2px solid #d4a853' : '1px solid #f0f0f0',
              boxShadow: plan.recommended
                ? '0 8px 24px rgba(212,168,83,0.15)'
                : '0 2px 8px rgba(0,0,0,0.04)',
            }}
            styles={{ body: { padding: 28 } }}
          >
            {plan.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: -1,
                  right: 20,
                  background: '#d4a853',
                  color: '#1a1a2e',
                  padding: '4px 12px',
                  borderRadius: '0 0 8px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {plan.recommended && <CrownOutlined style={{ marginRight: 4 }} />}
                {plan.badge}
              </div>
            )}

            <Title level={4} style={{ textAlign: 'center', marginBottom: 4 }}>{plan.name}</Title>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Text type="secondary">{plan.readers} 位读者 &middot; {plan.duration}</Text>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {plan.features.map((f) => (
                <div key={f.label} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
                  {f.included ? (
                    <CheckOutlined style={{ color: '#52c41a', fontSize: 12, marginTop: 4 }} />
                  ) : (
                    <CloseOutlined style={{ color: '#d9d9d9', fontSize: 12, marginTop: 4 }} />
                  )}
                  <span style={{ color: f.included ? '#1a1a2e' : '#bfbfbf' }}>{f.label}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={2} style={{ margin: 0, color: plan.recommended ? '#d4a853' : '#1a1a2e' }}>
                {plan.priceLabel}
              </Title>
              {plan.price === 0 && <Text type="secondary" style={{ fontSize: 12 }}>每日 1 次</Text>}
              {plan.price > 0 && <Text type="secondary" style={{ fontSize: 12 }}>/ 次</Text>}
            </div>

            <Button
              type={plan.recommended ? 'primary' : 'default'}
              block
              size="large"
              className={plan.recommended ? 'gold-btn' : ''}
              onClick={() => router.push('/submit')}
            >
              {plan.price === 0 ? '免费体验' : '立即购买'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Monthly plan */}
      <Card
        style={{
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto 48px',
          background: 'linear-gradient(135deg, #f9f6f0 0%, #f5f0e8 100%)',
          border: '1px solid #e8dcc8',
        }}
        styles={{ body: { padding: '32px 24px' } }}
      >
        <Title level={4}>包月套餐</Title>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 28, color: '#d4a853' }}>
            {'¥99'}
          </Text>
          <Text type="secondary"> / 月</Text>
        </div>
        <Paragraph type="secondary">
          含 30 次标准评测 &middot; 平均每次仅 ¥3.3
        </Paragraph>
        <Button type="primary" size="large" className="gold-btn">
          开通月度会员
        </Button>
      </Card>

      <Divider />

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          <QuestionCircleOutlined style={{ marginRight: 8 }} />
          常见问题
        </Title>
        <Collapse
          items={FAQ_ITEMS.map((item) => ({
            key: item.key,
            label: <Text strong>{item.question}</Text>,
            children: <Paragraph style={{ margin: 0 }}>{item.answer}</Paragraph>,
          }))}
          bordered={false}
          style={{ background: '#fafafa', borderRadius: 8 }}
        />
      </div>
    </div>
  );
}
