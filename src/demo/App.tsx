/**
 * Demo Application
 * Showcases the AWS Architecture Animations library
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  Layers,
  Zap,
  GitBranch,
  Package,
  Github,
  ExternalLink,
  LayoutGrid,
  List,
} from 'lucide-react';

// Import templates and catalog from library
import { ServerlessPayment, Microservices, EventDriven, ArchitectureCatalog } from '../lib';

type DiagramType = 'serverless' | 'microservices' | 'event-driven';
type ViewMode = 'templates' | 'catalog';

const diagrams: Array<{
  id: DiagramType;
  name: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'serverless',
    name: 'Serverless Payment',
    description: 'Real-time payment processing with async settlement',
    icon: <Zap size={20} />,
  },
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Containerized e-commerce platform',
    icon: <Layers size={20} />,
  },
  {
    id: 'event-driven',
    name: 'Event-Driven',
    description: 'Loosely coupled order processing',
    icon: <GitBranch size={20} />,
  },
];

function App() {
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>('serverless');
  const [autoPlay, setAutoPlay] = useState(true);
  const [speed, setSpeed] = useState(1);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/icons/lambda.svg" alt="Lambda" width={32} height={32} />
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  AWS Architecture Animations
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interactive, animated diagrams for React
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('catalog')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === 'catalog'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List size={16} />
                  Catalog
                </button>
                <button
                  onClick={() => setViewMode('templates')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === 'templates'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid size={16} />
                  Templates
                </button>
              </div>

              {/* Speed control */}
              {viewMode === 'templates' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Speed:</span>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              )}

              {/* Auto-play toggle */}
              {viewMode === 'templates' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-aws-orange focus:ring-aws-orange"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Auto-play</span>
                </label>
              )}

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* GitHub link */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="View on GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Catalog View */}
      {viewMode === 'catalog' && (
        <div className="h-[calc(100vh-4rem)]">
          <ArchitectureCatalog
            theme={isDark ? 'dark' : 'light'}
            autoPlay={true}
            speed={1}
          />
        </div>
      )}

      {/* Templates View */}
      {viewMode === 'templates' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Diagram selector */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Select Architecture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {diagrams.map((diagram) => (
                <motion.button
                  key={diagram.id}
                  onClick={() => setSelectedDiagram(diagram.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${
                      selectedDiagram === diagram.id
                        ? 'border-aws-orange bg-aws-orange/5 dark:bg-aws-orange/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`
                        p-2 rounded-lg
                        ${
                          selectedDiagram === diagram.id
                            ? 'bg-aws-orange text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      `}
                    >
                      {diagram.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {diagram.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {diagram.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Diagram display */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDiagram}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {selectedDiagram === 'serverless' && (
                  <ServerlessPayment
                    theme={isDark ? 'dark' : 'light'}
                    autoPlay={autoPlay}
                    speed={speed}
                    showControls={true}
                  />
                )}
                {selectedDiagram === 'microservices' && (
                  <Microservices
                    theme={isDark ? 'dark' : 'light'}
                    autoPlay={autoPlay}
                    speed={speed}
                    showControls={true}
                  />
                )}
                {selectedDiagram === 'event-driven' && (
                  <EventDriven
                    theme={isDark ? 'dark' : 'light'}
                    autoPlay={autoPlay}
                    speed={speed}
                    showControls={true}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        {/* Usage code example */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Quick Start
          </h2>
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`import { ${
                selectedDiagram === 'serverless'
                  ? 'ServerlessPayment'
                  : selectedDiagram === 'microservices'
                    ? 'Microservices'
                    : 'EventDriven'
              } } from 'aws-architecture-animations';

function MyApp() {
  return (
    <${
      selectedDiagram === 'serverless'
        ? 'ServerlessPayment'
        : selectedDiagram === 'microservices'
          ? 'Microservices'
          : 'EventDriven'
    }
      theme="${isDark ? 'dark' : 'light'}"
      autoPlay={${autoPlay}}
      speed={${speed}}
      showControls={true}
    />
  );
}`}</code>
            </pre>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Zap className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              60fps Animations
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Smooth, professional animations powered by Motion.dev (Framer Motion)
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Layers className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              25+ AWS Components
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compute, Database, Networking, Storage, Messaging, Security & Monitoring
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <Package className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              TypeScript First
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Full TypeScript support with exported types for all components
            </p>
          </div>
        </div>
      </main>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with React, Motion.dev, and Tailwind CSS
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-aws-orange flex items-center gap-1"
              >
                Documentation <ExternalLink size={14} />
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-aws-orange flex items-center gap-1"
              >
                Storybook <ExternalLink size={14} />
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-aws-orange flex items-center gap-1"
              >
                npm <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
