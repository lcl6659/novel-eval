'use client';

import React, { useEffect, useRef } from 'react';
import { Card, Avatar, Tag, Typography } from 'antd';
import { MOCK_READERS } from '@/lib/mock-data';

const { Text } = Typography;

export default function ReaderShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => { animationId = requestAnimationFrame(scroll); };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause);
    el.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  // Double the readers for seamless loop
  const displayReaders = [...MOCK_READERS, ...MOCK_READERS];

  return (
    <section style={{ padding: '80px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 12,
          }}
        >
          1000 位读者，每一位都有独特的身份
        </h2>
        <p style={{ color: '#8c8c8c', fontSize: 16, marginBottom: 48 }}>
          横向滚动查看更多读者 · 共 1000 位
        </p>
      </div>

      <div
        ref={scrollRef}
        className="reader-scroll"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {displayReaders.map((reader, i) => (
          <Card
            key={`${reader.id}-${i}`}
            className="card-hover"
            style={{
              width: 180,
              minHeight: 280,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center',
            }}
            styles={{ body: { padding: 16 } }}
          >
            <Avatar
              size={48}
              style={{
                backgroundColor: reader.avatarColor,
                fontSize: 24,
                marginBottom: 8,
              }}
            >
              {reader.emoji}
            </Avatar>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#1a1a2e' }}>
              {reader.name}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {reader.age}岁 {reader.gender} · 书龄{reader.readingYears}年
            </Text>
            <div style={{ margin: '8px 0' }}>
              <Tag color="blue" style={{ fontSize: 11 }}>{reader.preferredGenres[0]}</Tag>
              <Tag style={{ fontSize: 11 }}>{reader.personality}</Tag>
            </div>
            <Text
              style={{
                fontSize: 12,
                color: '#8c8c8c',
                fontStyle: 'italic',
                display: 'block',
                lineHeight: 1.5,
              }}
            >
              {'"'}{reader.catchphrase}{'"'}
            </Text>
          </Card>
        ))}
      </div>
    </section>
  );
}
