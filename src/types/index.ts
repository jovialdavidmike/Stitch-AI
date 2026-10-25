export type TabType = 'dashboard' | 'trends' | 'vault' | 'fabrics';

export type GarmentCategory = 'Men\'s Bespoke' | 'Women\'s Couture' | 'Traditional & Ceremonial' | 'Contemporary Minimal';

export interface GarmentStyle {
  id: string;
  title: string;
  category: GarmentCategory;
  subtitle: string;
  image: string;
  accentColor: string;
  yardageRequired: string;
  recommendedFabric: string;
  drapeRating: number; // 1-10
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Tailor';
  estimatedHours: number;
  description: string;
  highlights: string[];
  patternPieces: string[];
  tailoringNotes: string;
}

export interface TrendStructuralNotes {
  lapelStyle?: string;
  hemCuts?: string;
  dartsWaist?: string;
  sleeveFinish?: string;
  neckline?: string;
}

export interface TrendFeedItem extends GarmentStyle {
  sourceName: 'BellaNaija Style' | 'Deji & Kola' | 'Vogue Runway' | 'StitchAI Editorial' | string;
  sourceUrl?: string;
  sourceBlogTag: string;
  author?: string;
  pubDate?: string;
  isLiveFeed?: boolean;
  aiStyleSummary: string; // AI-extracted 3-second style summary
  structuralNotes: TrendStructuralNotes;
  fabricTags: string[]; // e.g. ['Duchess Satin', 'Raw Silk', 'Structured Linen']
  readTime?: string;
}

export type ProjectStatus = 'Draft' | 'Pattern Making' | 'Cutting' | 'In Fitting' | 'Ready for Pickup';

export interface ClientMeasurements {
  neck?: number;
  chestBust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  sleeveLength: number;
  fullLength: number;
  inseam?: number;
  agbadaSpan?: number;
  notes?: string;
  unit: 'inches' | 'cm';
}

export interface SketchProject {
  id: string;
  userId?: string;
  title: string;
  clientName: string;
  category: GarmentCategory | string;
  dateCreated: string;
  dueDate: string;
  status: ProjectStatus;
  fabricType: string;
  yardage: string;
  thumbnail: string;
  notes: string;
  tags?: string[];
  variationType?: string;
  measurements?: ClientMeasurements;
  deconstructedAnatomy?: {
    collarType: string;
    seamType: string;
    dartConfig: string;
    liningRecommended: string;
    hemAllowance: string;
  };
}

export interface FabricItem {
  id: string;
  name: string;
  localNames?: string;
  type: string;
  gsm: number;
  texture: string;
  recommendedGarments: string[];
  needleSize: string;
  ironSetting: string;
  liningPairing: string;
  cuttingTip: string;
  drapeScore: number; // 1-10
  breathability: string;
}

export interface DeconstructionResult {
  garmentType: string;
  silhouette: string;
  estimatedYardage: string;
  suggestedFabrics: string[];
  patternPieces: { name: string; count: number; seamAllowance: string }[];
  keyAnatomy: {
    neckline: string;
    sleeves: string;
    waistClosure: string;
    ventHem: string;
  };
  criticalMeasurements: string[];
  sewingSequence: string[];
}

export type VariationType = 'minimalist' | 'modern-fusion' | 'bold-embroidery';

export interface SmartVariation {
  id: VariationType;
  label: string;
  subtitle: string;
  image: string;
  recommendedFabrics: string[];
  designNotes: string;
  tailoringAdjustments: string[];
  estimatedYardage: string;
  silhouetteDescription: string;
  complexity: 'Intermediate' | 'Advanced' | 'Master Tailor';
}

export interface MoodboardPaletteColor {
  name: string;
  hex: string;
  role: string;
  percentage: number;
}

export interface MoodboardAccessory {
  name: string;
  type: string;
  material: string;
  stylingNote: string;
}

export interface MoodboardData {
  id: string;
  styleId: string;
  title: string;
  category: GarmentCategory;
  heroImage: string;
  textureImage: string;
  accessoriesImage: string;
  palette: MoodboardPaletteColor[];
  textures: { name: string; weight: string; weave: string; description: string }[];
  accessories: MoodboardAccessory[];
  editorialTheme: string;
  vibeKeywords: string[];
}
