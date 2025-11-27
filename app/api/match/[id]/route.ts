import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const result = await sql`
      SELECT id, board, next_turn, status, winner, created_at
      FROM matches
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const match = result.rows[0];

    return NextResponse.json(match);
  } catch (error) {
    console.error('Failed to fetch match:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
