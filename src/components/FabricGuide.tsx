import React, { useState } from 'react';
import { 
  Layers, Calculator, Search, ShieldCheck, Thermometer, 
  Scissors, Sparkles, ChevronDown, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { FabricItem } from '../types';
import { FABRICS_DIRECTORY, GARMENT_YARDAGE_MATRIX } from '../data/mockData';

export const FabricGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFabric, setSelectedFabric] = useState<FabricItem | null>(null);

  // Yardage Calculator State
  const [selectedGarment, setSelectedGarment] = useState<string>('3-Piece Modern Agbada');
  const [selectedWidth, setSelectedWidth] = useState<string>('60" Width');
  const [sizeFactor, setSizeFactor] = useState<number>(1.0); // 1.0 = standard, 0.9 = slim, 1.15 = tall/plus
  const [matchingBuffer, setMatchingBuffer] = useState<number>(0); // 0, 10%, 15%
  const [pricePerYard, setPricePerYard] = useState<number>(25);

  const filteredFabrics = FABRICS_DIRECTORY.filter((f) => {
    return f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.recommendedGarments.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Calculate required yards
  const baseYardage = GARMENT_YARDAGE_MATRIX[selectedGarment]?.[selectedWidth] || 5.0;
  const calculatedYards = Number((baseYardage * sizeFactor * (1 + matchingBuffer / 100)).toFixed(2));
  const estimatedCost = (calculatedYards * pricePerYard).toFixed(2);

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Tailor Workshop Textile Reference
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Fabric Guide & Yardage Calculator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Technical specifications for luxury tailoring textiles: GSM weight, needle recommendations, iron temperatures, and precise cutting yardages.
          </p>
        </div>
      </div>

      {/* Workshop Hero Banner with image */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="aspect-[16/9] sm:aspect-[21/9] max-h-64 sm:max-h-80 w-full relative">
          <img
            src="/src/assets/images/fabric_atelier_workshop_1792948465700.jpg"
            alt="Tailor cutting table with luxury textiles"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 max-w-2xl">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-amber-400/20">
              Workshop Discipline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-editorial mt-2">
              The Grainline & Tension Blueprint
            </h2>
            <p className="text-xs text-zinc-300 mt-1 hidden sm:block">
              Always test needle penetration on scrap textile before stitching final commissions. Match interfacing canvas strictly to fabric weight.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: INTERACTIVE YARDAGE CALCULATOR */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-editorial">
              Precision Yardage & Cost Calculator
            </h3>
            <p className="text-xs text-zinc-400">
              Calculate exact fabric yardage needed based on garment cut, bolt width, and client height
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Garment Type */}
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Garment Silhouette</label>
            <select
              value={selectedGarment}
              onChange={(e) => setSelectedGarment(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-amber-400 focus:outline-none"
            >
              {Object.keys(GARMENT_YARDAGE_MATRIX).map((garment) => (
                <option key={garment} value={garment}>{garment}</option>
              ))}
            </select>
          </div>

          {/* Fabric Bolt Width */}
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Fabric Bolt Width</label>
            <select
              value={selectedWidth}
              onChange={(e) => setSelectedWidth(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-amber-400 focus:outline-none"
            >
              <option value='45" Width'>45 Inches (Standard African Wax / Damask)</option>
              <option value='54" Width'>54 Inches (Medium Width)</option>
              <option value='60" Width'>60 Inches (Double Width Wool / Suiting)</option>
            </select>
          </div>

          {/* Client Proportion & Stature */}
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Client Stature & Fit Ease</label>
            <select
              value={sizeFactor}
              onChange={(e) => setSizeFactor(parseFloat(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-amber-400 focus:outline-none"
            >
              <option value={0.9}>Petite / Slim Fit (0.9x)</option>
              <option value={1.0}>Standard Tailor Fit (1.0x)</option>
              <option value={1.15}>Tall Stature 6'2"+ / Full Drop (1.15x)</option>
              <option value={1.25}>Extra Full Volume / Grand Drape (1.25x)</option>
            </select>
          </div>

          {/* Pattern Matching Buffer */}
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Print Matching Allowance</label>
            <select
              value={matchingBuffer}
              onChange={(e) => setMatchingBuffer(parseInt(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-amber-400 focus:outline-none"
            >
              <option value={0}>Solid / Plain Fabric (+0%)</option>
              <option value={10}>Plaid / Pinstripe Matching (+10%)</option>
              <option value={15}>Large One-Way Print / Motif (+15%)</option>
            </select>
          </div>
        </div>

        {/* Calculation Result Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
              Workshop Cutting Floor Recommendation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-white font-editorial tabular-nums">
                {calculatedYards}
              </span>
              <span className="text-sm font-semibold text-amber-300">Total Yards Needed</span>
            </div>
            <p className="text-xs text-zinc-400">
              Includes 0.75" side seam allowances & 1.5" hem reserves.
            </p>
          </div>

          {/* Quick Price Estimator */}
          <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 shrink-0">
            <div>
              <label className="text-[10px] text-zinc-500 block">Price / Yard ($)</label>
              <input
                type="number"
                min="1"
                value={pricePerYard}
                onChange={(e) => setPricePerYard(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono focus:border-amber-400"
              />
            </div>
            <div className="border-l border-zinc-800 pl-3">
              <span className="text-[10px] text-zinc-500 block">Est. Fabric Cost</span>
              <span className="text-sm font-bold text-amber-400 tabular-nums">${estimatedCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: FABRIC DIRECTORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white font-editorial">
            Tailor Fabric Specification Directory
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search damask, wool, satin..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFabrics.map((fabric) => (
            <div
              key={fabric.id}
              onClick={() => setSelectedFabric(fabric)}
              className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial">
                      {fabric.name}
                    </h4>
                    {fabric.localNames && (
                      <span className="text-[11px] text-zinc-400 block mt-0.5">{fabric.localNames}</span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded shrink-0">
                    {fabric.gsm} GSM
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                  {fabric.texture}
                </p>

                {/* Tech specs grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Recommended Needle:</span>
                    <span className="text-zinc-200 font-medium">{fabric.needleSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Iron Temp:</span>
                    <span className="text-zinc-200 font-medium">{fabric.ironSetting.split(' ')[0]}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-zinc-900">
                    <span className="text-[10px] text-zinc-500 block">Interfacing / Lining:</span>
                    <span className="text-zinc-300 truncate block">{fabric.liningPairing}</span>
                  </div>
                </div>
              </div>

              {/* Cutting Rule Callout */}
              <div className="text-[11px] text-zinc-300 p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex items-start gap-2">
                <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{fabric.cuttingTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fabric Detail Modal */}
      {selectedFabric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 my-auto">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">{selectedFabric.type}</span>
                <h3 className="text-lg font-bold text-white font-editorial">{selectedFabric.name}</h3>
                {selectedFabric.localNames && (
                  <p className="text-xs text-zinc-400 mt-0.5">Also known as: {selectedFabric.localNames}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedFabric(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-500 block mb-0.5 font-medium">Textile Characteristics:</span>
                <p className="text-zinc-200 leading-relaxed">{selectedFabric.texture}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div>
                  <span className="text-zinc-500 block">Weight:</span>
                  <span className="font-semibold text-amber-400">{selectedFabric.gsm} GSM</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Drape Factor:</span>
                  <span className="font-semibold text-white">{selectedFabric.drapeScore} / 10</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Needle Choice:</span>
                  <span className="font-semibold text-white">{selectedFabric.needleSize}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Iron Heat Setting:</span>
                  <span className="font-semibold text-white">{selectedFabric.ironSetting}</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1 font-medium">Optimal Garments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFabric.recommendedGarments.map((g, i) => (
                    <span key={i} className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <span className="font-semibold text-amber-400 block">Master Tailor Cutting Tip:</span>
                <p className="text-zinc-300">{selectedFabric.cuttingTip}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFabric(null)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold rounded-xl transition-colors shadow"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
