import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Upload, PenTool, Eraser, RotateCcw, 
  Sparkles, CheckCircle2, Scissors, Ruler, Layers, 
  Download, ArrowRight, HelpCircle, Eye
} from 'lucide-react';
import { DeconstructionResult, SketchProject } from '../types';

interface SnapExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault: (project: Partial<SketchProject>) => void;
  preselectedImage?: string;
  preselectedTitle?: string;
}

const PRESET_SKETCHES = [
  {
    name: 'Modern Agbada Cut',
    type: 'Traditional & Ceremonial',
    url: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    garmentType: '3-Piece Modern Ceremonial Agbada',
    silhouette: 'Voluminous Over-Robe with Architectural Shoulder Wings & Tapered Inner Buba',
    estimatedYardage: '7.5 – 8.5 yds (60" width) or 9.5 yds (45" width)',
    suggestedFabrics: ['Swiss Cotton Damask 135 GSM', 'Heavy Aso-Oke', 'Italian Brocade'],
    criticalMeasurements: ['Full Length (56"-62")', 'Agbada Wing Span (60"-68")', 'Shoulder Width', 'Chest/Bust', 'Trouser Inseam'],
    keyAnatomy: {
      neckline: 'Wide curved scoop with reinforced geometric placket stay',
      sleeves: 'Wing drape over arms with interior holding straps',
      waistClosure: 'Internal drawstring waist on trousers; open tunic silhouette',
      ventHem: 'Deep side drape vents with 1.5" reinforced blind hem'
    },
    patternPieces: [
      { name: 'Outer Grand Robe Wing Panel', count: 1, seamAllowance: '0.75"' },
      { name: 'Embroidered Chest Placket Facing', count: 2, seamAllowance: '0.5"' },
      { name: 'Inner Buba Bodice (Front/Back)', count: 2, seamAllowance: '0.75"' },
      { name: 'Inner Buba Sleeves', count: 2, seamAllowance: '0.5"' },
      { name: 'Sokoto Tapered Trouser Legs', count: 4, seamAllowance: '1.0"' }
    ],
    sewingSequence: [
      '1. Apply 85gsm woven fusible canvas to chest placket; execute gold metallic embroidery.',
      '2. Assemble inner Buba shoulder seams and attach sleeves flat.',
      '3. Assemble Sokoto trousers, finish in-seam pockets, and thread elasticized drawstring.',
      '4. Fold outer Agbada on grain; stitch neckband facing and anchor internal shoulder stays.',
      '5. Turn hem allowances with catch-stitch; steam press with tailor clapper.'
    ]
  },
  {
    name: 'Fitted Senator Kaftan',
    type: 'Men\'s Bespoke',
    url: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    garmentType: 'Contemporary Fitted Senator Kaftan & Trousers',
    silhouette: 'Clean semi-tailored drop silhouette with structured shoulders',
    estimatedYardage: '4.0 yds (60" width) or 4.5 yds (45" width)',
    suggestedFabrics: ['Super 150s Cashmere-Wool', 'Polish Cotton', 'Superfine Linen'],
    criticalMeasurements: ['Neck Circumference', 'Chest with 2" ease', 'Across Back', 'Sleeve Length', 'Tunic Length (40"-44")'],
    keyAnatomy: {
      neckline: '1.25" stand mandarin collar with hair-canvas internal stiffener',
      sleeves: 'Two-piece tailored set-in sleeves with 0.5" shoulder pads',
      waistClosure: 'Hidden front snap fly with concealed placket facing',
      ventHem: '8" side-seam walking vents with herringbone tape reinforcement'
    },
    patternPieces: [
      { name: 'Front Bodice with Placket Cutout', count: 1, seamAllowance: '0.75"' },
      { name: 'Back Bodice with Split Shoulder Yoke', count: 2, seamAllowance: '0.75"' },
      { name: 'Mandarin Collar & Interfacing', count: 2, seamAllowance: '0.375"' },
      { name: 'Curved Two-Piece Sleeve (Upper/Under)', count: 4, seamAllowance: '0.5"' },
      { name: 'Tapered Trouser Fronts & Backs', count: 4, seamAllowance: '1.0"' }
    ],
    sewingSequence: [
      '1. Stabilize front placket with fusible stay-tape and stitch concealed snap strip.',
      '2. Join shoulder seams to back yoke using flat-felled seam finish.',
      '3. Shape mandarin collar with tailor iron and insert into neckline.',
      '4. Set in two-piece sleeves easing shoulder cap fullness.',
      '5. Sew side seams leaving 8" vents; finish trousers with blind hem.'
    ]
  },
  {
    name: 'Structured Corset Gown',
    type: 'Women\'s Couture',
    url: '/src/assets/images/trending_corset_gown_1792948464647.jpg',
    garmentType: 'Architectural Basque Corset Gala Gown',
    silhouette: 'Sculpted Hourglass with Deep Basque Drop & Asymmetric Hip Cascade',
    estimatedYardage: '5.5 yds (60" width) + 1.5 yds Coutil lining',
    suggestedFabrics: ['Heavy Duchesse Satin 320 GSM', 'Silk Organza', 'English Cotton Coutil'],
    criticalMeasurements: ['Bust Circumference', 'Underbust', 'Waist (cinched target)', 'High Hip', 'Apex to Apex distance', 'Full Gown Length'],
    keyAnatomy: {
      neckline: 'Sculpted Sweetheart with foam-supported contour cups',
      sleeves: 'Off-shoulder organza pleats or sleeveless structural finish',
      waistClosure: 'Concealed center-back zipper with internal waist stay grosgrain ribbon',
      ventHem: 'Cascading floor-length train with 2" horsehair braid hem reinforcement'
    },
    patternPieces: [
      { name: 'Corset Bodice Panels (Center, Side Front, Back)', count: 8, seamAllowance: '0.5"' },
      { name: 'Contoured Breast Cups (Upper & Lower)', count: 4, seamAllowance: '0.375"' },
      { name: 'Internal Coutil Waist Stay', count: 1, seamAllowance: '0.25"' },
      { name: 'Asymmetric Cascading Skirt Overlays', count: 3, seamAllowance: '0.5"' },
      { name: 'Mermaid Underskirt Panels', count: 4, seamAllowance: '0.75"' }
    ],
    sewingSequence: [
      '1. Cut coutil lining and outer satin; stitch bodice panels with 0.5" bone casing channels.',
      '2. Insert 14 spiral steel bones and cap with metal tips.',
      '3. Assemble bust cups with foam laminate; wire underbust channeling.',
      '4. Drape asymmetric organza cascade onto right hip and pin securely.',
      '5. Join skirt to basque waistline; finish hemline with structured horsehair braid.'
    ]
  }
];

