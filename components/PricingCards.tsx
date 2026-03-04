'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, Tag, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, CrownOutlined } from '@ant-design/icons';
import { PRICING_PLANS } from '@/lib/constants';

const { Title, Text } = Typography;

interface PricingCardsProps {
  /** Show full feature list (pricing page) vs compact (homepage) */
  detailed?: boolean;
}

export default function PricingCards({ detailed = false }: PricingCardsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      {PRICING_PLANS.map((plan) => {
        const isRecommended = plan.recommended;
        const displayFeatures = detailed ? plan.features : plan.features.slice(0, 6);

        return (
          <Card
            key={plan.key}
            className="card-hover"
            style={{
              width: detailed ? 320 : 280,
              position: 'relative',
              border: isRecommended ? '2px solid #d4a853' : '1px solid #f0f0f0',
              boxShadow: isRecommended
                ? '0 8px 24px rgba(212,168,83,0.2)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              transform: isRecommended ? 'scale(1.05)' : 'none',
              zIndex: isRecommended ? 1 : 0,
            }}
            styles={{ body: { padding: 24 } }}
          >
            {/* Ribbon */}
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
                {isRecommended && <CrownOutlined style={{ marginRight: 4 }} />}
                {plan.badge}
              </div>
            )}

            {/* Plan Name */}
            <Title level={4} style={{ marginBottom: 4, textAlign: 'center' }}>
              {plan.name}
            </Title>

            {/* Readers & Duration */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Text type="secondary">{plan.readers} 位读者 · {plan.duration}</Text>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 20 }}>
              {displayFeatures.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  {f.included ? (
                    <CheckOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                  ) : (
                    <CloseOutlined style={{ color: '#d9d9d9', fontSize: 12 }} />
                  )}
                  <span style={{ color: f.included ? '#1a1a2e' : '#bfbfbf' }}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: isRecommended ? '#d4a853' : '#1a1a2e',
                }}
              >
                {plan.priceLabel}
              </Title>
              {plan.price === 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>每日 1 次</Text>
              )}
              {plan.price > 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>/ 次</Text>
              )}
            </div>

            {/* CTA */}
            <Link href="/submit">
              <Button
                type="primary"
                block
                size="large"
                className={isRecommended ? 'gold-btn' : ''}
              >
                {plan.price === 0 ? '开始评测' : '立即购买'}
              </Button>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
