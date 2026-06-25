import { Header } from './layout/Header';
import { Canvas } from './canvas/Canvas';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-12">
        <Canvas />
      </main>
    </div>
  );
}
