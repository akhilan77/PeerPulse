'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin, ChevronRight, Activity } from 'lucide-react';
import { District } from '@/types/district';
import { getGapTheme } from '@/lib/utils';

interface DistrictSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
}

export default function DistrictSearchModal({ isOpen, onClose, districts }: DistrictSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim() === ''
    ? districts.slice(0, 8)
    : districts
        .filter((d) => 
          d.district_name.toLowerCase().includes(query.toLowerCase()) ||
          d.state_name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (district: District) => {
    onClose();
    router.push(`/districts/${district.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search any of 615 districts or 35 states..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search any of 615 districts or 35 states"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No districts found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((d, index) => {
              const gapTheme = getGapTheme(d.primary_gap);
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={d.id}
                  onClick={() => handleSelect(d)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-slate-800/90 border border-teal-500/30' : 'hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <MapPin className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate text-sm">
                          {d.district_name}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          • {d.state_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>Avail: {d.raw_metrics.availability.toFixed(1)}</span>
                        <span>Coll: {d.raw_metrics.collection.toFixed(2)}</span>
                        <span>Vol: {d.raw_metrics.voluntary.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${gapTheme.pill}`}>
                      {d.primary_gap}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700">↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700">Enter</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700">Esc</kbd> Close</span>
          </div>
          <span>615 districts indexed</span>
        </div>
      </div>
    </div>
  );
}
