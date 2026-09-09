import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'District Explorer & Directory | PeerPulse AI',
  description: 'Search, filter, and compare 615 Indian districts across 35 states by blood-bank availability, annual collection, and voluntary donation.',
  openGraph: {
    title: 'District Explorer & Directory | PeerPulse AI',
    description: 'Explore district blood-banking benchmarks and relative performance gaps across India.',
  },
};

export default function DistrictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
