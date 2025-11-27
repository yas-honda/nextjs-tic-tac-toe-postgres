import React, { useState, useEffect } from 'react';
import HomePage from './app/page';
import GamePage from './app/game/[id]/page';

// Simple Hash Router simulation to connect the pages
// This allows the SPA preview to function while maintaining the Next.js file structure for the user.
export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse Route
  // Route 1: Home "#/" or ""
  if (route === '' || route === '#/' || route === '#') {
    return <HomePage />;
  }

  // Route 2: Game "#/game/[id]"
  const gameMatch = route.match(/^#\/game\/(.+)$/);
  if (gameMatch) {
    const id = gameMatch[1];
    return <GamePage params={{ id }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="mb-4">Page not found</p>
        <a href="#/" className="text-blue-400 hover:underline">Return Home</a>
      </div>
    </div>
  );
}
