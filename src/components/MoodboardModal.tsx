import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Palette, Layers, Compass, Copy, 
  Check, Save, Download, Share2, Tag, ChevronRight, Eye 
} from 'lucide-react';
import { GarmentStyle, MoodboardData } from '../types';
import { getMoodboardForStyle } from '../data/mockData';

interface MoodboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  style: GarmentStyle | null;
  onSaveToVault?: (title: string, notes: string) => void;
}

export const MoodboardModal: React.FC<MoodboardModalProps> = ({
  isOpen,
  onClose,
  style,
  onSaveToVault,
}) => {
  const [isSynthesizing, setIsSynthesizing] = useState(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeView, setActiveView] = useState<'collage' | 'textures' | 'accessories'>('collage');

  useEffect(() => {
    if (isOpen) {
      setIsSynthesizing(true);
      const timer = setTimeout(() => {
        setIsSynthesizing(false);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isOpen, style]);

  if (!isOpen || !style) return null;

  const moodboard: MoodboardData = getMoodboardForStyle(style);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleSaveVault = () => {
    if (onSaveToVault) {
      onSaveToVault(
        `${style.title} · Curated Moodboard`,
        `Editorial Theme: ${moodboard.editorialTheme}. Palette: ${moodboard.palette.map(p => `${p.name} (${p.hex})`).join(', ')}. Key textures: ${moodboard.textures.map(t => t.name).join(', ')}.`
      );
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/85 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Palette className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-editorial tracking-wide">
                  AI Atelier Moodboard
                </h2>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                  {style.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Visual collage synthesizing textures, chromatic palette swatches, and artisanal accessories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* SIMULATED AI SYNTHESIS LOADING */}
          {isSynthesizing ? (
            <div className="py-16 px-4 max-w-md mx-auto text-center space-y-5">
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-amber-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Generating AI Visual Moodboard...
                </h3>
                <p className="text-xs text-zinc-400">
                  Synthesizing tactile textile swatches, extracting hexadecimal chromatic scales, and curating bespoke accessory pairings.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* EDITORIAL HEADER BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    Curated Aesthetic Theme
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-editorial mt-0.5">
                    {moodboard.editorialTheme}
                  </h3>
                </div>
                
                {/* Vibe keywords (clean unboxed text with separators) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
                  {moodboard.vibeKeywords.map((kw, idx) => (
                    <React.Fragment key={kw}>
                      <span className="text-zinc-300">{kw}</span>
                      {idx < moodboard.vibeKeywords.length - 1 && <span className="text-zinc-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* SECTION 1: VISUAL COLLAGE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Hero Garment Visual */}
                <div className="md:col-span-6 relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 min-h-[280px] sm:min-h-[340px] group">
                  <img
                    src={moodboard.heroImage}
                    alt={moodboard.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-semibold text-white">
                    01. Master Silhouette Cut
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-base font-bold font-editorial">{style.title}</h4>
                    <p className="text-xs text-zinc-300 line-clamp-1">{style.subtitle}</p>
                  </div>
                </div>

                {/* Right Split: Textures & Accessories Flatlays */}
                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Textile & Weave Flatlay */}
                  <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-square group">
                    <img
                      src={moodboard.textureImage}
                      alt="Tactile fabric swatches"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-medium text-white border border-white/10">
                      02. Tactile Textures & Thread
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-zinc-300">
                      <span className="font-semibold text-white block">Weaves & Bullion</span>
                      <span className="text-[11px] text-zinc-400">Damask, raw linen & velvet</span>
                    </div>
                  </div>

                  {/* Curated Accessories Flatlay */}
                  <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-square group">
                    <img
                      src={moodboard.accessoriesImage}
                      alt="Bespoke luxury accessories"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-medium text-white border border-white/10">
                      03. Curated Accessories
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-zinc-300">
                      <span className="font-semibold text-white block">Artisanal Accents</span>
                      <span className="text-[11px] text-zinc-400">Patinated leather, brass & signet</span>
                    </div>
                  </div>

                  {/* Quick Ratio Balance Card */}
                  <div className="sm:col-span-2 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Chromatic Balance Ratio</span>
                      <span className="text-amber-400 font-mono text-[11px]">60 / 25 / 15 Rule</span>
                    </div>
                    {/* Visual Segmented Ratio Bar */}
                    <div className="h-2 rounded-full overflow-hidden flex">
                      {moodboard.palette.map((color) => (
                        <div
                          key={color.hex}
                          style={{ width: `${color.percentage}%`, backgroundColor: color.hex }}
                          title={`${color.name} (${color.percentage}%)`}
                        />
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* SECTION 2: EXTRACTED COLOR PALETTE SWATCHES */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide block">
                      Extracted Color Palette
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Harmonious Pigments & Metallic Accents
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    Click swatch to copy Hex
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {moodboard.palette.map((swatch) => (
                    <div
                      key={swatch.hex}
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-amber-400/80 rounded-xl p-2.5 transition-all text-center space-y-2"
                    >
                      <div
                        style={{ backgroundColor: swatch.hex }}
                        className="w-full h-12 rounded-lg shadow-inner border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center"
                      >
                        {copiedHex === swatch.hex && (
                          <span className="bg-black/70 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white truncate">{swatch.name}</div>
                        <div className="font-mono text-[11px] text-zinc-400 mt-0.5">{swatch.hex}</div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">{swatch.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: TACTILE TEXTURES & ACCESSORY SUGGESTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tactile Textures List */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Tactile Textile Specifications</h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {moodboard.textures.map((tex, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{tex.name}</span>
                          <span className="font-mono text-[11px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                            {tex.weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{tex.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accessory Suggestions List */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Curated Accessory Suggestions</h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {moodboard.accessories.map((acc, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{acc.name}</span>
                          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                            {acc.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          <span className="text-amber-400/90 font-medium">Styling Note:</span> {acc.stylingNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* MODAL FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <div className="text-xs text-zinc-400 text-center sm:text-left">
                  Moodboard synthesized for <strong className="text-white">{style.title}</strong>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const text = `StitchAI Moodboard: ${style.title}\nTheme: ${moodboard.editorialTheme}\nPalette: ${moodboard.palette.map(p => `${p.name} ${p.hex}`).join(', ')}`;
                      navigator.clipboard.writeText(text);
                      alert('Moodboard specifications copied to clipboard!');
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                  >
                    Copy Palette Specs
                  </button>

                  <button
                    onClick={handleSaveVault}
                    disabled={savedSuccess}
                    className="flex-1 sm:flex-initial py-2.5 px-5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved to Vault!' : 'Save Moodboard to Vault'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
