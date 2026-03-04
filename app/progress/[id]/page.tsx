'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Progress, Card, Typography, Steps, Button, Tag, Avatar, Space,
} from 'antd';
import {
  CheckCircleFilled, LoadingOutlined, ClockCircleOutlined,
  ArrowLeftOutlined, ArrowRightOutlined, BellOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { MOCK_PROGRESS_GROUPS, MOCK_READER_FEED, type ReaderFeedItem } from '@/lib/mock-data';

const { Title, Text, Paragraph } = Typography;

/* ---------- helper: confetti ---------- */
function fireConfetti() {
  if (typeof window === 'undefined') return;
  import('canvas-confetti').then((mod) => {
    const confetti = mod.default;
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } }), 300);
  });
}

export default function ProgressPage() {
  const router = useRouter();

  /* ---- simulated progress ---- */
  const [completed, setCompleted] = useState(0);
  const total = 100;
  const [phase, setPhase] = useState(0); // 0=preprocessing, 1=assigning, 2=reading, 3=summarizing, 4=report, 5=done
  const [groups, setGroups] = useState(
    MOCK_PROGRESS_GROUPS.map((g) => ({ ...g, completed: 0 })),
  );
  const [feeds, setFeeds] = useState<ReaderFeedItem[]>([]);
  const [done, setDone] = useState(false);
  const feedIdx = useRef(0);

  const tick = useCallback(() => {
    setCompleted((prev) => {
      if (prev >= total) return total;
      const next = Math.min(prev + Math.ceil(Math.random() * 3), total);

      // Update groups proportionally
      setGroups((gs) =>
        gs.map((g) => ({
          ...g,
          completed: Math.min(Math.round((next / total) * g.total), g.total),
        })),
      );

      return next;
    });
  }, [total]);

  /* Phase progression */
  useEffect(() => {
    // Phase 0 -> 1 after 0.8s
    const t0 = setTimeout(() => setPhase(1), 800);
    // Phase 1 -> 2 after 1.6s
    const t1 = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, []);

  /* Progress ticking during phase 2 */
  useEffect(() => {
    if (phase < 2) return;
    const interval = setInterval(() => {
      tick();
    }, 400);
    return () => clearInterval(interval);
  }, [phase, tick]);

  /* Feed messages */
  useEffect(() => {
    if (phase < 2) return;
    const interval = setInterval(() => {
      if (feedIdx.current < MOCK_READER_FEED.length) {
        setFeeds((prev) => [MOCK_READER_FEED[feedIdx.current], ...prev].slice(0, 5));
        feedIdx.current += 1;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [phase]);

  /* Completion detection */
  useEffect(() => {
    if (completed >= total && phase >= 2 && !done) {
      setTimeout(() => setPhase(3), 500);
      setTimeout(() => setPhase(4), 1200);
      setTimeout(() => {
        setPhase(5);
        setDone(true);
        fireConfetti();
      }, 2000);
    }
  }, [completed, phase, done, total]);

  const percent = Math.round((completed / total) * 100);

  const stepsItems = [
    {
      title: '文本预处理',
      description: phase >= 1 ? '已完成' : '处理中...',
      status: phase >= 1 ? 'finish' as const : 'process' as const,
      icon: phase >= 1 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <LoadingOutlined style={{ color: '#1677ff' }} />,
    },
    {
      title: `读者分配（${total}位）`,
      description: phase >= 2 ? '已完成' : phase >= 1 ? '分配中...' : '等待中',
      status: phase >= 2 ? 'finish' as const : phase >= 1 ? 'process' as const : 'wait' as const,
      icon: phase >= 2 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : phase >= 1 ? <LoadingOutlined style={{ color: '#1677ff' }} /> : <ClockCircleOutlined style={{ color: '#bfbfbf' }} />,
    },
    {
      title: '读者评测中',
      description: phase >= 3 ? '已完成' : phase >= 2 ? `${completed}/${total}` : '等待中',
      status: phase >= 3 ? 'finish' as const : phase >= 2 ? 'process' as const : 'wait' as const,
      icon: phase >= 3 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : phase >= 2 ? <LoadingOutlined style={{ color: '#1677ff' }} /> : <ClockCircleOutlined style={{ color: '#bfbfbf' }} />,
    },
    {
      title: '分组汇总分析',
      description: phase >= 4 ? '已完成' : phase >= 3 ? '分析中...' : '等待中',
      status: phase >= 4 ? 'finish' as const : phase >= 3 ? 'process' as const : 'wait' as const,
      icon: phase >= 4 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : phase >= 3 ? <LoadingOutlined style={{ color: '#1677ff' }} /> : <ClockCircleOutlined style={{ color: '#bfbfbf' }} />,
    },
    {
      title: '最终报告生成',
      description: phase >= 5 ? '已完成' : phase >= 4 ? '生成中...' : '等待中',
      status: phase >= 5 ? 'finish' as const : phase >= 4 ? 'process' as const : 'wait' as const,
      icon: phase >= 5 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : phase >= 4 ? <LoadingOutlined style={{ color: '#1677ff' }} /> : <ClockCircleOutlined style={{ color: '#bfbfbf' }} />,
    },
  ];

  const remainingSeconds = done ? 0 : Math.max(0, Math.round(((total - completed) / total) * 45));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Back button */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/')}
        style={{ padding: 0, marginBottom: 16, color: '#8c8c8c' }}
      >
        返回首页
      </Button>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          {done ? '评测完成！' : '《我在异界开网吧》'}
        </Title>
        <Text type="secondary">标准评测 &middot; 100 位读者</Text>
      </div>

      {/* Circular Progress */}
      <Card
        style={{
          textAlign: 'center',
          marginBottom: 24,
          background: done ? 'linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%)' : undefined,
        }}
        styles={{ body: { padding: '40px 24px' } }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Pulse ring animation */}
          {!done && phase >= 2 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '2px solid rgba(212,168,83,0.3)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}
          <Progress
            type="circle"
            percent={percent}
            size={180}
            strokeColor={{
              '0%': '#1677ff',
              '100%': '#d4a853',
            }}
            format={() =>
              done ? (
                <CheckCircleFilled style={{ fontSize: 56, color: '#d4a853' }} />
              ) : (
                <div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
                    {percent}%
                  </div>
                  <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                    {completed} / {total} 位
                  </div>
                  <div style={{ fontSize: 12, color: '#bfbfbf' }}>
                    读者已完成阅读
                  </div>
                </div>
              )
            }
          />
        </div>

        {!done && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              预计剩余时间：约 {remainingSeconds} 秒
            </Text>
          </div>
        )}

        {done && (
          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              size="large"
              className="gold-btn"
              icon={<FileTextOutlined />}
              onClick={() => router.push('/report/eval-001')}
            >
              查看完整评测报告 <ArrowRightOutlined />
            </Button>
          </div>
        )}
      </Card>

      {/* Phase Steps */}
      <Card
        title="评测阶段"
        style={{ marginBottom: 24 }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Steps
          direction="vertical"
          size="small"
          items={stepsItems}
          style={{ marginBottom: phase >= 2 && !done ? 16 : 0 }}
        />

        {/* Group progress bars - show when in reading phase */}
        {phase >= 2 && (
          <div style={{ paddingLeft: 36, marginTop: 8 }}>
            {groups.map((g) => {
              const gPercent = Math.round((g.completed / g.total) * 100);
              const isDone = g.completed >= g.total;
              return (
                <div
                  key={g.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      width: 110,
                      flexShrink: 0,
                      color: isDone ? '#52c41a' : '#595959',
                    }}
                  >
                    {g.name}
                  </Text>
                  <Progress
                    percent={gPercent}
                    size="small"
                    style={{ flex: 1, margin: 0 }}
                    strokeColor={isDone ? '#52c41a' : '#1677ff'}
                    format={() => (
                      <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                        {g.completed}/{g.total}
                        {isDone && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 4, fontSize: 11 }} />}
                      </span>
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Real-time Reader Feed */}
      {feeds.length > 0 && (
        <Card
          title={
            <Space>
              <span>实时读者动态</span>
              <Tag color="blue" style={{ fontWeight: 400 }}>最新评价预览</Tag>
            </Space>
          }
          style={{ marginBottom: 24 }}
          styles={{ body: { padding: '12px 24px' } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {feeds.map((feed, i) => (
              <div
                key={`${feed.reader.id}-${i}`}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: i === 0 ? '#f6ffed' : '#fafafa',
                  animation: i === 0 ? 'slideUp 0.4s ease-out' : undefined,
                  transition: 'opacity 0.3s',
                  opacity: i >= 4 ? 0.5 : 1,
                }}
              >
                <Avatar
                  style={{
                    background: feed.reader.avatarColor,
                    flexShrink: 0,
                    fontSize: 16,
                  }}
                  size={36}
                >
                  {feed.reader.name[0]}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 13 }}>{feed.reader.name}</Text>
                    <Tag
                      style={{ fontSize: 11, lineHeight: '18px', margin: 0 }}
                      color="default"
                    >
                      {feed.reader.preferredGenres[0]}/{feed.reader.personality}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 'auto' }}>
                      {feed.timeAgo}
                    </Text>
                  </div>
                  <Paragraph
                    style={{ margin: 0, fontSize: 13, color: '#595959' }}
                    ellipsis={{ rows: 2 }}
                  >
                    {`"${feed.comment}"`}
                  </Paragraph>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Bottom hint */}
      {!done && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <BellOutlined style={{ color: '#d4a853', marginRight: 6 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            可以关闭此页面，评测完成后会通过微信通知你
          </Text>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
