'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MatchData, Player } from '../../../types';

export default function GamePage() {
  // Use useParams hook for robust client-side access to route parameters
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [myRole, setMyRole] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMove, setLoadingMove] = useState(false);

  // 1. Determine Player Identity
  useEffect(() => {
    if (!id) return;
    const storageKey = `tic-tac-toe-role-${id}`;
    const storedRole = localStorage.getItem(storageKey);

    if (storedRole === 'X') {
      setMyRole('X');
    } else {
      // If I didn't create it (no 'X' in storage), assume I am 'O' (the joiner)
      localStorage.setItem(storageKey, 'O');
      setMyRole('O');
    }
  }, [id]);

  // 2. Poll Game State (3 seconds)
  const fetchGameState = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/match/${id}`);
      if (!res.ok) {
        if (res.status === 404) setError('Match not found');
        else setError('Failed to load match');
        return;
      }
      const data: MatchData = await res.json();
      setMatchData(data);
    } catch (err) {
      console.error(err);
      setError('Connection error');
    }
  }, [id]);

  useEffect(() => {
    // Initial fetch
    fetchGameState();

    // Poll interval
    const intervalId = setInterval(fetchGameState, 3000);
    return () => clearInterval(intervalId);
  }, [fetchGameState]);

  // 3. Handle Move
  const handleCellClick = async (index: number) => {
    if (!matchData || !myRole || !id) return;
    
    // Client-side validations for immediate feedback/prevention
    if (matchData.board[index] !== null) return;
    if (matchData.next_turn !== myRole) return;
    if (matchData.status === 'finished') return;

    setLoadingMove(true);

    try {
      const res = await fetch(`/api/match/${id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, player: myRole }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Move failed');
      } else {
        // Optimistic update or immediate fetch
        fetchGameState();
      }
    } catch (err) {
      console.error(err);
      alert('Network error moving');
    } finally {
      setLoadingMove(false);
    }
  };

  // 4. Render Helpers
  const renderStatus = () => {
    if (error) return <span className="text-red-500">{error}</span>;
    if (!matchData) return <span className="text-slate-400">Loading arena...</span>;

    if (matchData.status === 'finished') {
      if (matchData.winner === 'DRAW') {
        return <span className="text-yellow-400 text-2xl font-bold">Draw!</span>;
      }
      const isWinner = matchData.winner === myRole;
      return (
        <span className={`text-3xl font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
          {isWinner ? 'You Won!' : `${matchData.winner} Won!`}
        </span>
      );
    }

    const isMyTurn = matchData.next_turn === myRole;
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl text-slate-300">
          You are <span className={`font-bold ${myRole === 'X' ? 'text-blue-400' : 'text-rose-400'}`}>{myRole}</span>
        </span>
        <div className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase 
          ${isMyTurn ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' : 'bg-slate-700 text-slate-400'}`}>
          {isMyTurn ? "Your Turn" : `Waiting for ${matchData.next_turn}...`}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl text-red-500 font-bold">Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className="text-blue-400 hover:underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center py-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-100 cursor-pointer" onClick={() => router.push('/')}>
          Tic-Tac-Toe
        </h1>
        <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-500">
          ID: {id?.slice(0, 6)}...
        </div>
      </header>

      {/* Game Status */}
      <div className="mb-8 h-24 flex items-center justify-center">
        {renderStatus()}
      </div>

      {/* Board */}
      <div className="bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700">
        <div className="grid grid-cols-3 gap-3">
          {matchData ? matchData.board.map((cell, idx) => {
            const isClickable = !cell && matchData.next_turn === myRole && matchData.status !== 'finished' && !loadingMove;
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={!!cell || !isClickable}
                className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-lg text-4xl sm:text-5xl font-black flex items-center justify-center transition-all duration-200
                  ${cell === 'X' ? 'text-blue-400 bg-slate-900' : ''}
                  ${cell === 'O' ? 'text-rose-400 bg-slate-900' : ''}
                  ${!cell ? 'bg-slate-700/50' : ''}
                  ${isClickable ? 'hover:bg-slate-700 cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
                `}
              >
                {cell}
              </button>
            );
          }) : (
            // Skeleton Loader
            Array(9).fill(0).map((_, i) => (
              <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 rounded-lg animate-pulse" />
            ))
          )}
        </div>
      </div>

      {/* Footer/Share */}
      <div className="mt-12 text-center space-y-4">
         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 max-w-xs mx-auto">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">Invite Opponent</p>
            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700">
              <code className="text-xs text-slate-300 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {typeof window !== 'undefined' ? window.location.href : '...'}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied!');
                }}
                className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded font-bold transition-colors"
              >
                Copy
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}