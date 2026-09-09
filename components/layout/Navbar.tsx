'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Search, BarChart2, Layers, GitCompare, BookOpen, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: BarChart2 },
    { label: 'District Explorer', href: '/districts', icon: Layers },
    { label: 'Multi-Compare', href: '/compare', icon: GitCompare },
    { label: 'Methodology & Lab', href: '/methodology', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  PeerPulse <span className="text-teal-400">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full">
                  K=20 KNN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                District Blood-Bank Intelligence • India
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-search-modal'));
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/70 hover:border-teal-500/50 transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Search District...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
