import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi-District Comparison Matrix | PeerPulse AI',
  description: 'Side-by-side comparative analysis of up to 4 districts with overlaid performance radar charts and statistical peer overlap analysis.',
  openGraph: {
    title: 'Multi-District Comparison Matrix | PeerPulse AI',
    description: 'Compare district blood-banking footprints and peer shortfalls across India.',
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
