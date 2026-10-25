import React from 'react';
import { 
  Sparkles, Camera, Ruler, Scissors, User as UserIcon, 
  LogOut, Cloud, Bell, Wifi, WifiOff, Download 
} from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSnap: () => void;
  onOpenMeasurements: () => void;
  onOpenAuth: () => void;
  onOpenFirebaseGuide: () => void;
  onOpenNotifications: () => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
  isInstallable?: boolean;
  onInstallPWA?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSnap,
  onOpenMeasurements,
  onOpenAuth,
  onOpenFirebaseGuide,
  onOpenNotifications,
  isOnline,
  isSimulatedOffline,
  onToggleSimulateOffline,
  isInstallable,
  onInstallPWA,
}) => {
  const { user, signOut, atelierName } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Scissors className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap leading-none">
              Stitch<span className="text-amber-400 font-sans text-sm font-semibold ml-0.5 tracking-normal">AI</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase hidden sm:inline">
              {user ? atelierName : 'Atelier Creative Studio'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, desktop/tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-white ${
              activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-white ${
              activeTab === 'trends' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Trend Feed
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'vault' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span>Design Vault</span>
            {user && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Firestore Connected" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('fabrics')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-white ${
              activeTab === 'fabrics' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Fabric Guide
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Workshop Connectivity Toggle (Online / Simulate Offline) */}
          <button
            onClick={onToggleSimulateOffline}
            title={
              isOnline
                ? 'Network: Online (Click to simulate workshop offline mode)'
                : 'Network: Offline Cache Active (Click to resume online)'
            }
            className={`px-2 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'text-zinc-400 hover:text-emerald-400 bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xl:inline text-[11px]">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold text-amber-300">Offline</span>
              </>
            )}
          </button>

          {/* PWA In-App Install Button (if available) */}
          {isInstallable && onInstallPWA && (
            <button
              onClick={onInstallPWA}
              title="Install StitchAI as Native Workshop App"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap text-[11px]">Install</span>
            </button>
          )}

          {/* Notification Settings Modal Trigger */}
          <button
            onClick={onOpenNotifications}
            title="Notification Settings (Daily Digests & Order Deadlines)"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-lg transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>

          {/* Firebase Guide Trigger */}
          <button
            onClick={onOpenFirebaseGuide}
            title="Firebase Setup & Config Guide"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-lg transition-all"
          >
            <Cloud className="w-4 h-4" />
          </button>

          {/* Client Tape Card */}
          <button
            onClick={onOpenMeasurements}
            title="Client Tape Measurements"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all active:scale-[0.98]"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">Tape</span>
          </button>

          {/* User Auth Slot */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-zinc-800">
              <div 
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-bold text-xs flex items-center justify-center shadow"
                title={user.email || 'Tailor'}
              >
                {(user.displayName || user.email || 'T')[0].toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                title="Sign out of atelier"
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          {/* Snap CTA */}
          <button
            onClick={onOpenSnap}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.97] transition-all whitespace-nowrap min-h-[36px]"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-950 stroke-[2.4]" />
            <span>Snap</span>
          </button>
        </div>
      </div>
    </header>
  );
};
