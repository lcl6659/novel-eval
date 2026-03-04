'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Button, Input, Select, Tag, Empty, List, Progress, Space,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EyeOutlined, ReloadOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { MOCK_EVAL_HISTORY, type EvalRecord, type EvalStatus } from '@/lib/mock-data';

const { Title, Text } = Typography;

const STATUS_MAP: Record<EvalStatus, { label: string; color: string }> = {
  completed: { label: '已完成', color: 'green' },
  running: { label: '评测中', color: 'blue' },
  failed: { label: '评测失败', color: 'red' },
  pending_payment: { label: '待支付', color: 'orange' },
};

function getScoreColor(s: number) {
  if (s >= 8) return '#52c41a';
  if (s >= 6) return '#1677ff';
  return '#fa8c16';
}

export default function HistoryPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return MOCK_EVAL_HISTORY.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (genreFilter !== 'all' && r.genre !== genreFilter) return false;
      if (search && !r.title.includes(search)) return false;
      return true;
    });
  }, [statusFilter, genreFilter, search]);

  const genres = [...new Set(MOCK_EVAL_HISTORY.map((r) => r.genre))];

  function getAction(record: EvalRecord) {
    switch (record.status) {
      case 'completed':
        return (
          <Button type="link" icon={<EyeOutlined />} onClick={() => router.push(`/report/${record.id}`)}>
            查看报告
          </Button>
        );
      case 'running':
        return (
          <Button type="link" icon={<EyeOutlined />} onClick={() => router.push(`/progress/${record.id}`)}>
            查看进度
          </Button>
        );
      case 'failed':
        return (
          <Button type="link" icon={<ReloadOutlined />} onClick={() => router.push('/submit')}>
            重新评测
          </Button>
        );
      case 'pending_payment':
        return (
          <Button type="link" icon={<DollarOutlined />} style={{ color: '#fa8c16' }}>
            继续支付
          </Button>
        );
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>我的评测记录</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/submit')}>
          新建评测
        </Button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
          padding: '12px 16px', background: '#fafafa', borderRadius: 8,
        }}
      >
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'completed', label: '已完成' },
            { value: 'running', label: '评测中' },
            { value: 'failed', label: '失败' },
            { value: 'pending_payment', label: '待支付' },
          ]}
        />
        <Select
          value={genreFilter}
          onChange={setGenreFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部类型' },
            ...genres.map((g) => ({ value: g, label: g })),
          ]}
        />
        <Input
          placeholder="搜索标题..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Empty
          description="还没有评测记录，提交你的第一篇开篇吧！"
          style={{ padding: '64px 0' }}
        >
          <Button type="primary" onClick={() => router.push('/submit')}>开始评测</Button>
        </Empty>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={(record) => {
            const status = STATUS_MAP[record.status];
            return (
              <List.Item
                actions={[getAction(record)]}
                style={{
                  padding: '16px',
                  marginBottom: 8,
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Text strong style={{ fontSize: 15 }}>{`《${record.title}》`}</Text>
                      {record.status === 'completed' && record.score !== undefined && (
                        <Tag style={{ fontWeight: 700, fontSize: 14 }} color={getScoreColor(record.score)}>
                          {record.score} 分
                        </Tag>
                      )}
                      {record.status === 'running' && record.progress !== undefined && (
                        <Progress
                          percent={record.progress}
                          size="small"
                          style={{ width: 80, margin: 0 }}
                          strokeColor="#1677ff"
                        />
                      )}
                    </div>
                  }
                  description={
                    <Space wrap size={4} style={{ marginTop: 4 }}>
                      <Tag>{record.genre}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.wordCount.toLocaleString()} 字
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{record.plan}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{record.readers} 位读者</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{record.createdAt}</Text>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
