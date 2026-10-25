import React, { useState, useEffect } from 'react';
import { WifiOff, Database, RefreshCw, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getCacheMetadata } from '../lib/offlineStorage';
import { OfflineCacheMetadata } from '../types/pwa';

interface OfflineBannerProps {
  isOnline: boolean;
  isSimulated: boolean;
  onToggleSimulate: () => void;
  onRefreshSync?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  isSimulated,
  onToggleSimulate,
  onRefreshSync,
}) => {
  const [metadata, setMetadata] = useState<OfflineCacheMetadata | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);
  const [prevOnline, setPrevOnline] = useState(isOnline);

  useEffect(() => {
    // When switching to offline, load cache stats and un-dismiss
    if (!isOnline) {
      setDismissed(false);
      getCacheMetadata().then(setMetadata);
    } else if (!prevOnline && isOnline) {
      // Just restored
      setShowRestoredNotice(true);
      const timer = setTimeout(() => setShowRestoredNotice(false), 3200);
      return () => clearTimeout(timer);
    }
    setPrevOnline(isOnline);
  }, [isOnline, prevOnline]);

  if (showRestoredNotice) {
    return (
      <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-1">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Network Restored:</strong> Reconnected to Cloud Firestore. Offline modifications synced.
            </span>
          </div>
          <button
            onClick={() => setShowRestoredNotice(false)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (isOnline || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 border-b border-amber-500/40 px-3 sm:px-6 py-2.5 text-xs text-amber-100 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Left: Indicator & Description */}
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
            <WifiOff className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-wide">
                Workshop Offline Mode Active
              </span>
              {isSimulated && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                  Simulation
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-200/90 leading-tight mt-0.5">
              Network disconnected. Switched gracefully to local <strong>{metadata?.storageEngine || 'IndexedDB'}</strong> cache ({metadata?.vaultCount ?? 'All'} designs &amp; trends available).
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {isSimulated ? (
            <button
              onClick={onToggleSimulate}
              className="px-2.5 py-1 text-[11px] font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              Resume Online
            </button>
          ) : (
            <button
              onClick={onRefreshSync}
              className="px-2.5 py-1 text-[11px] font-medium text-amber-200 hover:text-white bg-zinc-900/80 border border-amber-400/30 rounded-lg transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Sync</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-300/80 hover:text-white rounded"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
