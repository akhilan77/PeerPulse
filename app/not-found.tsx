import Link from 'next/link';
import { Layers, ArrowLeft, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-6 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
        <Activity className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          District or Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The requested route or district identifier does not match any of the 615 audited districts in the ASAR/NACO dataset.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>

        <Link
          href="/districts"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
        >
          <Layers className="w-4 h-4 text-teal-400" />
          Browse District Explorer
        </Link>
      </div>
    </div>
  );
}
