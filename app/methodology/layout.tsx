import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology, Architecture & Validation | PeerPulse AI',
  description: 'Complete documentation of the KNN K=20 Euclidean peer-matching engine, feature standardization, bootstrap resampling stability (98.15%), and non-causal analytical scope.',
  openGraph: {
    title: 'Methodology, Architecture & Validation | PeerPulse AI',
    description: 'Empirical validation and mathematical formulation of district-level peer-relative blood banking assessment.',
  },
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
