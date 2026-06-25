// ─── Main App ────────────────────────────────────────────────────────────────

import React from 'react';
import { Header } from './layout/Header';
import { Canvas } from './components/Canvas';

export default function App() {
  return (
    <div className="min-h-screen bg-bg bg-bg text-fg text-fg flex flex-col">
      <Header />
      <main className="flex-1 pt-12">
        <Canvas />
      </main>
    </div>
  );
}
