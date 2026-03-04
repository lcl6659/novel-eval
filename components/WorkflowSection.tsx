'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import { EditOutlined, TeamOutlined, BarChartOutlined, ArrowRightOutlined } from '@ant-design/icons';

const steps = [
  {
    icon: <EditOutlined style={{ fontSize: 40, color: '#d4a853' }} />,
    title: '提交开篇',
    desc: '粘贴你的网文开篇\n5000-10000 字',
  },
  {
    icon: <TeamOutlined style={{ fontSize: 40, color: '#d4a853' }} />,
    title: '千人阅读',
    desc: '1000 位 AI 读者阅读\n并给出评价',
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 40, color: '#d4a853' }} />,
    title: '获取报告',
    desc: '多维度评分\n+ 改进建议即时可查',
  },
];

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="workflow"
      ref={sectionRef}
      style={{
        padding: '80px 24px',
        background: '#ffffff',
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
          评测如何运作？
        </h2>
        <p style={{ color: '#8c8c8c', fontSize: 16, marginBottom: 56 }}>
          最快 30 秒出结果 · 支持所有网文类型
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step.title}>
              <Card
                className="card-hover"
                style={{
                  width: 280,
                  textAlign: 'center',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease ${i * 0.2}s`,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(212,168,83,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  {step.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ color: '#8c8c8c', fontSize: 14, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </Card>

              {i < steps.length - 1 && (
                <div
                  className="hide-mobile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 60,
                    color: '#d4a853',
                    fontSize: 24,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.6s ease ${i * 0.2 + 0.3}s`,
                  }}
                >
                  <ArrowRightOutlined />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
