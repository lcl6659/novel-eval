'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Dropdown, Avatar, Drawer, Space, Badge } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '提交评测', href: '/submit' },
  { label: '定价', href: '/pricing' },
  { label: '评测记录', href: '/history' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: <Link href="/profile">个人中心</Link> },
    { key: 'history', icon: <HistoryOutlined />, label: <Link href="/history">我的评测</Link> },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: () => setLoggedIn(false) },
  ];

  const isHero = pathname === '/' && !scrolled;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: isHero ? 'transparent' : '#ffffff',
          borderBottom: scrolled ? '1px solid #f0f0f0' : 'none',
          boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              color: isHero ? '#ffffff' : '#1a1a2e',
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            <BookOutlined style={{ fontSize: 24, color: '#d4a853' }} />
            <span>千读测评</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
            className="hide-mobile"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: pathname === item.href
                    ? '#d4a853'
                    : isHero
                      ? 'rgba(255,255,255,0.85)'
                      : '#595959',
                  fontWeight: pathname === item.href ? 600 : 400,
                  fontSize: 15,
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {loggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar
                    style={{ backgroundColor: '#d4a853' }}
                    icon={<UserOutlined />}
                    size={32}
                  />
                  <span style={{ color: isHero ? '#fff' : '#1a1a2e', fontSize: 14 }}>
                    写书的小明
                  </span>
                  <Badge
                    count={'余额: 5次'}
                    style={{
                      backgroundColor: 'transparent',
                      color: isHero ? 'rgba(255,255,255,0.7)' : '#8c8c8c',
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                  />
                </Space>
              </Dropdown>
            ) : (
              <Button
                type={isHero ? 'default' : 'primary'}
                ghost={isHero}
                onClick={() => setLoggedIn(true)}
                style={isHero ? { borderColor: '#fff', color: '#fff' } : {}}
              >
                登录
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <Button
            className="hide-desktop"
            type="text"
            icon={<MenuOutlined style={{ color: isHero ? '#fff' : '#1a1a2e', fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title="千读测评"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname === item.href ? '#d4a853' : '#1a1a2e',
                fontWeight: pathname === item.href ? 600 : 400,
                fontSize: 16,
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            {loggedIn ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar style={{ backgroundColor: '#d4a853' }} icon={<UserOutlined />} />
                  <span>写书的小明</span>
                </div>
                <Link href="/profile" onClick={() => setDrawerOpen(false)} style={{ color: '#595959' }}>
                  个人中心
                </Link>
                <Button type="link" danger onClick={() => { setLoggedIn(false); setDrawerOpen(false); }}>
                  退出登录
                </Button>
              </Space>
            ) : (
              <Button type="primary" block onClick={() => { setLoggedIn(true); setDrawerOpen(false); }}>
                登录
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
