import React, { useState } from 'react';
import { CreateMatchResponse } from '../types';

// Note: In Next.js App Router, we would use `next/navigation`.
// For the SPA simulation in App.tsx, we inject the navigation behavior.
// But this code is written to be Next.js compatible.
// We will use a simple anchor or window.location for the simulation if needed,
// or props if wrapped. To make this code copy-pasteable to Next.js, 
// we assume `useRouter` from `next/navigation` is available or we use window.location.

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/match/create', {
        method: 'POST',
      });
      
      if (!res.ok) throw new Error('Failed to create match');
      
      const data: CreateMatchResponse = await res.json();
      
      // I am the creator, so I am 'X'
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tic-tac-toe-role-${data.id}`, 'X');
        // Navigate to the game page
        // In a real Next.js app: router.push(`/game/${data.id}`);
        // For this demo structure:
        window.location.hash = `/game/${data.id}`;
      }
    } catch (error) {
      console.error(error);
      alert('Error creating game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            Tic-Tac-Toe
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time multiplayer powered by Vercel Postgres
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
          <div className="space-y-4">
            <button
              onClick={handleCreateGame}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 
                ${loading 
                  ? 'bg-slate-600 cursor-not-allowed opacity-75' 
                  : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-500/20 active:scale-95'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Arena...
                </span>
              ) : (
                "Start New Game"
              )}
            </button>
            <p className="text-sm text-slate-500">
              Click to create a game link, then share it with a friend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
