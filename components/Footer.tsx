import React from 'react';
import Link from 'next/link';
import { BookOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#f0f2f5',
        padding: '48px 24px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BookOutlined style={{ fontSize: 20, color: '#d4a853' }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>千读测评</span>
          </div>
          <p style={{ color: '#8c8c8c', fontSize: 14, lineHeight: 1.6 }}>
            让 1000 位 AI 读者为你的开篇打分
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h4 style={{ color: '#1a1a2e', marginBottom: 12, fontWeight: 600 }}>产品</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/" style={{ color: '#8c8c8c', textDecoration: 'none', fontSize: 14 }}>首页</Link>
            <Link href="/submit" style={{ color: '#8c8c8c', textDecoration: 'none', fontSize: 14 }}>提交评测</Link>
            <Link href="/pricing" style={{ color: '#8c8c8c', textDecoration: 'none', fontSize: 14 }}>定价</Link>
          </div>
        </div>

        {/* Support Links */}
        <div>
          <h4 style={{ color: '#1a1a2e', marginBottom: 12, fontWeight: 600 }}>支持</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/pricing#faq" style={{ color: '#8c8c8c', textDecoration: 'none', fontSize: 14 }}>常见问题</Link>
            <span style={{ color: '#8c8c8c', fontSize: 14, cursor: 'pointer' }}>联系我们</span>
            <span style={{ color: '#8c8c8c', fontSize: 14, cursor: 'pointer' }}>隐私政策</span>
            <span style={{ color: '#8c8c8c', fontSize: 14, cursor: 'pointer' }}>用户协议</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          maxWidth: 1200,
          margin: '32px auto 0',
          paddingTop: 20,
          borderTop: '1px solid #d9d9d9',
          textAlign: 'center',
          color: '#bfbfbf',
          fontSize: 13,
        }}
      >
        {'© 2025 千读测评 | ICP备案号 xxxxxx'}
      </div>
    </footer>
  );
}
