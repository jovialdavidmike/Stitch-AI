import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Scissors, Clock, Layers, ArrowUpRight, 
  Search, Check, X, ShieldAlert, BookOpen, Palette, 
  RefreshCw, Radio, ExternalLink, Tag, BookmarkPlus, 
  Wand2, ChevronRight, Compass, ShieldCheck, Flame
} from 'lucide-react';
import { GarmentStyle, GarmentCategory, TrendFeedItem } from '../types';
import { 
  fetchLiveRssFeeds, 
  CURATED_FALLBACK_TRENDS, 
  RSS_SOURCES 
} from '../lib/rssFetcher';
import { getCachedTrends } from '../lib/offlineStorage';
import { MoodboardModal } from './MoodboardModal';

interface TrendFeedProps {
  onDeconstructStyle: (style: GarmentStyle) => void;
  onSendToVault: (style: GarmentStyle) => void;
  onSaveMoodboardToVault?: (title: string, notes: string) => void;
  onApplyTrend?: (item: TrendFeedItem, destination: 'workspace' | 'vault') => void;
}

export const TrendFeed: React.FC<TrendFeedProps> = ({
  onDeconstructStyle,
  onSendToVault,
  onSaveMoodboardToVault,
  onApplyTrend,
}) => {
  const [trends, setTrends] = useState<TrendFeedItem[]>(CURATED_FALLBACK_TRENDS);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('Syncing feeds...');
  const [isFromCache, setIsFromCache] = useState(false);

  // Filters & Search
  const [selectedSource, setSelectedSource] = useState<string>('All Sources');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFabricFilter, setActiveFabricFilter] = useState<string | null>(null);

  // Modals & Drawers
  const [activeModalItem, setActiveModalItem] = useState<TrendFeedItem | null>(null);
  const [activeMoodboardItem, setActiveMoodboardItem] = useState<TrendFeedItem | null>(null);
  const [applyModalItem, setApplyModalItem] = useState<TrendFeedItem | null>(null);

  // Apply Trend custom client commission name
  const [customClientName, setCustomClientName] = useState('Bespoke Client Commission');
  const [applyToast, setApplyToast] = useState<string | null>(null);

  const sourcesList = ['All Sources', 'BellaNaija Style', 'Deji & Kola', 'Vogue Runway'];
  const categoriesList = ['All', 'Traditional & Ceremonial', "Men's Bespoke", "Women's Couture", 'Contemporary Minimal'];

  // Initial load: fast cached read, then background RSS sync
  useEffect(() => {
    let isMounted = true;

    async function loadInitialTrends() {
      // 1. Instant cache load
      try {
        const cached = await getCachedTrends();
        if (isMounted && cached && cached.length > 0) {
          setTrends(cached as TrendFeedItem[]);
          setIsFromCache(true);
          setSyncStatusText('Loaded from offline cache');
        }
      } catch (e) {
        console.warn('Cache read error', e);
      }

      // 2. Fetch live RSS
      if (isMounted) {
        setIsLoading(true);
        try {
          const res = await fetchLiveRssFeeds(false);
          if (isMounted) {
            setTrends(res.items);
            setIsFromCache(res.fromCache);
            setSyncStatusText(res.lastUpdated);
          }
        } catch (err) {
          console.warn('Live RSS fetch error:', err);
          if (isMounted) {
            setSyncStatusText('Offline Mode (Using local archive)');
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    }

    loadInitialTrends();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    setSyncStatusText('Fetching live RSS feeds...');
    try {
      const res = await fetchLiveRssFeeds(true);
      setTrends(res.items);
      setIsFromCache(res.fromCache);
      setSyncStatusText(res.lastUpdated);
    } catch (e) {
      setSyncStatusText('Fetch failed. Serving local cached trends.');
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedbackToast = (msg: string) => {
    setApplyToast(msg);
    setTimeout(() => setApplyToast(null), 2800);
  };

  // Filtering logic
  const filteredTrends = trends.filter((item) => {
    // Source filter
    const matchesSource = 
      selectedSource === 'All Sources' || 
      item.sourceName.toLowerCase().includes(selectedSource.toLowerCase()) ||
      item.sourceBlogTag.toLowerCase().includes(selectedSource.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // Fabric tag filter
    const matchesFabric = !activeFabricFilter || (item.fabricTags && item.fabricTags.includes(activeFabricFilter));

    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.recommendedFabric.toLowerCase().includes(q) ||
      item.aiStyleSummary.toLowerCase().includes(q) ||
      (item.fabricTags && item.fabricTags.some(t => t.toLowerCase().includes(q)));

    return matchesSource && matchesCategory && matchesFabric && matchesSearch;
  });

  // Handle "Apply Trend" execution
  const executeApplyToWorkspace = (item: TrendFeedItem) => {
    setApplyModalItem(null);
    if (onApplyTrend) {
      onApplyTrend(item, 'workspace');
    } else {
      onDeconstructStyle(item);
    }
    showFeedbackToast(`Passed "${item.title}" into Atelier Studio Analyzer.`);
  };

  const executeSaveToVault = (item: TrendFeedItem) => {
    setApplyModalItem(null);
    if (onApplyTrend) {
      onApplyTrend(item, 'vault');
    } else {
      onSendToVault({
        ...item,
        subtitle: `Commission for ${customClientName}`,
      });
    }
    showFeedbackToast(`Saved "${item.title}" to Inspiration Vault.`);
  };

  const getSourceBadgeColor = (sourceName: string) => {
    if (sourceName.includes('BellaNaija')) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (sourceName.includes('Deji')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (sourceName.includes('Vogue')) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Live RSS Trend Radar</span>
            <span className="text-[10px] text-zinc-500 font-mono">· 2026/2027 Season</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Haute Couture & Bespoke Trends
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Live RSS aggregated from <strong>BellaNaija Style</strong>, <strong>Deji &amp; Kola</strong>, and <strong>Vogue Runway</strong> with AI-extracted 3-second style summaries, structural tailoring notes, and luxury fabric specs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cut, fabric, lapel, tag..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* LIVE RSS STATUS BAR & SOURCE PORTALS */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Left: Feed sync status & Source links */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : isFromCache ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-zinc-300 font-medium">
              {syncStatusText}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-[11px]">
            <span>Active feeds:</span>
            {RSS_SOURCES.map(source => (
              <a
                key={source.id}
                href={source.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-0.5"
              >
                <span>{source.name}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Manual RSS Refresh Trigger */}
        <div className="flex items-center gap-2">
          {activeFabricFilter && (
            <button
              onClick={() => setActiveFabricFilter(null)}
              className="px-2.5 py-1 text-[11px] bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-lg flex items-center gap-1 hover:bg-amber-400/20"
            >
              <span>Fabric: #{activeFabricFilter}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white rounded-xl font-medium transition-all flex items-center gap-1.5 text-xs active:scale-95 disabled:opacity-50"
            title="Refresh live feeds from BellaNaija Style, Deji & Kola, and Vogue"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing Feeds...' : 'Refresh Live RSS'}</span>
          </button>
        </div>

      </div>

      {/* FILTER CONTROLS */}
      <div className="space-y-2.5">
        
        {/* Row 1: Source Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-400" />
            Sources:
          </span>
          {sourcesList.map((source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedSource === source
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {/* Row 2: Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-zinc-800/60">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" />
            Category:
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-zinc-200 text-zinc-950 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* STYLES GRID */}
      {filteredTrends.length === 0 ? (
        <div className="text-center py-12 px-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No trend articles matching filters</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query, clear the fabric tag filter, or tap "Refresh Live RSS".
          </p>
          <button
            onClick={() => {
              setSelectedSource('All Sources');
              setSelectedCategory('All');
              setActiveFabricFilter(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map((item) => (
            <div
              key={item.id}
              className="group bg-zinc-900/95 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-black/40"
            >
              <div>
                {/* Visual Banner */}
                <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/30 to-transparent" />
                  
                  {/* Source Blog Tag Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md ${getSourceBadgeColor(item.sourceBlogTag)}`}>
                      {item.sourceBlogTag}
                    </span>
                    {item.isLiveFeed ? (
                      <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded backdrop-blur-md">
                        Live RSS
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold bg-zinc-900/80 text-zinc-400 border border-zinc-700 px-1.5 py-0.2 rounded backdrop-blur-md">
                        Curated
                      </span>
                    )}
                  </div>

                  {/* Moodboard Quick Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMoodboardItem(item);
                    }}
                    className="absolute top-3 right-3 bg-zinc-950/85 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-400/30 text-[10px] font-semibold transition-all flex items-center gap-1 shadow-md"
                    title="Generate AI Moodboard"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Moodboard</span>
                  </button>

                  {/* Lower Image Strip: Category, Yardage & Author */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="font-semibold text-amber-400">{item.yardageRequired}</span>
                    <span className="text-zinc-400 truncate max-w-[150px]">
                      {item.pubDate || item.category}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  
                  {/* Article Title & Source Attribution */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* AI 3-Second Style Summary (Callout Quote) */}
                  <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/25 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>AI 3-Second Style Summary</span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                      "{item.aiStyleSummary}"
                    </p>
                  </div>

                  {/* Structural Tailoring Notes Grid */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Architectural Tailoring Specs:
                    </span>
                    <div className="grid grid-cols-1 gap-1 text-[11px] bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                      {item.structuralNotes?.lapelStyle && (
                        <div className="flex items-start gap-1.5">
                          <strong className="text-amber-400 shrink-0 font-medium">Lapel/Collar:</strong>
                          <span className="text-zinc-300 line-clamp-1">{item.structuralNotes.lapelStyle}</span>
                        </div>
                      )}
                      {item.structuralNotes?.hemCuts && (
                        <div className="flex items-start gap-1.5">
                          <strong className="text-amber-400 shrink-0 font-medium">Hem Finish:</strong>
                          <span className="text-zinc-300 line-clamp-1">{item.structuralNotes.hemCuts}</span>
                        </div>
                      )}
                      {item.structuralNotes?.dartsWaist && (
                        <div className="flex items-start gap-1.5">
                          <strong className="text-amber-400 shrink-0 font-medium">Darts/Waist:</strong>
                          <span className="text-zinc-300 line-clamp-1">{item.structuralNotes.dartsWaist}</span>
                        </div>
                      )}
                      {item.structuralNotes?.sleeveFinish && (
                        <div className="flex items-start gap-1.5">
                          <strong className="text-amber-400 shrink-0 font-medium">Sleeve:</strong>
                          <span className="text-zinc-300 line-clamp-1">{item.structuralNotes.sleeveFinish}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Luxury Fabric Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                      Recommended Fabrics:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(item.fabricTags || ['Structured Linen', 'Raw Silk']).map((fabric) => (
                        <button
                          key={fabric}
                          onClick={() => setActiveFabricFilter(fabric === activeFabricFilter ? null : fabric)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                            activeFabricFilter === fabric
                              ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-sm'
                              : 'bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700 border-zinc-800'
                          }`}
                          title={`Filter by ${fabric}`}
                        >
                          #{fabric}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* CARD ACTIONS: Interactive "Apply Trend", Moodboard & Specs */}
              <div className="p-4 sm:p-5 pt-0 border-t border-zinc-800/60 mt-4 flex items-center gap-2">
                
                {/* Primary Action: Apply Trend */}
                <button
                  onClick={() => setApplyModalItem(item)}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98]"
                >
                  <Wand2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Apply Trend</span>
                </button>

                {/* Moodboard button */}
                <button
                  onClick={() => setActiveMoodboardItem(item)}
                  className="py-2.5 px-2.5 text-xs font-semibold text-amber-300 hover:text-zinc-950 hover:bg-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-xl transition-all flex items-center gap-1"
                  title="Generate Visual Moodboard"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Moodboard</span>
                </button>

                {/* Specs button */}
                <button
                  onClick={() => setActiveModalItem(item)}
                  className="py-2.5 px-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors flex items-center gap-1"
                  title="View Full Tailoring Spec"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Specs</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* INTERACTIVE "APPLY TREND" MODAL DIALOG */}
      {applyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-editorial">
                    Apply Trend to Atelier Studio
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Deploy silhouette, luxury fabrics, and tailoring notes into your workflow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApplyModalItem(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
              
              {/* Garment Preview Card */}
              <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <img
                  src={applyModalItem.image}
                  alt={applyModalItem.title}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getSourceBadgeColor(applyModalItem.sourceBlogTag)}`}>
                    {applyModalItem.sourceBlogTag}
                  </span>
                  <h4 className="font-bold text-white text-sm truncate mt-0.5">
                    {applyModalItem.title}
                  </h4>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>{applyModalItem.yardageRequired}</span>
                    <span>·</span>
                    <span className="text-amber-400">{applyModalItem.complexity}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Fabrics Preview */}
              <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                  Design Specifications to Transfer:
                </span>
                <div className="text-[11px] text-zinc-300 space-y-1">
                  <p><strong>Fabric Palette:</strong> {applyModalItem.fabricTags?.join(', ') || applyModalItem.recommendedFabric}</p>
                  <p><strong>Lapel &amp; Neckline:</strong> {applyModalItem.structuralNotes?.lapelStyle}</p>
                  <p><strong>Hem &amp; Silhouette:</strong> {applyModalItem.structuralNotes?.hemCuts}</p>
                </div>
              </div>

              {/* Client Commission Label */}
              <div>
                <label className="text-zinc-400 block mb-1 font-medium">
                  Client Commission / Project Title:
                </label>
                <input
                  type="text"
                  value={customClientName}
                  onChange={(e) => setCustomClientName(e.target.value)}
                  placeholder="e.g. Chief Adeleke Wedding Agbada"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Two Direct Action Choices */}
              <div className="space-y-2.5 pt-1">
                
                {/* Option 1: Pass to Workspace / Deconstruct */}
                <button
                  type="button"
                  onClick={() => executeApplyToWorkspace(applyModalItem)}
                  className="w-full p-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold rounded-2xl flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        Transfer to AI Design Workspace
                      </div>
                      <div className="text-[11px] font-normal text-zinc-900/80 mt-0.5">
                        Open Snap-to-Design analyzer with variations &amp; pattern pieces
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Option 2: Save to Inspiration Vault */}
                <button
                  type="button"
                  onClick={() => executeSaveToVault(applyModalItem)}
                  className="w-full p-3.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl flex items-center justify-between transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center shrink-0 border border-zinc-800">
                      <BookmarkPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        Save to Design Inspiration Vault
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Archive design in your atelier with fabric tags and tracking status
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* DETAILED TAILORING SPECS MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSourceBadgeColor(activeModalItem.sourceBlogTag)}`}>
                  {activeModalItem.sourceBlogTag}
                </span>
                <h3 className="text-lg font-bold text-white font-editorial mt-1">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* AI 3-Second Summary */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Style Breakdown
                </div>
                <p className="text-zinc-200 leading-relaxed font-sans">{activeModalItem.aiStyleSummary}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div>
                  <span className="text-zinc-500 block">Yardage Needed:</span>
                  <span className="font-semibold text-amber-400">{activeModalItem.yardageRequired}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Recommended Fabric:</span>
                  <span className="font-semibold text-zinc-200">{activeModalItem.recommendedFabric}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Tailor Grade:</span>
                  <span className="font-semibold text-zinc-200">{activeModalItem.complexity}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Drape Quotient:</span>
                  <span className="font-semibold text-zinc-200">{activeModalItem.drapeRating} / 10</span>
                </div>
              </div>

              {/* Structural Tailoring Specs Breakdown */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-white">Structural Anatomy &amp; Finishes</h4>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                  <p><strong>Lapel / Collar:</strong> <span className="text-zinc-300">{activeModalItem.structuralNotes?.lapelStyle}</span></p>
                  <p><strong>Hem Finish:</strong> <span className="text-zinc-300">{activeModalItem.structuralNotes?.hemCuts}</span></p>
                  <p><strong>Darts &amp; Waistline:</strong> <span className="text-zinc-300">{activeModalItem.structuralNotes?.dartsWaist}</span></p>
                  <p><strong>Sleeve Construction:</strong> <span className="text-zinc-300">{activeModalItem.structuralNotes?.sleeveFinish}</span></p>
                </div>
              </div>

              {/* Pattern Pieces */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-white">Cut Pattern Pieces ({activeModalItem.patternPieces.length})</h4>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
                  {activeModalItem.patternPieces.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailoring Note */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Workshop Cutting &amp; Interfacing Rule
                </div>
                <p className="text-zinc-300 leading-normal">{activeModalItem.tailoringNotes}</p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    const itemToApply = activeModalItem;
                    setActiveModalItem(null);
                    setApplyModalItem(itemToApply);
                  }}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Apply Trend to Atelier</span>
                </button>

                <button
                  onClick={() => {
                    const itemForMoodboard = activeModalItem;
                    setActiveModalItem(null);
                    setActiveMoodboardItem(itemForMoodboard);
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400 hover:text-zinc-950 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Palette className="w-4 h-4" />
                  <span>Generate Moodboard</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* AI MOODBOARD MODAL */}
      {activeMoodboardItem && (
        <MoodboardModal
          isOpen={!!activeMoodboardItem}
          onClose={() => setActiveMoodboardItem(null)}
          style={activeMoodboardItem}
          onSaveToVault={onSaveMoodboardToVault}
        />
      )}

      {/* Action Toast Feedback */}
      {applyToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-zinc-900 border border-amber-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{applyToast}</span>
        </div>
      )}

    </div>
  );
};
