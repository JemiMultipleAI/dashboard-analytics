import { NextResponse } from 'next/server';
import { getPropertyId } from '@/lib/getPropertyId';

export async function GET() {
  const propertyId = getPropertyId();
  return NextResponse.json({ propertyId, hasPropertyId: !!propertyId });
}
