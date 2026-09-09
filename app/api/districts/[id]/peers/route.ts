import { NextResponse } from 'next/server';
import { getDistrictById } from '@/lib/data/districts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const district = getDistrictById(resolvedParams.id);

  if (!district) {
    return NextResponse.json(
      { error: `District '${resolvedParams.id}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    district_id: district.id,
    district_name: district.district_name,
    k: district.peers.length,
    peers: district.peers,
  });
}
