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

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view');

  if (view === 'peers') {
    return NextResponse.json({
      district_id: district.id,
      district_name: district.district_name,
      k: district.peers.length,
      peers: district.peers,
    });
  }

  if (view === 'gaps') {
    return NextResponse.json({
      district_id: district.id,
      district_name: district.district_name,
      primary_gap: district.primary_gap,
      primary_gap_z: district.primary_gap_z,
      gaps_z: district.gaps_z,
      raw_gaps: district.raw_gaps,
      peer_means_raw: district.peer_means_raw,
      district_raw: district.raw_metrics,
    });
  }

  return NextResponse.json(district);
}
