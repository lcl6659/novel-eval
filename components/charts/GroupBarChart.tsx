'use client';

import React from 'react';
import { Typography, Progress } from 'antd';
import type { GroupScore } from '@/lib/mock-data';

const { Text } = Typography;

function getBarColor(score: number) {
  if (score >= 8) return '#52c41a';
  if (score >= 6) return '#1677ff';
  return '#fa8c16';
}

interface GroupBarChartProps {
  data: GroupScore[];
}

export default function GroupBarChart({ data }: GroupBarChartProps) {
  const sorted = [...data].sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
      {sorted.map((item) => (
        <div key={item.group}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 14 }}>{item.group}</Text>
            <Text strong style={{ color: getBarColor(item.score) }}>{item.score}</Text>
          </div>
          <Progress
            percent={item.score * 10}
            showInfo={false}
            strokeColor={getBarColor(item.score)}
            size={['100%', 16]}
          />
        </div>
      ))}
    </div>
  );
}
