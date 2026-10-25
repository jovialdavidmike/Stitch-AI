import React, { useState } from 'react';
import { 
  Camera, Flame, FolderGit2, Layers, Scissors, 
  ArrowRight, Sparkles, Ruler, Clock, ChevronRight, 
  CheckCircle2, Compass, ArrowUpRight 
} from 'lucide-react';
import { GarmentStyle, SketchProject, TabType } from '../types';
import { TRENDING_STYLES } from '../data/mockData';

interface DashboardProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSnapModal: () => void;
  onSelectTrendingStyle: (style: GarmentStyle) => void;
  activeProjects: SketchProject[];
  onOpenMeasurements: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenSnapModal,
  onSelectTrendingStyle,
  activeProjects,
  onOpenMeasurements,
}) => {
  // Carousel index for Trending Styles This Week banner
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const currentBannerStyle = TRENDING_STYLES[activeBannerIndex];

  // Quick unit converter state (tailor utility)
  const [converterInches, setConverterInches] = useState<number>(36);
  const convertedCm = (converterInches * 2.54).toFixed(1);
  const convertedYards = (converterInches / 36).toFixed(2);

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      
      {/* 1. TOP BANNER: "TRENDING STYLES THIS WEEK" */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[420px]">
          {/* Visual Showcase (Left / Top on mobile) */}
          <div className="lg:col-span-7 relative overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[260px] sm:min-h-[340px]">
            <img
              src={currentBannerStyle.image}
              alt={currentBannerStyle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-zinc-950/20 lg:to-zinc-900" />
            
            {/* Floating Editorial Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-white shadow-lg">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending Styles This Week</span>
            </div>

            {/* Quick Carousel Selectors on Image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
              {TRENDING_STYLES.map((style, idx) => (
                <button
                  key={style.id}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    activeBannerIndex === idx
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {idx + 1}. {style.title.split(' ')[1] || style.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Banner Editorial Details (Right / Bottom on mobile) */}
          <div className="lg:col-span-5 p-5 sm:p-8 flex flex-col justify-between bg-zinc-900/90 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
                <span>{currentBannerStyle.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-400 font-normal">Week 43 Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial tracking-tight">
                {currentBannerStyle.title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3">
                {currentBannerStyle.description}
              </p>

              {/* Clean Unboxed Metadata Specs */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Yardage</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400">{currentBannerStyle.yardageRequired}</span>
                </div>
                <div className="border-x border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase">Drape</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{currentBannerStyle.drapeRating}/10</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Level</span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">{currentBannerStyle.complexity}</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1 pt-1 hidden sm:block">
                {currentBannerStyle.highlights.slice(0, 2).map((item, i) => (
                  <div key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTrendingStyle(currentBannerStyle)}
                className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Scissors className="w-4 h-4" />
                <span>Explore Pattern & Cuts</span>
              </button>

              <button
                onClick={() => onNavigateTab('trends')}
                className="p-3 text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors"
                title="View All Trends"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT "SNAP & EXPLORE SKETCH" ACTION HERO BUTTON */}
      <section className="relative">
        <div 
          onClick={onOpenSnapModal}
          className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 hover:border-amber-400 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.99]"
        >
          {/* Subtle Ambient Light Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded">
                    Snap-to-Design AI Module
                  </span>
                  <span className="text-[11px] text-zinc-400 hidden sm:inline">
                    · Notebook Camera & Smart Variations
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-editorial tracking-tight group-hover:text-amber-300 transition-colors">
                  Snap & Explore Sketch
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                  Snap a photo of your hand-drawn notebook sketch to instantly explore Smart Variations (Minimalist, Modern Fusion, Bold Embroidery), recommended fabrics (Cotton Duchesse, Organza, Soft Linen), and custom tailoring adjustments.
                </p>
              </div>
            </div>

            {/* Launch CTA Trigger */}
            <div className="flex items-center sm:self-center">
              <button 
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 group-hover:bg-amber-300 shadow-md shadow-amber-400/25 transition-all whitespace-nowrap"
              >
                <span>Snap to Design</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK ACCESS TABS: TREND FEED, MY SKETCH VAULT, FABRIC GUIDE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Quick Access Atelier Workspace
          </h3>
          <span className="text-xs text-zinc-500">Workshop Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Trend Feed */}
          <div
            onClick={() => onNavigateTab('trends')}
            className="group cursor-pointer bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-5 transition-all flex flex-col justify-between hover:-translate-y-1 shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial">
                  Trend Feed
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Weekly curated Agbada, Kaftan, Senator, and Corset cuts with seam allowances & tailor notes.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
              <span className="font-medium">Browse Silhouettes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: My Sketch Vault */}
          <div
            onClick={() => onNavigateTab('vault')}
            className="group cursor-pointer bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-5 transition-all flex flex-col justify-between hover:-translate-y-1 shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial">
                  My Sketch Vault
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Active client commissions ({activeProjects.length} projects), fitting deadlines, and tape records.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
              <span className="font-medium">Open Client Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Fabric Guide */}
          <div
            onClick={() => onNavigateTab('fabrics')}
            className="group cursor-pointer bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-5 transition-all flex flex-col justify-between hover:-translate-y-1 shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial">
                  Fabric Guide
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Textile reference for GSM weight, needle recommendations, and interactive Yardage Calculator.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
              <span className="font-medium">Calculate Yardage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKSHOP LIVE UTILITIES: ACTIVE COMMISSIONS + QUICK TAPE CONVERTER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Client Commissions in Progress */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Active Workshop Commissions</h3>
            </div>
            <button
              onClick={() => onNavigateTab('vault')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              View All ({activeProjects.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {activeProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigateTab('vault')}
                className="flex items-center justify-between p-3 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400 truncate block">
                      Client: {project.clientName} · {project.yardage}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20">
                    {project.status}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Due {project.dueDate.slice(5)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tailor Tape & Yardage Quick Converter */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Tape Measure Fast Converter</h3>
            </div>
            <button
              onClick={onOpenMeasurements}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Tape Card
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Input Length in Inches (")</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={converterInches}
                  onChange={(e) => setConverterInches(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-zinc-500 text-xs">Inches</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">Centimeters</span>
                <span className="text-lg font-bold text-white font-mono">{convertedCm} cm</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">Total Yards</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{convertedYards} yds</span>
              </div>
            </div>

            {/* Common Tailor Fractions Quick Bar */}
            <div className="pt-1">
              <span className="text-[11px] text-zinc-400 block mb-1.5">Common Tailor Fractions:</span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: '1/4 yd', val: 9 },
                  { label: '1/2 yd', val: 18 },
                  { label: '3/4 yd', val: 27 },
                  { label: '1 yd', val: 36 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setConverterInches(item.val)}
                    className="py-1 px-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-[11px] text-zinc-300 transition-colors"
                  >
                    {item.label} ({item.val}")
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
