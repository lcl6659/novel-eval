'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Steps, Input, Button, Card, Tag, Alert, Descriptions,
  Checkbox, Modal, Typography, Space, message, Radio,
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined,
  CloseOutlined, CrownOutlined, EditOutlined,
  FileSearchOutlined, SendOutlined, WechatOutlined,
} from '@ant-design/icons';
import { NOVEL_TYPES, PRICING_PLANS } from '@/lib/constants';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function SubmitPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [agreed, setAgreed] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [contentExpanded, setContentExpanded] = useState(false);

  const wordCount = useMemo(() => content.replace(/\s/g, '').length, [content]);

  const wordStatus = useMemo(() => {
    if (wordCount === 0) return null;
    if (wordCount < 5000) return { color: '#ff4d4f', text: `至少需要 5,000 字（当前 ${wordCount.toLocaleString()} 字）` };
    if (wordCount <= 10000) return { color: '#52c41a', text: `字数合格（${wordCount.toLocaleString()} 字）` };
    return { color: '#fa8c16', text: `超出上限，仅前 10,000 字将被评测（当前 ${wordCount.toLocaleString()} 字）` };
  }, [wordCount]);

  const canNext0 = title.trim().length > 0 && genre && wordCount >= 5000;
  const plan = PRICING_PLANS.find((p) => p.key === selectedPlan)!;

  const handleSubmit = () => {
    if (plan.price > 0) {
      setPayModalOpen(true);
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setPayModalOpen(false);
            return 300;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      doSubmit();
    }
  };

  const doSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      message.success('评测已提交！');
      router.push('/progress/eval-001');
    }, 1500);
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const steps = [
    { title: '填写内容', icon: <EditOutlined /> },
    { title: '选择方案', icon: <FileSearchOutlined /> },
    { title: '确认提交', icon: <SendOutlined /> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 64px' }}>
      {/* Back button */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/')}
        style={{ padding: 0, marginBottom: 16, color: '#8c8c8c' }}
      >
        返回首页
      </Button>

      <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>提交开篇评测</Title>

      <Steps current={current} items={steps} style={{ marginBottom: 40 }} />

      {/* Step 1: Content */}
      {current === 0 && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>作品标题</label>
            <Input
              placeholder="请输入你的小说标题"
              maxLength={50}
              showCount
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="large"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>作品类型</label>
            <Radio.Group
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="large"
            >
              {NOVEL_TYPES.map((t) => (
                <Radio.Button key={t} value={t}>{t}</Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>开篇内容</label>
            <TextArea
              placeholder="请粘贴你的网文开篇内容（5,000 ~ 10,000 字）"
              autoSize={{ minRows: 12, maxRows: 24 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ fontSize: 15 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              {wordStatus && (
                <Text style={{ color: wordStatus.color, fontSize: 13 }}>{wordStatus.text}</Text>
              )}
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              当前字数：{wordCount.toLocaleString()} 字
            </Text>
          </div>

          <Alert
            type="info"
            showIcon
            message="提示：建议提交完整的前 3-5 章内容，字数在 5000~10000 之间效果最佳。内容仅用于评测，评测完成后将自动清除。"
            style={{ marginBottom: 24 }}
          />
        </div>
      )}

      {/* Step 2: Select Plan */}
      {current === 1 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            {PRICING_PLANS.map((p) => {
              const isSelected = selectedPlan === p.key;
              return (
                <Card
                  key={p.key}
                  hoverable
                  onClick={() => setSelectedPlan(p.key)}
                  style={{
                    width: 260,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #d4a853' : '1px solid #f0f0f0',
                    position: 'relative',
                    boxShadow: isSelected ? '0 4px 16px rgba(212,168,83,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  styles={{ body: { padding: 20 } }}
                >
                  {p.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -1,
                        right: 16,
                        background: '#d4a853',
                        color: '#1a1a2e',
                        padding: '3px 10px',
                        borderRadius: '0 0 6px 6px',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.recommended && <CrownOutlined style={{ marginRight: 4 }} />}
                      {p.badge}
                    </div>
                  )}

                  <Title level={5} style={{ textAlign: 'center', marginBottom: 4 }}>{p.name}</Title>
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>{p.readers} 位读者 · {p.duration}</Text>
                  </div>

                  {p.features.map((f) => (
                    <div key={f.label} style={{ display: 'flex', gap: 6, marginBottom: 6, fontSize: 13 }}>
                      {f.included ? (
                        <CheckOutlined style={{ color: '#52c41a', fontSize: 11, marginTop: 3 }} />
                      ) : (
                        <CloseOutlined style={{ color: '#d9d9d9', fontSize: 11, marginTop: 3 }} />
                      )}
                      <span style={{ color: f.included ? '#1a1a2e' : '#bfbfbf' }}>{f.label}</span>
                    </div>
                  ))}

                  <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
                    <Title
                      level={3}
                      style={{ margin: 0, color: isSelected ? '#d4a853' : '#1a1a2e' }}
                    >
                      {p.priceLabel}
                    </Title>
                    {p.price === 0 && <Text type="secondary" style={{ fontSize: 11 }}>每日 1 次</Text>}
                  </div>

                  {isSelected && (
                    <div style={{ textAlign: 'center' }}>
                      <Tag color="gold" icon={<CheckOutlined />}>已选择</Tag>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">当前余额：3 次标准评测</Text>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {current === 2 && (
        <div>
          <Card style={{ marginBottom: 24 }}>
            <Descriptions column={1} labelStyle={{ fontWeight: 500, color: '#595959' }}>
              <Descriptions.Item label="作品标题">{`《${title}》`}</Descriptions.Item>
              <Descriptions.Item label="作品类型">{genre}</Descriptions.Item>
              <Descriptions.Item label="内容字数">{wordCount.toLocaleString()} 字</Descriptions.Item>
              <Descriptions.Item label="评测方案">{plan.name}（{plan.readers} 位读者）</Descriptions.Item>
              <Descriptions.Item label="预计耗时">{plan.duration}</Descriptions.Item>
              <Descriptions.Item label="费用">
                {plan.price === 0 ? '免费（每日额度）' : `¥${plan.price}（从余额扣除）`}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="内容预览（前 200 字）"
            style={{ marginBottom: 24 }}
            extra={
              <Button
                type="link"
                onClick={() => setContentExpanded(!contentExpanded)}
              >
                {contentExpanded ? '收起' : '展开查看全文'}
              </Button>
            }
          >
            <Paragraph style={{ color: '#595959', whiteSpace: 'pre-wrap' }}>
              {contentExpanded ? content : content.slice(0, 200) + (content.length > 200 ? '...' : '')}
            </Paragraph>
          </Card>

          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginBottom: 24 }}
          >
            <span style={{ fontSize: 13 }}>
              我已阅读并同意
              <a style={{ color: '#1677ff' }}> 《用户协议》</a>和
              <a style={{ color: '#1677ff' }}> 《隐私政策》</a>
            </span>
          </Checkbox>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button
          size="large"
          onClick={() => setCurrent(current - 1)}
          disabled={current === 0}
          icon={<ArrowLeftOutlined />}
        >
          上一步
        </Button>

        {current < 2 ? (
          <Button
            type="primary"
            size="large"
            onClick={() => setCurrent(current + 1)}
            disabled={current === 0 && !canNext0}
          >
            下一步 <ArrowRightOutlined />
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            className="gold-btn"
            onClick={handleSubmit}
            disabled={!agreed}
            loading={submitting}
          >
            开始评测
          </Button>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        open={payModalOpen}
        onCancel={() => { setPayModalOpen(false); setCountdown(300); }}
        footer={null}
        centered
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Title level={4}>{plan.name} · {plan.readers} 位读者</Title>
          <Title level={2} style={{ color: '#d4a853', margin: '8px 0 24px' }}>
            {`¥ ${plan.price}`}
          </Title>

          {/* QR code placeholder */}
          <div
            style={{
              width: 200,
              height: 200,
              margin: '0 auto 16px',
              background: '#f5f5f5',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e8e8e8',
            }}
          >
            <Space direction="vertical" align="center">
              <WechatOutlined style={{ fontSize: 40, color: '#52c41a' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>微信支付二维码</Text>
            </Space>
          </div>

          <Text type="secondary">请使用微信扫码完成支付</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>支付完成后将自动开始评测</Text>
          <div style={{ marginTop: 16 }}>
            <Text style={{ color: '#fa8c16' }}>
              剩余支付时间：{formatCountdown(countdown)}
            </Text>
          </div>

          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 20 }}
            onClick={() => {
              setPayModalOpen(false);
              doSubmit();
            }}
          >
            模拟支付成功
          </Button>
        </div>
      </Modal>
    </div>
  );
}
