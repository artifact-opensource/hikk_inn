import { SeasonHero } from '@/components/SeasonHero';
import { AgentChat, BookingManager, BillingPanel } from '@/components/AgentChat';

export default function OperatorHome() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="Operator Console" subtitle="Manage inventory, billing, bookings and run agentic operations." />
      <AgentChat side="admin" />
      <BookingManager />
      <BillingPanel />
      <a href="/" className="muted" style={{ fontSize: 13, display: 'inline-block', marginTop: 16 }}>← Back</a>
    </main>
  );
}
