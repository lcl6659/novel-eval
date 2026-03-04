'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

export default function CtaSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          color: '#ffffff',
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        还在犹豫？免费试一次就知道了
      </h2>
      <Link href="/submit">
        <Button
          className="gold-btn"
          size="large"
          icon={<RocketOutlined />}
          style={{
            height: 48,
            paddingInline: 40,
            borderRadius: 24,
            fontSize: 16,
          }}
        >
          免费提交你的开篇
        </Button>
      </Link>
    </section>
  );
}
