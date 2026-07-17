import { SeasonHero } from '@/components/SeasonHero';
import { AgentChat } from '@/components/AgentChat';
import { PackageBuilder } from '@/components/PackageBuilder';

export default function TouristHome() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="Plan your trip" subtitle="Stay, eat, move and fly — with full AI support or build it yourself." />
      <AgentChat side="tourist" />
      <PackageBuilder />
      <a href="/" className="muted" style={{ fontSize: 13, display: 'inline-block', marginTop: 16 }}>← Back</a>
    </main>
  );
}
