/**
 * Architecture Catalog Component
 * Sidebar list + preview for browsing architectures
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArchitectureRenderer } from './ArchitectureRenderer';
import { architectures, searchArchitectures, getArchitecturesByCategory } from './registry';
import { ARCHITECTURE_CATEGORIES } from '../types/architecture.types';
import type { ArchitectureDefinition, ArchitectureCategory, ThemeType } from '../types';

export interface ArchitectureCatalogProps {
  /** Theme */
  theme?: ThemeType;
  /** Initially selected architecture ID */
  initialArchitectureId?: string;
  /** Callback when architecture is selected */
  onSelect?: (architecture: ArchitectureDefinition) => void;
  /** Show search input */
  showSearch?: boolean;
  /** Show category filter */
  showCategories?: boolean;
  /** Animation speed */
  speed?: number;
  /** Auto-play animations */
  autoPlay?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const ArchitectureCatalog: React.FC<ArchitectureCatalogProps> = ({
  theme = 'light',
  initialArchitectureId,
  onSelect,
  showSearch = true,
  showCategories = true,
  speed = 1,
  autoPlay = true,
  className = '',
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialArchitectureId ?? architectures[0]?.id ?? ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArchitectureCategory | 'all'>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter architectures based on search and category
  const filteredArchitectures = useMemo(() => {
    let result = architectures;

    if (selectedCategory !== 'all') {
      result = getArchitecturesByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      const searchResults = searchArchitectures(searchQuery);
      result = result.filter((arch) => searchResults.some((sr) => sr.id === arch.id));
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Get selected architecture
  const selectedArchitecture = useMemo(
    () => architectures.find((arch) => arch.id === selectedId),
    [selectedId]
  );

  // Handle selection
  const handleSelect = (architecture: ArchitectureDefinition) => {
    setSelectedId(architecture.id);
    onSelect?.(architecture);
  };

  // Get active categories (that have architectures)
  const activeCategories = useMemo(() => {
    const categorySet = new Set(architectures.map((arch) => arch.category));
    return ARCHITECTURE_CATEGORIES.filter((cat) => categorySet.has(cat.id));
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`architecture-catalog flex h-full ${className}`}>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 48 : 320 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`flex-shrink-0 border-r flex flex-col relative ${
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-6 z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'
              : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          } shadow-sm`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isCollapsed ? 'hidden' : ''}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Architecture Catalog
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {architectures.length} architectures available
          </p>
        </div>

        {/* Search */}
        {showSearch && !isCollapsed && (
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <input
              type="text"
              placeholder="Search architectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        )}

        {/* Category Filter */}
        {showCategories && !isCollapsed && (
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Architecture List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredArchitectures.length === 0 ? (
              <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isCollapsed ? 'hidden' : ''}`}>
                No architectures found
              </div>
            ) : isCollapsed ? (
              // Collapsed view - show compact indicators
              <div className="pt-12 flex flex-col items-center gap-1">
                {filteredArchitectures.map((architecture, index) => (
                  <motion.button
                    key={architecture.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleSelect(architecture)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                      selectedId === architecture.id
                        ? 'bg-blue-500 text-white'
                        : isDark
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
                    }`}
                    title={architecture.name}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
            ) : (
              // Expanded view - show full details
              filteredArchitectures.map((architecture) => (
                <motion.button
                  key={architecture.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => handleSelect(architecture)}
                  className={`w-full p-4 text-left border-b transition-colors ${
                    selectedId === architecture.id
                      ? isDark
                        ? 'bg-blue-900/30 border-blue-700'
                        : 'bg-blue-50 border-blue-200'
                      : isDark
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium truncate ${
                          selectedId === architecture.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : isDark
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                      >
                        {architecture.name}
                      </h3>
                      <p
                        className={`text-sm mt-1 line-clamp-2 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {architecture.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {architecture.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-xs ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {architecture.tags.length > 3 && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            +{architecture.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Preview Panel */}
      <div className={`flex-1 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <AnimatePresence mode="wait">
          {selectedArchitecture ? (
            <motion.div
              key={selectedArchitecture.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4"
            >
              <ArchitectureRenderer
                architecture={selectedArchitecture}
                theme={theme}
                autoPlay={autoPlay}
                speed={speed}
                showControls={true}
              />
            </motion.div>
          ) : (
            <div
              className={`h-full flex items-center justify-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Select an architecture to preview
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArchitectureCatalog;
