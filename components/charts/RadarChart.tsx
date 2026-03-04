'use client';

import React from 'react';
import { Radar } from '@ant-design/charts';
import type { DimensionScore } from '@/lib/mock-data';

interface RadarChartProps {
  data: DimensionScore[];
}

export default function RadarChart({ data }: RadarChartProps) {
  const chartData = data.map((d) => ({
    dimension: d.dimension,
    score: d.score,
  }));

  const config = {
    data: chartData,
    xField: 'dimension',
    yField: 'score',
    meta: {
      score: { min: 0, max: 10 },
    },
    area: {
      style: {
        fillOpacity: 0.25,
        fill: '#1677ff',
      },
    },
    scale: {
      x: { padding: 0.5, align: 0 },
      y: { domainMin: 0, domainMax: 10 },
    },
    axis: {
      x: {
        title: false,
        grid: true,
        label: {
          style: { fontSize: 12 },
        },
      },
      y: {
        title: false,
        grid: true,
        gridAreaFill: 'rgba(0, 0, 0, 0.02)',
        label: false,
      },
    },
    style: {
      lineWidth: 2,
      stroke: '#1677ff',
      fillOpacity: 0.2,
      fill: '#1677ff',
    },
    point: {
      size: 3,
      style: {
        fill: '#1677ff',
      },
    },
    tooltip: {
      title: 'dimension',
      items: [{ channel: 'y', name: '分数', valueFormatter: (v: number) => `${v} / 10` }],
    },
    autoFit: true,
    height: 300,
  };

  return <Radar {...config} />;
}
