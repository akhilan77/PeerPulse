import { NextResponse } from 'next/server';
import { getSummaryStats } from '@/lib/data/districts';

export async function GET() {
  const summary = getSummaryStats();
  return NextResponse.json(summary);
}
