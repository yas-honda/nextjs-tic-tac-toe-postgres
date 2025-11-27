import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { Board, Player, MoveRequest } from '../../../../types';

// Helper to check for a winner
function calculateWinner(squares: Board): Player | 'DRAW' | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as Player;
    }
  }

  if (squares.every((square) => square !== null)) {
    return 'DRAW';
  }

  return null;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: MoveRequest = await request.json();
    const { index, player } = body;

    // 1. Fetch current state
    const currentMatchResult = await sql`
      SELECT board, next_turn, status, winner
      FROM matches
      WHERE id = ${id}
    `;

    if (currentMatchResult.rowCount === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const match = currentMatchResult.rows[0];
    const board: Board = match.board;

    // 2. Validate Move
    if (match.status === 'finished' || match.winner) {
      return NextResponse.json({ error: 'Game is already finished' }, { status: 400 });
    }
    if (match.next_turn !== player) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }
    if (board[index] !== null) {
      return NextResponse.json({ error: 'Cell already taken' }, { status: 400 });
    }

    // 3. Update Board
    const newBoard = [...board];
    newBoard[index] = player;

    // 4. Check Win/Draw
    const winner = calculateWinner(newBoard);
    let nextTurn = player === 'X' ? 'O' : 'X';
    let status = 'playing';

    if (winner) {
      status = 'finished';
      nextTurn = '-'; // No next turn
    }

    // 5. Update DB
    // We update status to 'playing' on first move if it was 'waiting'
    await sql`
      UPDATE matches
      SET board = ${JSON.stringify(newBoard)}::jsonb,
          next_turn = ${nextTurn},
          status = ${status},
          winner = ${winner}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      board: newBoard,
      next_turn: nextTurn,
      status,
      winner
    });

  } catch (error) {
    console.error('Failed to process move:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
