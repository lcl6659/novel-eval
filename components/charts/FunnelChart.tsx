'use client';

import React from 'react';
import type { FunnelStage } from '@/lib/mock-data';

interface FunnelChartProps {
  data: FunnelStage[];
}

export default function FunnelChart({ data }: FunnelChartProps) {
  /* Custom CSS funnel since @ant-design/charts funnel can be finicky */
  const maxCount = data[0]?.count || 100;
  const colors = ['#1677ff', '#4096ff', '#69b1ff', '#91caff', '#bae0ff'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '16px 0' }}>
      {data.map((stage, i) => {
        const widthPercent = (stage.count / maxCount) * 100;
        return (
          <div
            key={stage.stage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              maxWidth: 600,
            }}
          >
            <div
              style={{
                height: 40,
                width: `${widthPercent}%`,
                minWidth: 120,
                background: colors[i] || '#bae0ff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i < 2 ? '#fff' : '#1a1a2e',
                fontSize: 13,
                fontWeight: 500,
                transition: 'width 0.6s ease',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {stage.count} 位
            </div>
            <div style={{ width: 140, flexShrink: 0, fontSize: 13, color: '#595959' }}>
              {stage.stage}（{stage.percent}%）
            </div>
          </div>
        );
      })}
    </div>
  );
}
