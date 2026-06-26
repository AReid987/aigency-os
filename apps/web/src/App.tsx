// ─── Main App ────────────────────────────────────────────────────────────────

import React from 'react';
import { Header } from './layout/Header';
import { Canvas } from './canvas/Canvas';
import { Atmosphere } from './components/Atmosphere';

export default function App() {
  return (
    <div className="relative h-screen min-h-screen text-fg flex flex-col z-10 overflow-hidden">
      <Atmosphere />
      <Header />
      <main className="flex-1 pt-12 min-h-0">
        <Canvas />
      </main>
    </div>
  );
}
