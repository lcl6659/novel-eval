import React from 'react';
import type { Metadata, Viewport } from 'next';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AntdStyledComponentsRegistry from '@/lib/antd-registry';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: '千读测评 — 让 1000 位 AI 读者为你的开篇打分',
  description:
    '提交网文开篇 5000~10000 字，1000 位 AI 模拟读者将从不同视角为你打分、点评，帮你找到读者流失的原因。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
};

const themeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdStyledComponentsRegistry>
          <ConfigProvider theme={themeConfig} locale={zhCN}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </div>
          </ConfigProvider>
        </AntdStyledComponentsRegistry>
      </body>
    </html>
  );
}
