'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Card, Input, Button, Tabs, Divider, message,
} from 'antd';
import {
  MobileOutlined, LockOutlined, WechatOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('sms');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendCode = useCallback(() => {
    if (!phone || phone.length < 11) {
      message.warning('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    message.success('验证码已发送（模拟）');
  }, [phone]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('登录成功！');
      router.push('/');
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ marginBottom: 4 }}>登录千读测评</Title>
          <Text type="secondary">开始你的小说评测之旅</Text>
        </div>

        <Tabs
          activeKey={tab}
          onChange={setTab}
          centered
          items={[
            {
              key: 'sms',
              label: '短信登录',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                  <Input
                    size="large"
                    placeholder="请输入手机号"
                    prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={11}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                      size="large"
                      placeholder="验证码"
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      style={{ flex: 1 }}
                    />
                    <Button
                      size="large"
                      disabled={countdown > 0}
                      onClick={sendCode}
                      icon={<SendOutlined />}
                      style={{ width: 130 }}
                    >
                      {countdown > 0 ? `${countdown}s` : '发送验证码'}
                    </Button>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={loading}
                    onClick={handleLogin}
                    disabled={!phone || !code}
                  >
                    登录
                  </Button>
                </div>
              ),
            },
            {
              key: 'password',
              label: '密码登录',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                  <Input
                    size="large"
                    placeholder="请输入手机号"
                    prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={11}
                  />
                  <Input.Password
                    size="large"
                    placeholder="请输入密码"
                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="link" style={{ padding: 0 }}>忘记密码？</Button>
                    <Button type="link" style={{ padding: 0 }}>注册新账号</Button>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={loading}
                    onClick={handleLogin}
                    disabled={!phone || !password}
                  >
                    登录
                  </Button>
                </div>
              ),
            },
          ]}
        />

        <Divider>
          <Text type="secondary" style={{ fontSize: 12 }}>其他登录方式</Text>
        </Divider>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <Button
            shape="circle"
            size="large"
            icon={<WechatOutlined />}
            style={{ color: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => message.info('微信登录（模拟）')}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            登录即表示同意
            <a style={{ color: '#1677ff' }}> 《用户协议》</a>和
            <a style={{ color: '#1677ff' }}> 《隐私政策》</a>
          </Text>
        </div>
      </Card>
    </div>
  );
}
