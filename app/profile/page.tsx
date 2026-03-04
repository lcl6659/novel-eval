'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Card, Tabs, Descriptions, Button, Table, Avatar, Tag, Space,
  Statistic, Row, Col,
} from 'antd';
import {
  UserOutlined, EditOutlined, CrownOutlined, LogoutOutlined,
} from '@ant-design/icons';
import {
  MOCK_USER, MOCK_CONSUMPTION, MOCK_RECHARGE,
  type ConsumptionRecord, type RechargeRecord,
} from '@/lib/mock-data';

const { Title, Text } = Typography;

const consumptionColumns = [
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '作品标题', dataIndex: 'title', key: 'title' },
  { title: '评测方案', dataIndex: 'plan', key: 'plan' },
  { title: '消费', dataIndex: 'cost', key: 'cost' },
];

const rechargeColumns = [
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '商品', dataIndex: 'product', key: 'product' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '支付方式', dataIndex: 'method', key: 'method' },
  {
    title: '状态', dataIndex: 'status', key: 'status',
    render: (status: string) => (
      <Tag color={status === '成功' ? 'green' : 'default'}>{status}</Tag>
    ),
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = MOCK_USER;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Profile Header */}
      <Card style={{ marginBottom: 24 }} styles={{ body: { padding: '32px 24px' } }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{ background: '#1a1a2e', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Title level={4} style={{ margin: 0 }}>{user.name}</Title>
              <Tag icon={<CrownOutlined />} color="gold">{user.plan}</Tag>
            </div>
            <Text type="secondary">{user.phone}</Text>
          </div>
          <Space>
            <Button icon={<EditOutlined />}>编辑资料</Button>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                router.push('/login');
              }}
            >
              退出登录
            </Button>
          </Space>
        </div>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={8}>
            <Statistic
              title="剩余评测次数"
              value={user.credits}
              suffix="次"
              valueStyle={{ color: '#d4a853', fontWeight: 700 }}
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title="已完成评测"
              value={5}
              suffix="次"
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title="累计花费"
              value={79.8}
              prefix="¥"
            />
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          items={[
            {
              key: 'info',
              label: '基本信息',
              children: (
                <Descriptions column={1} labelStyle={{ width: 100, fontWeight: 500 }}>
                  <Descriptions.Item label="昵称">{user.name}</Descriptions.Item>
                  <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
                  <Descriptions.Item label="会员类型">
                    <Tag icon={<CrownOutlined />} color="gold">{user.plan}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="剩余次数">{user.credits} 次标准评测</Descriptions.Item>
                  <Descriptions.Item label="微信绑定">
                    <Tag color="green">已绑定</Tag>
                    <Button type="link" size="small">解绑</Button>
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'consumption',
              label: '消费记录',
              children: (
                <Table<ConsumptionRecord>
                  columns={consumptionColumns}
                  dataSource={MOCK_CONSUMPTION}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 600 }}
                  size="small"
                />
              ),
            },
            {
              key: 'recharge',
              label: '充值记录',
              children: (
                <Table<RechargeRecord>
                  columns={rechargeColumns}
                  dataSource={MOCK_RECHARGE}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 700 }}
                  size="small"
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