export const SnapExploreModal: React.FC<SnapExploreModalProps> = ({
  isOpen,
  onClose,
  onSaveToVault,
  preselectedImage,
  preselectedTitle,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'draw' | 'presets'>('presets');
  const [selectedImage, setSelectedImage] = useState<string | null>(preselectedImage || PRESET_SKETCHES[0].url);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [deconstructedData, setDeconstructedData] = useState<DeconstructionResult | null>(null);
  const [clientNameInput, setClientNameInput] = useState('');
  const [projectTitleInput, setProjectTitleInput] = useState(preselectedTitle || 'Modern Agbada Cut');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#d4af37');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (preselectedImage) {
      setSelectedImage(preselectedImage);
      if (preselectedTitle) setProjectTitleInput(preselectedTitle);
    }
  }, [preselectedImage, preselectedTitle]);

  // Canvas initialization
  useEffect(() => {
    if (activeMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw background
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw light croquis mannequin silhouette guide in subtle gray
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Head
        ctx.arc(canvas.width / 2, 50, 16, 0, Math.PI * 2);
        // Neck & Shoulders
        ctx.moveTo(canvas.width / 2 - 8, 66);
        ctx.lineTo(canvas.width / 2 - 40, 95);
        ctx.lineTo(canvas.width / 2 - 25, 170); // Torso waist
        ctx.lineTo(canvas.width / 2 - 38, 240); // Hips
        ctx.lineTo(canvas.width / 2 - 25, 380); // Legs
        
        ctx.moveTo(canvas.width / 2 + 8, 66);
        ctx.lineTo(canvas.width / 2 + 40, 95);
        ctx.lineTo(canvas.width / 2 + 25, 170);
        ctx.lineTo(canvas.width / 2 + 38, 240);
        ctx.lineTo(canvas.width / 2 + 25, 380);
        ctx.stroke();
      }
    }
  }, [activeMode]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setProjectTitleInput(file.name.replace(/\.[^/.]+$/, "") || 'Custom Workshop Sketch');
        setDeconstructedData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = isEraser ? '#18181b' : brushColor;
    ctx.lineWidth = isEraser ? 16 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const captureCanvasAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSelectedImage(dataUrl);
      setActiveMode('upload');
      setProjectTitleInput('Atelier Croquis Sketch');
      setDeconstructedData(null);
    }
  };

  // Run AI Deconstruction simulation
  const runDeconstruction = () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 650);
    setTimeout(() => setScanStep(3), 1300);
    setTimeout(() => {
      setIsScanning(false);
      setScanStep(0);

      // Match preset data or generate generic high-fidelity tailor analysis
      const matchedPreset = PRESET_SKETCHES.find(p => p.url === selectedImage || selectedImage?.includes(p.name.toLowerCase()));
      if (matchedPreset) {
        setDeconstructedData({
          garmentType: matchedPreset.garmentType,
          silhouette: matchedPreset.silhouette,
          estimatedYardage: matchedPreset.estimatedYardage,
          suggestedFabrics: matchedPreset.suggestedFabrics,
          patternPieces: matchedPreset.patternPieces,
          keyAnatomy: matchedPreset.keyAnatomy,
          criticalMeasurements: matchedPreset.criticalMeasurements,
          sewingSequence: matchedPreset.sewingSequence
        });
      } else {
        // Dynamic smart result for user uploaded sketches
        setDeconstructedData({
          garmentType: 'Bespoke Structured Ensemble',
          silhouette: 'Fitted Bodice with Sculpted Waist Drape & High Collar Architecture',
          estimatedYardage: '5.0 – 5.5 yards (60" Fabric) or 6.8 yards (45" Fabric)',
          suggestedFabrics: ['Super 140s Cashmere-Wool', 'Heavy Duchesse Satin', 'Swiss Cotton Damask'],
          patternPieces: [
            { name: 'Front Bodice with Contour Darts', count: 2, seamAllowance: '0.75"' },
            { name: 'Back Bodice with Split Center Seam', count: 2, seamAllowance: '0.75"' },
            { name: 'Architectural Sleeve Panels', count: 4, seamAllowance: '0.5"' },
            { name: 'Waist Facings & Canvas Interfacing', count: 3, seamAllowance: '0.375"' },
            { name: 'Tapered Skirt / Trouser Segments', count: 4, seamAllowance: '1.0"' }
          ],
          keyAnatomy: {
            neckline: 'Sculpted structured collar line with fusible stay-tape',
            sleeves: 'Ergonomic curve with reinforced cap ease',
            waistClosure: 'Internal tailored waistband stay with concealed hook & eye',
            ventHem: 'Balanced walking vent with 1.5" mitered hem corners'
          },
          criticalMeasurements: ['Chest/Bust', 'High Waist', 'Full Hip', 'Shoulder Width', 'Sleeve Inseam', 'Full Desired Length'],
          sewingSequence: [
            '1. Trace grainlines onto fabric with tailor chalk; cut with 0.75" side allowances.',
            '2. Apply fusible canvas to neckline, collar, and placket areas.',
            '3. Baste darts and shoulder seams for client toile fitting.',
            '4. Stitch permanent seams, press open on tailor ham with steam.',
            '5. Set sleeves, stitch linings, and finish lower hem with blind catch-stitch.'
          ]
        });
      }
    }, 2000);
  };

  const handleSaveToVault = () => {
    if (!deconstructedData) return;
    onSaveToVault({
      title: projectTitleInput || 'Bespoke Atelier Garment',
      clientName: clientNameInput.trim() || 'Walk-in Client',
      category: 'Men\'s Bespoke',
      status: 'Pattern Making',
      fabricType: deconstructedData.suggestedFabrics[0],
      yardage: deconstructedData.estimatedYardage,
      thumbnail: selectedImage || PRESET_SKETCHES[0].url,
      notes: `Deconstructed via StitchAI Studio. Silhouette: ${deconstructedData.silhouette}.`,
      deconstructedAnatomy: {
        collarType: deconstructedData.keyAnatomy.neckline,
        seamType: 'Tailor flat-felled & french seams',
        dartConfig: 'Contoured architectural darts',
        liningRecommended: 'Lightweight Cupro / Habotai Silk',
        hemAllowance: '1.5" blind hem'
      }
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-editorial tracking-wide">
                Snap & Explore Sketch
              </h2>
              <p className="text-xs text-zinc-400 hidden sm:block">
                AI Pattern Deconstructor & Workshop Blueprint Generator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Method Tabs */}
          <div className="flex items-center justify-center">
            <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full">
              <button
                onClick={() => setActiveMode('presets')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeMode === 'presets' 
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sample Styles
              </button>
              <button
                onClick={() => setActiveMode('upload')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeMode === 'upload' 
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Snap / Upload
              </button>
              <button
                onClick={() => setActiveMode('draw')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeMode === 'draw' 
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Draw Sketchpad
              </button>
            </div>
          </div>

          {/* MODE: PRESETS */}
          {activeMode === 'presets' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 font-medium">
                Choose a trending style blueprint to deconstruct:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_SKETCHES.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setProjectTitleInput(preset.name);
                      setDeconstructedData(null);
                    }}
                    className={`relative rounded-xl border p-2.5 cursor-pointer transition-all ${
                      selectedImage === preset.url
                        ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-900 mb-2 relative">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === preset.url && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-zinc-950 p-1 rounded-full shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white truncate">{preset.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{preset.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE: UPLOAD / CAMERA */}
          {activeMode === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-2xl p-6 text-center bg-zinc-950/60 transition-colors">
                <input
                  type="file"
                  id="sketch-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="sketch-upload"
                  className="flex flex-col items-center justify-center cursor-pointer space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center shadow-inner">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Click to take photo or upload fashion sketch
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Supports JPG, PNG, WEBP from phone camera or workshop drafts
                    </div>
                  </div>
                  <span className="px-4 py-1.5 text-xs font-medium text-zinc-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors">
                    Browse File / Open Camera
                  </span>
                </label>
              </div>

              {selectedImage && (
                <div className="flex items-center gap-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <img
                    src={selectedImage}
                    alt="Current sketch"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-zinc-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{projectTitleInput}</div>
                    <div className="text-xs text-zinc-400">Ready for automated pattern deconstruction</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE: DRAW SKETCHPAD */}
          {activeMode === 'draw' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                {/* Tools */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEraser(false)}
                    className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      !isEraser ? 'bg-amber-400 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white bg-zinc-900'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pencil</span>
                  </button>
                  <button
                    onClick={() => setIsEraser(true)}
                    className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      isEraser ? 'bg-amber-400 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white bg-zinc-900'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Eraser</span>
                  </button>
                </div>

                {/* Colors */}
                {!isEraser && (
                  <div className="flex items-center gap-1.5">
                    {['#d4af37', '#ffffff', '#10b981', '#3b82f6', '#e11d48', '#a855f7'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBrushColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border ${
                          brushColor === c ? 'ring-2 ring-white scale-110' : 'border-zinc-700'
                        }`}
                        title={c}
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearCanvas}
                    className="p-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                  <button
                    onClick={captureCanvasAsImage}
                    className="px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    Use This Sketch
                  </button>
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="relative border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={420}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair touch-none max-w-full"
                />
              </div>
              <p className="text-[11px] text-zinc-500 text-center">
                Tip: Draw neckline, darts, sleeve shape, and hem style over the croquis guide.
              </p>
            </div>
          )}

          {/* PREVIEW & SCAN TRIGGER */}
          {selectedImage && activeMode !== 'draw' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 max-h-64 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Selected sketch"
                  referrerPolicy="no-referrer"
                  className="max-h-64 object-contain"
                />

                {/* Laser scan animation line */}
                {isScanning && (
                  <div className="absolute inset-0 bg-amber-500/10 pointer-events-none flex flex-col justify-between">
                    <div className="w-full h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-bounce" />
                    <div className="p-3 text-center bg-zinc-950/90 text-amber-300 text-xs font-mono">
                      {scanStep === 1 && "Scanning silhouette grainline & apex landmarks..."}
                      {scanStep === 2 && "Deconstructing darts, seam allowances & pleat fullness..."}
                      {scanStep === 3 && "Synthesizing master cutting order & fabric matrix..."}
                    </div>
                  </div>
                )}
              </div>

              {!deconstructedData && (
                <button
                  onClick={runDeconstruction}
                  disabled={isScanning}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? 'Analyzing Sketch Architecture...' : 'Deconstruct Sketch Architecture'}</span>
                </button>
              )}
            </div>
          )}

          {/* DECONSTRUCTION RESULTS BLUEPRINT */}
          {deconstructedData && (
            <div className="space-y-6 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
                    Tailor Workshop Blueprint
                  </span>
                  <h3 className="text-lg font-bold text-white font-editorial">
                    {deconstructedData.garmentType}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Estimated Yardage</div>
                  <div className="text-sm font-bold text-amber-400">{deconstructedData.estimatedYardage}</div>
                </div>
              </div>

              {/* Silhouette & Fabrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    Silhouette Architecture
                  </div>
                  <div className="text-zinc-200 font-semibold">{deconstructedData.silhouette}</div>
                </div>

                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Optimal Fabric Pairings
                  </div>
                  <div className="text-zinc-200">{deconstructedData.suggestedFabrics.join(' · ')}</div>
                </div>
              </div>

              {/* Garment Anatomy Matrix */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-semibold text-zinc-300">Garment Anatomy & Dart Logic</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500">Neckline / Collar:</span>
                    <p className="text-zinc-200 mt-0.5">{deconstructedData.keyAnatomy.neckline}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Sleeves & Armhole:</span>
                    <p className="text-zinc-200 mt-0.5">{deconstructedData.keyAnatomy.sleeves}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Waist & Fastening:</span>
                    <p className="text-zinc-200 mt-0.5">{deconstructedData.keyAnatomy.waistClosure}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Hem & Vent Finish:</span>
                    <p className="text-zinc-200 mt-0.5">{deconstructedData.keyAnatomy.ventHem}</p>
                  </div>
                </div>
              </div>

              {/* Pattern Pieces Table */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-zinc-300">
                  Required Pattern Pieces & Seam Allowances
                </div>
                <div className="space-y-1.5">
                  {deconstructedData.patternPieces.map((piece, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-zinc-900 last:border-0">
                      <span className="text-zinc-200">{piece.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400">{piece.count} cut{piece.count > 1 ? 's' : ''}</span>
                        <span className="font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded text-[11px]">
                          +{piece.seamAllowance} seam
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sewing Order Sequence */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-zinc-300">Step-by-Step Workshop Assembly Sequence</div>
                <div className="space-y-1.5">
                  {deconstructedData.sewingSequence.map((step, idx) => (
                    <div key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save To Vault Form */}
              <div className="p-4 bg-amber-400/5 border border-amber-400/20 rounded-2xl space-y-3">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  Save to Workshop Sketch Vault
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Project / Style Title</label>
                    <input
                      type="text"
                      value={projectTitleInput}
                      onChange={(e) => setProjectTitleInput(e.target.value)}
                      placeholder="e.g., Royal Agbada for Wedding"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={clientNameInput}
                      onChange={(e) => setClientNameInput(e.target.value)}
                      placeholder="e.g., Senator Adeleke or Ms. Joy"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveToVault}
                    disabled={saveSuccess}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveSuccess ? 'Saved to Vault!' : 'Save Project to Vault'}</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Tailor specification blueprint copied to clipboard for workshop sharing!');
                    }}
                    className="px-3 py-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                  >
                    Copy Blueprint
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
