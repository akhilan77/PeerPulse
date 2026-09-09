import { NextResponse } from 'next/server';
import { getAllDistricts } from '@/lib/data/districts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const gap = searchParams.get('gap');
  const q = searchParams.get('q');

  let districts = getAllDistricts();

  if (state) {
    districts = districts.filter(
      (d) => d.state_name.toLowerCase() === state.toLowerCase()
    );
  }

  if (gap) {
    districts = districts.filter(
      (d) => d.primary_gap.toLowerCase() === gap.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    districts = districts.filter(
      (d) =>
        d.district_name.toLowerCase().includes(query) ||
        d.state_name.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    total: districts.length,
    districts,
  });
}
