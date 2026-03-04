import HeroSection from '@/components/HeroSection';
import WorkflowSection from '@/components/WorkflowSection';
import ReportPreview from '@/components/ReportPreview';
import ReaderShowcase from '@/components/ReaderShowcase';
import PricingCards from '@/components/PricingCards';
import CtaSection from '@/components/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <ReportPreview />
      <ReaderShowcase />

      {/* Pricing Section */}
      <section
        style={{
          padding: '80px 24px',
          background: '#f0f2f5',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: 12,
            }}
          >
            选择你的评测方案
          </h2>
          <p style={{ color: '#8c8c8c', fontSize: 16, marginBottom: 48 }}>
            每一种方案都能为你的开篇提供有价值的反馈
          </p>
          <PricingCards />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
