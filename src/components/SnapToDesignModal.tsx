import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, X, Sparkles, Check, ChevronRight, 
  Layers, Scissors, RotateCcw, Save, ShieldAlert, 
  Sliders, ArrowRight, Eye, RefreshCw, FileText, CheckCircle2 
} from 'lucide-react';
import { VariationType, SmartVariation, SketchProject, GarmentCategory } from '../types';
import { SMART_VARIATIONS, NOTEBOOK_SKETCH_SAMPLES } from '../data/mockData';

interface SnapToDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault: (project: Partial<SketchProject>) => void;
  initialSketchUrl?: string;
  initialTitle?: string;
}

export const SnapToDesignModal: React.FC<SnapToDesignModalProps> = ({
  isOpen,
  onClose,
  onSaveToVault,
  initialSketchUrl,
  initialTitle,
}) => {
  // Step 1: 'capture' (camera/upload) | Step 2: 'analyzer' (AI Design Analyzer with Smart Variations)
  const [currentStep, setCurrentStep] = useState<'capture' | 'analyzer'>('capture');
  const [uploadedSketch, setUploadedSketch] = useState<string>(
    initialSketchUrl || NOTEBOOK_SKETCH_SAMPLES[0].url
  );
  const [sketchTitle, setSketchTitle] = useState<string>(
    initialTitle || NOTEBOOK_SKETCH_SAMPLES[0].title
  );

  // Active variation tab: 'minimalist' | 'modern-fusion' | 'bold-embroidery'
  const [selectedVariation, setSelectedVariation] = useState<VariationType>('minimalist');
  const currentVarData = SMART_VARIATIONS[selectedVariation];

  // Editable design notes & tailoring adjustments text box
  const [editableNotes, setEditableNotes] = useState<string>(currentVarData.designNotes);
  const [clientName, setClientName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory>('Women\'s Couture');

  // Simulated AI Analyzer Scanning State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzerProgress, setAnalyzerProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Camera simulation state
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update notes whenever variation tab changes
  useEffect(() => {
    setEditableNotes(SMART_VARIATIONS[selectedVariation].designNotes);
  }, [selectedVariation]);

  useEffect(() => {
    if (initialSketchUrl) {
      setUploadedSketch(initialSketchUrl);
      if (initialTitle) setSketchTitle(initialTitle);
      setCurrentStep('analyzer');
    }
  }, [initialSketchUrl, initialTitle]);

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedSketch(reader.result as string);
        setSketchTitle(file.name.replace(/\.[^/.]+$/, "") || 'Notebook Fashion Sketch');
        triggerAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger simulated AI Design Analysis
  const triggerAnalysis = (sketchUrl: string) => {
    setUploadedSketch(sketchUrl);
    setIsAnalyzing(true);
    setAnalyzerProgress(20);

    setTimeout(() => setAnalyzerProgress(55), 400);
    setTimeout(() => setAnalyzerProgress(85), 900);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzerProgress(100);
      setCurrentStep('analyzer');
    }, 1400);
  };

  const handleSaveConceptToVault = () => {
    onSaveToVault({
      title: `${sketchTitle} (${currentVarData.label} Cut)`,
      clientName: clientName.trim() || 'Private Atelier Client',
      category: selectedCategory,
      status: 'Pattern Making',
      fabricType: currentVarData.recommendedFabrics[0],
      yardage: currentVarData.estimatedYardage,
      thumbnail: currentVarData.image || uploadedSketch,
      notes: editableNotes,
      variationType: currentVarData.label,
      deconstructedAnatomy: {
        collarType: selectedVariation === 'bold-embroidery' ? 'Embroidered Mandarin Stand' : 'Architectural Contour',
        seamType: 'French seam with 0.75" allowances',
        dartConfig: 'Rotated waistline contouring',
        liningRecommended: 'Habotai Silk / Coutil',
        hemAllowance: '1.5" reinforced hem'
      }
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Camera className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-editorial tracking-wide">
                  Snap-to-Design & AI Variation
                </h2>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                  Atelier Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Convert hand-drawn notebook sketches into production-ready silhouette variations & fabric specs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 'analyzer' && (
              <button
                onClick={() => setCurrentStep('capture')}
                className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Retake Sketch</span>
              </button>
            )}
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

          {/* ========================================================
              STEP 1: CAMERA CAPTURE / NOTEBOOK IMAGE UPLOAD INTERFACE
             ======================================================== */}
          {currentStep === 'capture' && !isAnalyzing && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Camera Shutter / Drag-and-Drop Area */}
              <div className="border-2 border-dashed border-zinc-700 hover:border-amber-400 rounded-3xl p-6 sm:p-8 bg-zinc-950/70 transition-all text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Simulated Camera Viewfinder */}
                <div className="space-y-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-300/10 border-2 border-amber-400/40 flex items-center justify-center shadow-inner group">
                    <Camera className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping opacity-30" />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-editorial">
                      Snap Tailor Notebook Sketch
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      Position your hand-drawn fashion sketch flat under workshop daylight. Capture with your phone camera or browse files.
                    </p>
                  </div>

                  {/* Shutter Button & Upload Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      <span>Snap Photo with Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload from Gallery</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Preset Notebook Sketches from Atelier Archive */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Or Test with Workshop Notebook Sketches:
                  </span>
                  <span className="text-[11px] text-amber-400 font-medium">1-Click Instant Analyzer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {NOTEBOOK_SKETCH_SAMPLES.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => {
                        setSketchTitle(sample.title);
                        triggerAnalysis(sample.url);
                      }}
                      className="group cursor-pointer bg-zinc-950 border border-zinc-800 hover:border-amber-400 rounded-2xl p-3 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 mb-2 relative">
                        <img
                          src={sample.url}
                          alt={sample.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 text-[10px] text-zinc-300 font-medium">
                          {sample.author}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                          {sample.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {sample.initialSilhouette}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              SIMULATED SCANNING ANIMATION STATE
             ======================================================== */}
          {isAnalyzing && (
            <div className="py-12 px-4 max-w-md mx-auto text-center space-y-6">
              <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-zinc-950 shadow-2xl">
                <img
                  src={uploadedSketch}
                  alt="Analyzing sketch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-amber-500/15" />
                <div className="absolute left-0 right-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-bounce" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI Design Analyzer in Progress...</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Deconstructing pencil strokes, detecting neckline geometry, dart balances, and generating smart variations.
                </p>
                {/* Progress bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300" 
                    style={{ width: `${analyzerProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: SIMULATED "AI DESIGN ANALYZER" SCREEN
             ======================================================== */}
          {currentStep === 'analyzer' && !isAnalyzing && (
            <div className="space-y-6">
              
              {/* Side-by-Side Visual Comparison: Uploaded Notebook Sketch vs Smart Variation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column A: Uploaded Sketch (Notebook photo) */}
                <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        Original Notebook Sketch
                      </span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        Pencil on Paper
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                      <img
                        src={uploadedSketch}
                        alt="Uploaded tailor sketch"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-zinc-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-zinc-300 truncate">
                        {sketchTitle}
                      </div>
                    </div>
                  </div>

                  {/* Detected Hand-Drawn Silhouette Anatomy */}
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                      Detected Hand-Drawn Silhouette
                    </span>
                    <p className="text-zinc-200 text-xs">
                      Fitted sweetheart bodice with contoured waist draping, high slit, and flared hemline.
                    </p>
                  </div>
                </div>

                {/* Column B: Smart Variations & AI Tailor Blueprint */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* "SMART VARIATIONS" TABS */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Smart Variations
                      </span>
                      <span className="text-[11px] text-zinc-400">Select cut direction</span>
                    </div>

                    {/* Interactive Variation Tabs (Buttons) */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                      {(['minimalist', 'modern-fusion', 'bold-embroidery'] as VariationType[]).map((varKey) => {
                        const v = SMART_VARIATIONS[varKey];
                        const isActive = selectedVariation === varKey;
                        return (
                          <button
                            key={varKey}
                            type="button"
                            onClick={() => setSelectedVariation(varKey)}
                            className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                              isActive
                                ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                            }`}
                          >
                            <span className="whitespace-nowrap">{v.label}</span>
                            <span className={`text-[10px] font-normal truncate ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>
                              {varKey === 'minimalist' ? 'Clean' : varKey === 'modern-fusion' ? 'Asymmetric' : 'Metallic'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Variation Visual Preview & Highlights */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white font-editorial">
                          {currentVarData.label} Silhouette Architecture
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {currentVarData.subtitle}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded shrink-0">
                        {currentVarData.estimatedYardage}
                      </span>
                    </div>

                    {/* RECOMMENDED FABRICS TAGS */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block">
                        Recommended Fabrics:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentVarData.recommendedFabrics.map((fabricName) => (
                          <span
                            key={fabricName}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-zinc-900 text-zinc-200 border border-zinc-700/80 rounded-lg hover:border-amber-400/60 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {fabricName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tailoring Adjustments Checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block">
                        Key Pattern Adjustments:
                      </span>
                      <div className="space-y-1 text-xs">
                        {currentVarData.tailoringAdjustments.map((adj, i) => (
                          <div key={i} className="flex items-start gap-2 text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{adj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* GENERATED DESIGN NOTES OR TAILORING ADJUSTMENTS TEXT BOX */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-amber-400" />
                        Generated Design Notes & Tailoring Adjustments:
                      </label>
                      <span className="text-[10px] text-zinc-500">Editable for custom workshop specs</span>
                    </div>

                    <textarea
                      rows={4}
                      value={editableNotes}
                      onChange={(e) => setEditableNotes(e.target.value)}
                      placeholder="Add custom tailor adjustments, dart depths, client requests..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl p-3.5 text-xs text-zinc-100 font-mono leading-relaxed focus:outline-none transition-colors shadow-inner"
                    />
                  </div>

                  {/* CLIENT & SAVE TO VAULT STRIP */}
                  <div className="p-4 bg-amber-400/5 border border-amber-400/25 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1 font-medium">
                          Assign Client (Optional)
                        </label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Chief Adeleke, Mrs. Lawson"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1 font-medium">
                          Garment Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value as GarmentCategory)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="Women's Couture">Women's Couture</option>
                          <option value="Men's Bespoke">Men's Bespoke</option>
                          <option value="Traditional & Ceremonial">Traditional & Ceremonial</option>
                          <option value="Contemporary Minimal">Contemporary Minimal</option>
                        </select>
                      </div>
                    </div>

                    {/* SAVE TO VAULT BUTTON */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveConceptToVault}
                        disabled={saveSuccess}
                        className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 stroke-[2.2]" />
                        <span>
                          {saveSuccess ? 'Concept Stored in Vault!' : `Save ${currentVarData.label} Concept to Vault`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `StitchAI Blueprint: ${sketchTitle} (${currentVarData.label})\nFabrics: ${currentVarData.recommendedFabrics.join(', ')}\nYardage: ${currentVarData.estimatedYardage}\nNotes: ${editableNotes}`
                          );
                          alert('Tailor specification blueprint copied to clipboard!');
                        }}
                        className="px-3 py-3 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                        title="Copy text spec"
                      >
                        Copy Specs
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
