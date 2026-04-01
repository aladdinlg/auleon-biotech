'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Tab } from './Tab';
import { cn } from '@/lib/utils';

export interface TabConfig {
  id: string;
  labelZH: string;
  labelEN: string;
  icon?: string;
  component: ReactNode;
}

interface TabGroupProps {
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
}

export function TabGroup({ tabs, defaultTab, className }: TabGroupProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  // Restore from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.find((t) => t.id === hash)) {
      setActiveTab(hash);
    }
  }, [tabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab bar */}
      <div className="relative border-b border-gray-200 dark:border-slate-700">
        {/* Right-edge fade — hints at horizontal overflow on mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-white to-transparent dark:from-slate-900"
        />
        <nav
          className="scrollbar-hide flex overflow-x-scroll"
          role="tablist"
          aria-label="Chapter tabs"
        >
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              <Tab
                id={tab.id}
                labelZH={tab.labelZH}
                labelEN={tab.labelEN}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={handleTabChange}
              />
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </div>
          ))}
          {/* Right padding spacer so last tab clears the fade gradient */}
          <div className="w-8 flex-shrink-0" aria-hidden />
        </nav>
      </div>

      {/* Tab content */}
      <div
        id={`tab-panel-${activeTab}`}
        role="tabpanel"
        className="mt-6"
      >
        {activeContent}
      </div>
    </div>
  );
}
