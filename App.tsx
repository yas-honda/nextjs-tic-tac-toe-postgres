import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Next.js Tic-Tac-Toe
          </h1>
          <p className="text-xl text-slate-300">
            This is a Server-Side Next.js Application.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl text-left">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Preview Not Available</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                This app relies on <strong>Next.js App Router</strong>, <strong>API Routes</strong>, and <strong>Vercel Postgres</strong>, which cannot run in this browser-only preview window.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Deployment Steps</h3>
            <ol className="space-y-3">
              <li className="flex items-center gap-3 text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono border border-slate-700">1</span>
                Push this code to <strong>GitHub</strong>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono border border-slate-700">2</span>
                Import repository to <strong>Vercel</strong>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono border border-slate-700">3</span>
                Add <strong>Vercel Postgres</strong> storage
              </li>
            </ol>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          The "Uncaught Error: invariant expected app router to be mounted" occurs because the preview environment is not a Next.js server.
        </p>
      </div>
    </div>
  );
}