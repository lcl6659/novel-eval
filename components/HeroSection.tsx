'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Space } from 'antd';
import { RocketOutlined, ArrowDownOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overflow: 'hidden',
        padding: '80px 24px 60px',
      }}
    >
      {/* Particle background */}
      <div className="hero-particles" />

      {/* Extra floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: i % 2 === 0 ? 3 : 5,
            height: i % 2 === 0 ? 3 : 5,
            background: `rgba(212, 168, 83, ${0.15 + (i * 0.05)})`,
            borderRadius: '50%',
            top: `${15 + i * 13}%`,
            left: `${10 + i * 15}%`,
            animation: `floatParticle ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ textAlign: 'center', maxWidth: 720, position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 20,
            textWrap: 'balance',
          }}
        >
          你的开篇，值得被 1000 位读者认真阅读
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            lineHeight: 1.7,
            marginBottom: 40,
            textWrap: 'pretty',
          }}
        >
          提交网文开篇 5000~10000 字，1000 位 AI 模拟读者
          <br />
          将从不同视角为你打分、点评，帮你找到读者流失的原因
        </p>

        {/* CTA Buttons */}
        <Space size={16} wrap style={{ justifyContent: 'center' }}>
          <Link href="/submit">
            <Button
              className="gold-btn"
              size="large"
              icon={<RocketOutlined />}
              style={{
                height: 48,
                paddingInline: 32,
                borderRadius: 24,
                fontSize: 16,
              }}
            >
              免费体验一次
            </Button>
          </Link>
          <Button
            size="large"
            ghost
            icon={<ArrowDownOutlined />}
            onClick={() => {
              document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              height: 48,
              paddingInline: 24,
              borderRadius: 24,
              fontSize: 16,
              borderColor: 'rgba(255,255,255,0.6)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            了解更多
          </Button>
        </Space>

        {/* Stats */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 15,
          }}
        >
          <span>
            已有{' '}
            <span style={{ color: '#d4a853', fontWeight: 600 }}>
              <CountUp end={12580} duration={2.5} separator="," />
            </span>{' '}
            篇开篇完成测评
          </span>
          <span style={{ opacity: 0.4 }}>{'·'}</span>
          <span>
            平均提升留存率{' '}
            <span style={{ color: '#d4a853', fontWeight: 600 }}>
              <CountUp end={23} duration={2} suffix="%" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
