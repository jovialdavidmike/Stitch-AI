import React from 'react';
import { LayoutDashboard, Flame, FolderGit2, Layers, Camera } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSnap: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSnap,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1 safe-area-pb">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Home</span>
        </button>

        {/* Tab 2: Trends */}
        <button
          onClick={() => setActiveTab('trends')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'trends' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Trend Feed"
        >
          <Flame className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Trends</span>
        </button>

        {/* Center Quick Snap CTA */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenSnap}
            className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-transform border-2 border-zinc-950"
            aria-label="Snap & Explore Sketch"
            title="Snap & Explore Sketch"
          >
            <Camera className="w-5 h-5 stroke-[2.4]" />
          </button>
        </div>

        {/* Tab 3: Vault */}
        <button
          onClick={() => setActiveTab('vault')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'vault' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Sketch Vault"
        >
          <FolderGit2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Vault</span>
        </button>

        {/* Tab 4: Fabrics */}
        <button
          onClick={() => setActiveTab('fabrics')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'fabrics' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Fabric Guide"
        >
          <Layers className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Fabrics</span>
        </button>
      </div>
    </div>
  );
};
