import Link from 'next/link';
import { ShieldCheck, Info, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Database className="w-4 h-4 text-teal-400" />
              Data Provenance & Scope
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Based on the ASAR/NACO 2016 District-Level Blood-Banking dataset comprising 615 usable districts across 35 Indian States and Union Territories.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Methodological Rigor
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Frozen K=20 Euclidean KNN peer model. Evaluated with 500-iteration bootstrap resampling (98.16% stability) and cross-metric distance sensitivity tests.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Info className="w-4 h-4 text-amber-400" />
              Analytical Non-Causality Disclaimer
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Peer-relative gap detection provides empirical signals comparing similar districts. It does not establish causal proof or prescribe automated medical/policy interventions.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PeerPulse AI. Decision Support & Research System.</p>
          <div className="flex items-center gap-6">
            <Link href="/methodology" className="hover:text-teal-400 transition-colors">
              Methodology & Validation
            </Link>
            <Link href="/districts" className="hover:text-teal-400 transition-colors">
              District Explorer
            </Link>
            <Link href="/compare" className="hover:text-teal-400 transition-colors">
              Compare Matrix
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
