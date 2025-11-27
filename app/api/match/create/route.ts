import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export async function POST() {
  try {
    // Initial board: 9 nulls
    const initialBoard = JSON.stringify(Array(9).fill(null));
    const nextTurn = 'X';
    
    const result = await sql`
      INSERT INTO matches (board, next_turn, status)
      VALUES (${initialBoard}::jsonb, ${nextTurn}, 'waiting')
      RETURNING id;
    `;

    const matchId = result.rows[0].id;

    return NextResponse.json({ id: matchId });
  } catch (error) {
    console.error('Failed to create match:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
