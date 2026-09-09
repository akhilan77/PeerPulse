'use client';

import { useState, useEffect } from 'react';
import DistrictSearchModal from './DistrictSearchModal';
import { getAllDistricts } from '@/lib/data/districts';

export default function SearchModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const districts = getAllDistricts();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search-modal', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search-modal', handleCustomOpen);
    };
  }, []);

  return (
    <DistrictSearchModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      districts={districts}
    />
  );
}
