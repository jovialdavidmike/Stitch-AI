import { GarmentStyle, SketchProject, FabricItem, SmartVariation, VariationType, MoodboardData } from '../types';

export const TRENDING_STYLES: GarmentStyle[] = [
  {
    id: 'trend-agbada',
    title: 'Modern Agbada Cut',
    subtitle: 'Ceremonial grand robe with streamlined drape & metallic chevron embroidery',
    category: 'Traditional & Ceremonial',
    image: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    accentColor: '#10b981',
    yardageRequired: '7.5 – 8.5 yds',
    recommendedFabric: 'Swiss Cotton Damask, Aso-Oke, or Structured Wool Brocade',
    drapeRating: 9.4,
    complexity: 'Advanced',
    estimatedHours: 28,
    description: 'A contemporary reimagining of the classic Yoruba 3-piece grand attire. Features refined shoulder tucks, a slimmer interior buba silhouette, and tapered trousers, allowing the flowing outer robe to billow with architectural grace without overwhelming the wearer.',
    highlights: [
      'Tailored inner buba prevents excess bulk under outer wings',
      'Engineered geometric chest placket with reinforced fusible canvas',
      'Shoulder drape anchors prevent constant sliding off shoulders',
      'Slim cigarette-cut Sokoto trousers with drawstring & welt pockets'
    ],
    patternPieces: [
      'Outer Grand Wing (Front & Back fold - 1pc)',
      'Chequered Front Embroidered Placket (1pc)',
      'Inner Buba Bodice (Front & Back - 2pcs)',
      'Buba Straight Cut Sleeves (2pcs)',
      'Tapered Sokoto Trouser Legs (4pcs)',
      'Neckband & Internal Facing Stays (3pcs)'
    ],
    tailoringNotes: 'Pre-shrink damask before embroidery. Stabilize the chest area with 85gsm woven fusible interfacing to hold heavyweight metallic embroidery without puckering.'
  },
  {
    id: 'trend-kaftan',
    title: 'Fitted Bespoke Kaftan',
    subtitle: 'Architectural silhouette with concealed placket & asymmetric needlework',
    category: 'Men\'s Bespoke',
    image: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    accentColor: '#3b82f6',
    yardageRequired: '4.0 – 4.5 yds',
    recommendedFabric: 'Super 150s Cashmere-Wool Blend, Polish Cotton, or Italian Wool',
    drapeRating: 8.6,
    complexity: 'Intermediate',
    estimatedHours: 16,
    description: 'The definitive modern Senator/Kaftan tunic. Precision-engineered with high armholes for effortless arm movement, a structured 1.25" mandarin collar, and hidden snap placket with tonal geometric thread accent on the upper left chest.',
    highlights: [
      'Ergonomic two-piece sleeve with 0.5" shoulder slope compensation',
      'Concealed placket with invisible reinforced press fasteners',
      'Side seam vents reinforced with herringbone stay-tape',
      'Tailored flat-front trousers with concealed waistband adjusters'
    ],
    patternPieces: [
      'Front Bodice with asymmetric slant cut (1pc)',
      'Back Bodice with split shoulder yoke (2pcs)',
      'Mandarin Stand Collar with canvas stay (2pcs)',
      'Curved Two-Piece Sleeve (4pcs)',
      'Trouser Front & Back Panels (4pcs)',
      'Side Pocket Bags & Concealed Fly Facing (4pcs)'
    ],
    tailoringNotes: 'Use 0.75" seam allowances on side seams for future client fitting adjustments. Press collar points using tailor clapper for crisp razor edges.'
  },
  {
    id: 'trend-corset',
    title: 'Structured Corset Gown',
    subtitle: 'Haute couture basque waistline with 14-point spiral steel boning & cascade train',
    category: 'Women\'s Couture',
    image: '/src/assets/images/trending_corset_gown_1792948464647.jpg',
    accentColor: '#e11d48',
    yardageRequired: '5.5 – 6.5 yds',
    recommendedFabric: 'Heavy Duchesse Satin, Silk Organza, & Cotton Coutil lining',
    drapeRating: 9.8,
    complexity: 'Master Tailor',
    estimatedHours: 36,
    description: 'An architectural evening masterpiece featuring a sculpted sweetheart neckline, internal coutil waist cincher, and an asymmetric sculpted drape that falls from the right hip into an editorial cascading waterfall train.',
    highlights: [
      '14 internal bone casings utilizing 6mm spiral steel for flexible support',
      'Underwired foam laminate cups contoured to custom apex measurements',
      'Deep Basque waist drop creating an elongated hourglass contour',
      'Horsehair braid hem reinforcement for structural skirt flare'
    ],
    patternPieces: [
      'Corset Bodice Panels: Center Front, Side Front, Side Back, Center Back (8pcs)',
      'Upper & Lower Bust Cups (4pcs)',
      'Interior Coutil Waist Stay Belt (1pc)',
      'Asymmetric Waterfall Hip Cascade Drapes (3pcs)',
      'Mermaid Skirt Quarter Panels (4pcs)',
      'Integrated Horsehair Braid Hem Binding (1pc)'
    ],
    tailoringNotes: 'Ensure coutil grainline runs strictly horizontal around the waistline to eliminate any stretch. Always conduct a muslin toile fitting prior to cutting final satin.'
  }
];

export const INITIAL_VAULT_PROJECTS: SketchProject[] = [
  {
    id: 'proj-001',
    title: 'Emerald Ceremonial Agbada',
    clientName: 'Chief Babatunde Alabi',
    category: 'Traditional & Ceremonial',
    dateCreated: '2026-10-18',
    dueDate: '2026-11-05',
    status: 'In Fitting',
    fabricType: 'Swiss Voile Cotton Damask (Forest Green)',
    yardage: '8.0 yards',
    thumbnail: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    notes: 'Client requested gold thread detailing on collar and cuffs. Fitting scheduled this Thursday afternoon. Needs 0.5" hem adjustment on trouser.',
    measurements: {
      neck: 17.5,
      chestBust: 44,
      waist: 38,
      hips: 45,
      shoulderWidth: 19.5,
      sleeveLength: 26,
      fullLength: 58,
      inseam: 32,
      agbadaSpan: 62,
      unit: 'inches',
      notes: 'Prefers slightly wider leg opening on trousers (17" cuff).'
    },
    deconstructedAnatomy: {
      collarType: 'Round slit neck with reinforced embroidered yoke',
      seamType: 'French seam finish on sleeve drape wings',
      dartConfig: 'Double waist darts on inner buba',
      liningRecommended: 'Lightweight Habotai silk for inner buba shoulder',
      hemAllowance: '1.5" blind catch-stitch hem'
    }
  },
  {
    id: 'proj-002',
    title: 'Midnight Navy Mandarin Kaftan',
    clientName: 'David Adeleke',
    category: 'Men\'s Bespoke',
    dateCreated: '2026-10-21',
    dueDate: '2026-10-30',
    status: 'Cutting',
    fabricType: 'Super 150s Cashmere-Wool (Midnight Blue)',
    yardage: '4.2 yards',
    thumbnail: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    notes: 'Pattern drafted with 0.5" ease on chest. Ready for chalking and shears on workshop cutting table.',
    measurements: {
      neck: 16,
      chestBust: 40,
      waist: 32,
      hips: 39,
      shoulderWidth: 18,
      sleeveLength: 25.5,
      fullLength: 42,
      inseam: 31,
      unit: 'inches',
      notes: 'Athletic drop taper: ensure chest ease without pouching at small of back.'
    },
    deconstructedAnatomy: {
      collarType: '1.25" Stand Mandarin Collar with woven hair-canvas',
      seamType: 'Clean closed flat-felled seam',
      dartConfig: 'Back contour shoulder fish darts',
      liningRecommended: 'Half-lined back yoke with breathable Cupro',
      hemAllowance: '1.25" fused hem with pick-stitch finish'
    }
  },
  {
    id: 'proj-003',
    title: 'Burgundy Basque Corset Gala Gown',
    clientName: 'Dr. Zainab Mohammed',
    category: 'Women\'s Couture',
    dateCreated: '2026-10-12',
    dueDate: '2026-11-12',
    status: 'Pattern Making',
    fabricType: 'Duchesse Satin & Crimson Silk Organza',
    yardage: '6.0 yards',
    thumbnail: '/src/assets/images/trending_corset_gown_1792948464647.jpg',
    notes: 'Second toile fitting passed. Transferring drape lines to master craft paper pattern.',
    measurements: {
      chestBust: 36,
      waist: 27,
      hips: 39,
      shoulderWidth: 15.5,
      sleeveLength: 0,
      fullLength: 61,
      unit: 'inches',
      notes: 'Apex distance 7.5", underbust 29", high hip 34".'
    },
    deconstructedAnatomy: {
      collarType: 'Architectural Sweetheart with off-shoulder organza fan',
      seamType: 'Flat bone-casing seam with 0.5" seam allowances',
      dartConfig: '8-panel vertical princess curve contouring',
      liningRecommended: '100% Cotton English Coutil for structural strength',
      hemAllowance: '2" Horsehair braid circular hem'
    }
  }
];

export const FABRICS_DIRECTORY: FabricItem[] = [
  {
    id: 'fabric-damask',
    name: 'Swiss Cotton Damask / Voile',
    localNames: 'Swiss Brocade, Shadda, Guinea Fowl Cotton',
    type: '100% Long-Staple Combed Cotton',
    gsm: 135,
    texture: 'Crisp jacquard luster with subtle geometric weave, silky handfeel',
    recommendedGarments: ['Modern Agbada', 'Ceremonial Kaftans', 'Boubou Gowns'],
    needleSize: '70/10 or 80/12 Microtex',
    ironSetting: 'Medium-High (180°C - 200°C) with steam',
    liningPairing: 'Self-fabric facing or lightweight cotton batiste',
    cuttingTip: 'Press with starch spray before pattern tracing to prevent shift along bias.',
    drapeScore: 8.8,
    breathability: 'High - ideal for warm workshop climates'
  },
  {
    id: 'fabric-cashmere-wool',
    name: 'Super 140s – 160s Cashmere-Wool',
    localNames: 'Italian Suit Wool, Senator Fabric',
    type: '90% Virgin Merino Wool, 10% Mongolian Cashmere',
    gsm: 280,
    texture: 'Smooth, resilient matte weave with buttery softness and natural drape',
    recommendedGarments: ['Senator Tunic Suits', 'Bespoke Kaftans', 'Two-Piece Blazers'],
    needleSize: '80/12 Universal or Jeans Needle',
    ironSetting: 'Medium (150°C) strictly with a damp pressing cloth',
    liningPairing: 'Bemberg Cupro or Silk Twill half-lining',
    cuttingTip: 'Use razor-sharp heavy tailor shears (10"-12"); avoids pulling wool nap.',
    drapeScore: 9.2,
    breathability: 'Medium-High temperature regulating'
  },
  {
    id: 'fabric-duchesse-satin',
    name: 'Heavyweight Duchesse Satin',
    localNames: 'Bridal Satin, Silk Duchesse',
    type: '100% Filament Silk or High-Grade Polyester Microfiber',
    gsm: 320,
    texture: 'Heavy, lustrous structural drape with subtle pearlescent sheen',
    recommendedGarments: ['Corset Evening Gowns', 'Sculpted Peplum Jackets', 'Mermaid Skirts'],
    needleSize: '70/10 Microtex Sharp (prevents snagging satin warp threads)',
    ironSetting: 'Low-Medium (120°C) dry iron from the wrong side only',
    liningPairing: 'English Cotton Coutil (under corsets) or Crepe de Chine',
    cuttingTip: 'Weight down patterns; pins will leave permanent holes in satin face.',
    drapeScore: 9.6,
    breathability: 'Moderate'
  },
  {
    id: 'fabric-ankara',
    name: 'Dutch Wax Ankara Block Print',
    localNames: 'Real Wax Hollandais, African Print, Kitenge',
    type: '100% High-Density Premium Cotton',
    gsm: 170,
    texture: 'Firm wax-finished cotton that softens beautifully upon steaming',
    recommendedGarments: ['Statement Blazers', 'Fit & Flare Dresses', 'Modern Two-Piece Sets'],
    needleSize: '80/12 or 90/14 Universal',
    ironSetting: 'High (200°C) steam iron',
    liningPairing: 'Broadcloth cotton or lightweight poly-viscose',
    cuttingTip: 'Crucial to mirror print motifs across center front seam for pattern symmetry.',
    drapeScore: 7.8,
    breathability: 'High'
  },
  {
    id: 'fabric-linen',
    name: 'Raw Belgian & Irish Linen',
    localNames: 'Pure Flax Linen',
    type: '100% Natural Flax Fiber',
    gsm: 210,
    texture: 'Artisanal slubbed texture, relaxed elegance, gains character with wear',
    recommendedGarments: ['Resort Kaftans', 'Safari Jackets', 'Pleated Tailored Trousers'],
    needleSize: '80/12 Sharp',
    ironSetting: 'High (220°C) while garment is slightly damp',
    liningPairing: 'Unlined for maximum breathability or ultra-sheer cotton voile',
    cuttingTip: 'Pre-wash prior to cutting — natural flax shrinks 4–6% on first wash cycle.',
    drapeScore: 8.4,
    breathability: 'Maximum'
  },
  {
    id: 'fabric-silk-crepe',
    name: 'Heavy Silk Crepe & Morocain',
    localNames: 'Crepe de Chine, Pebble Crepe',
    type: '100% Mulberry Silk',
    gsm: 160,
    texture: 'Pebbled matte surface, fluid liquid drape that glides against body contours',
    recommendedGarments: ['Draped Boubou', 'Grecian Cowl Gowns', 'Flowing Palazzo Suits'],
    needleSize: '65/9 or 70/10 Microtex Sharp',
    ironSetting: 'Low (110°C) dry, no water drops to prevent water stains',
    liningPairing: 'Self-fabric or habotai silk lining',
    cuttingTip: 'Cut over tissue paper to prevent the fluid silk from shifting off grain.',
    drapeScore: 9.9,
    breathability: 'Very High'
  }
];

export const GARMENT_YARDAGE_MATRIX: Record<string, Record<string, number>> = {
  '3-Piece Modern Agbada': { '45" Width': 8.5, '54" Width': 7.5, '60" Width': 6.8 },
  'Senator / Bespoke Kaftan & Pant': { '45" Width': 4.5, '54" Width': 4.0, '60" Width': 3.5 },
  'Structured Corset Gala Gown': { '45" Width': 6.5, '54" Width': 5.8, '60" Width': 5.0 },
  'Pleated Boubou Grand Caftan': { '45" Width': 5.5, '54" Width': 4.8, '60" Width': 4.2 },
  'Two-Piece Tailored Suit': { '45" Width': 5.0, '54" Width': 4.2, '60" Width': 3.6 },
  '6-Piece Mermaid Skirt': { '45" Width': 4.0, '54" Width': 3.5, '60" Width': 3.0 }
};

export const NOTEBOOK_SKETCH_SAMPLES = [
  {
    id: 'sketch-notebook-1',
    title: 'Couture Evening Drape & Beaded Bodice',
    author: 'Workshop Notebook · Page 24',
    url: '/src/assets/images/tailor_notebook_sketch_1792948921650.jpg',
    garmentType: 'Draped Column Gown with Beaded Bodice',
    initialSilhouette: 'Fitted sweetheart corset with bias-cut hip drape and flare train'
  },
  {
    id: 'sketch-notebook-2',
    title: 'Modern Agbada Silhouette Draft',
    author: 'Workshop Notebook · Page 18',
    url: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    garmentType: '3-Piece Ceremonial Agbada',
    initialSilhouette: 'Wide sweeping shoulder wings with geometric chest chevron placket'
  },
  {
    id: 'sketch-notebook-3',
    title: 'Senator Kaftan with Slant Cut',
    author: 'Workshop Notebook · Page 31',
    url: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    garmentType: 'Mandarin Stand-Collar Kaftan',
    initialSilhouette: 'Architectural semi-tailored tunic with concealed snap closure'
  }
];

export const SMART_VARIATIONS: Record<VariationType, SmartVariation> = {
  'minimalist': {
    id: 'minimalist',
    label: 'Minimalist',
    subtitle: 'Pure architectural lines, concealed closures & reduced darting',
    image: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    recommendedFabrics: ['Soft Linen', 'Cotton Duchesse', 'Silk Crepe', 'Wool Blend'],
    silhouetteDescription: 'Clean monolithic contour without external topstitching, utilizing internal bias stays and French seam finishes.',
    estimatedYardage: '4.5 – 5.0 yards',
    complexity: 'Intermediate',
    designNotes: 'Architectural minimalist conversion: eliminate external beadwork or excessive surface trims. Rotate bust dart into side waistline gathering for an unbroken chest plane. Use 0.5" blind catch-stitch along all edges for clean museum-grade minimalism.',
    tailoringAdjustments: [
      'Reduce bust ease from 2.5" to 1.5" for a clean, glove-like tailored drape',
      'Replace visible neck facing topstitching with internal understitching and hand tacking',
      'Insert 1.25" horsehair braid into lower hem facing for crisp geometric drape without flare bulk',
      'Shift center back seam curvature inward by 0.5" at lumbar to eliminate hollow-back pooling'
    ]
  },
  'modern-fusion': {
    id: 'modern-fusion',
    label: 'Modern Fusion',
    subtitle: 'Asymmetric crossover drape, structured boning & hybrid silhouettes',
    image: '/src/assets/images/trending_corset_gown_1792948464647.jpg',
    recommendedFabrics: ['Organza', 'Cotton Duchesse', 'Heavy Duchesse Satin', 'Silk Organza'],
    silhouetteDescription: 'Sculpted corsetry balanced by flowing asymmetric drape panels and dynamic shoulder volume.',
    estimatedYardage: '6.0 – 6.5 yards',
    complexity: 'Master Tailor',
    designNotes: 'High-fashion modern fusion adaptation: synthesize the hand-drawn sketch with an architectural basque waistline and an off-shoulder organza cascade drape. Structure the bodice with 12 spiral steel stays and an internal cotton coutil waist stay.',
    tailoringAdjustments: [
      'Extend right hip cascading drape by 14" to sweep into a subtle floor-length waterfall train',
      'Reinforce left side-seam invisible zipper with double herringbone stay-tape to support hip drape weight',
      'Apply 0.5" shoulder slope drop compensation on left bodice to balance asymmetric neck drape',
      'Integrate underwire channel with plush casing to cushion underbust contour against skin'
    ]
  },
  'bold-embroidery': {
    id: 'bold-embroidery',
    label: 'Bold Embroidery Layout',
    subtitle: 'Geometric metallic bullion thread, mirrored plackets & ceremonial motifs',
    image: '/src/assets/images/variation_bold_embroidery_1792948922538.jpg',
    recommendedFabrics: ['Cotton Duchesse', 'Heavyweight Velvet', 'Swiss Voile Brocade', 'Soft Linen'],
    silhouetteDescription: 'Regal structured canvas engineered with reinforced needlework zones on collar, chest, and hem.',
    estimatedYardage: '5.5 – 6.2 yards',
    complexity: 'Advanced',
    designNotes: 'Ceremonial bold embroidery layout: translate the sketch into high-density metallic gold bullion needlework across the 1.5" mandarin stand-collar and center placket. Back all embroidery zones with 95 GSM woven fusible interfacing and tear-away stabilizer to prevent textile distortion.',
    tailoringAdjustments: [
      'Add extra +1.0" seam allowances on all chest placket and cuff panels to accommodate hoop tension loss',
      'Pre-shrink cotton duchesse or velvet with dry steam prior to chalking embroidery guidelines',
      'Align chest geometric chevron points precisely along the center front grainline with 0mm deviation tolerance',
      'Line embroidery reverse with ultra-soft Habotai silk to shield client skin from metallic thread friction'
    ]
  }
};

export const getMoodboardForStyle = (style: GarmentStyle): MoodboardData => {
  if (style.id === 'trend-agbada') {
    return {
      id: `mb-${style.id}`,
      styleId: style.id,
      title: `${style.title} · Regal Ceremonial Moodboard`,
      category: style.category,
      editorialTheme: 'Dynastic Splendor & Precision Geometric Filigree',
      vibeKeywords: ['Architectural Grandeur', 'Bullion Embroidery', 'Sovereign Presence', 'Tactile Brocade'],
      heroImage: style.image,
      textureImage: '/src/assets/images/moodboard_textures_swatches_1792949207828.jpg',
      accessoriesImage: '/src/assets/images/moodboard_accessories_bespoke_1792949208142.jpg',
      palette: [
        { name: 'Imperial Emerald', hex: '#0a3d24', role: 'Dominant Fabric Field', percentage: 55 },
        { name: 'Metallic Bullion Gold', hex: '#d4af37', role: 'Chevron Needlework Accent', percentage: 20 },
        { name: 'Obsidian Velvet', hex: '#121214', role: 'Structural Foundation', percentage: 12 },
        { name: 'Champagne Raw Silk', hex: '#ede4d8', role: 'Inner Lining & Contrast', percentage: 8 },
        { name: 'Warm Burnished Brass', hex: '#b38234', role: 'Hardware & Findings', percentage: 5 }
      ],
      textures: [
        { name: 'Swiss Cotton Damask', weight: '135 GSM', weave: 'Jacquard Weave', description: 'Silky tactile hand with subtle diamond ground motif' },
        { name: 'Metallic Gold Bullion Thread', weight: 'Fine Twist', weave: 'Filigree Embroidery', description: 'High-density reflective bullion thread with zero fray' },
        { name: 'Artisanal Raw Linen Swatch', weight: '210 GSM', weave: 'Slubbed Weft', description: 'Breathable, structured textural companion for collar stays' },
        { name: 'Deep Emerald Velvet', weight: '310 GSM', weave: 'Dense Cut Pile', description: 'Rich light-absorbing contrast trim for pocket welts' }
      ],
      accessories: [
        { name: 'Hand-Burnished Oxford Dress Shoes', type: 'Footwear', material: 'Full-Grain Calfskin Leather', stylingNote: 'Deep espresso patina anchors the sweeping green hemline.' },
        { name: 'Sculpted Brass Geometric Cufflinks', type: 'Jewelry', material: 'Brushed Solid Brass', stylingNote: 'Echoes the angular geometry of the chest embroidery placket.' },
        { name: 'Heritage Crest Signet Ring', type: 'Jewelry', material: '18k Polished Gold', stylingNote: 'Subtle ancestral statement piece for ceremonial greeting.' },
        { name: 'Hand-Woven Fila Cap (Gobi Cut)', type: 'Headwear', material: 'Matching Aso-Oke / Damask', stylingNote: 'Creased diagonally to complement the shoulder wing lines.' },
        { name: 'Paisley Silk Twill Pocket Square', type: 'Accents', material: 'Pure Silk Twill', stylingNote: 'Tucked neatly into Sokoto trouser welt pocket.' }
      ]
    };
  }

  if (style.id === 'trend-kaftan') {
    return {
      id: `mb-${style.id}`,
      styleId: style.id,
      title: `${style.title} · Bespoke Menswear Moodboard`,
      category: style.category,
      editorialTheme: 'Nocturne Navy & Minimalist Savile-African Tailoring',
      vibeKeywords: ['Clean Monolithic Lines', 'Understated Luxury', 'Ergonomic Ease', 'Midnight Tone'],
      heroImage: style.image,
      textureImage: '/src/assets/images/moodboard_textures_swatches_1792949207828.jpg',
      accessoriesImage: '/src/assets/images/moodboard_accessories_bespoke_1792949208142.jpg',
      palette: [
        { name: 'Midnight Royal Navy', hex: '#162238', role: 'Main Tunic & Trouser Field', percentage: 60 },
        { name: 'Graphite Charcoal', hex: '#2b313d', role: 'Facing & Collar Canvas', percentage: 20 },
        { name: 'Burnished Honey Brass', hex: '#c59b27', role: 'Discreet Needlework Line', percentage: 10 },
        { name: 'Crisp Alabaster', hex: '#f8fafc', role: 'Shirt Cuff Peeking Accent', percentage: 6 },
        { name: 'Patinated Tobacco', hex: '#593215', role: 'Leather Harmony', percentage: 4 }
      ],
      textures: [
        { name: 'Super 150s Cashmere-Wool', weight: '280 GSM', weave: 'Fine Twill', description: 'Supple hand, wrinkle-resistant drape with natural luster' },
        { name: 'Breathable Bemberg Cupro', weight: '95 GSM', weave: 'Plain Weave', description: 'Glides over skin, static-free half-lining for back yoke' },
        { name: 'Structured Hair Canvas', weight: '180 GSM', weave: 'Horsehair Blend', description: 'Mandarin collar interior support for sharp razor edge' },
        { name: 'Tonal Rayon Thread', weight: '40 Wt', weave: 'Smooth Filament', description: 'Subtle left-chest geometric embroidery with zero shine' }
      ],
      accessories: [
        { name: 'Venetian Hand-Stitched Leather Loafers', type: 'Footwear', material: 'Burnished Italian Box Calf', stylingNote: 'Sleek slip-on design matches the tapered trouser break.' },
        { name: 'Minimalist Titanium Dress Watch', type: 'Timepiece', material: 'Brushed Titanium & Sapphire', stylingNote: 'Low-profile 7mm casing fits effortlessly under the high sleeve cuff.' },
        { name: 'Sculpted Wood & Brass Shoehorn', type: 'Workshop Care', material: 'Walnut & Solid Brass', stylingNote: 'Essential atelier care tool for bespoke client footwear.' },
        { name: 'Hand-Rolled Silk Pocket Foulard', type: 'Accents', material: '100% Silk Twill', stylingNote: 'Folded flat into breast pocket for a razor-thin contrast line.' }
      ]
    };
  }

  // Default / Women's Couture Corset Gown
  return {
    id: `mb-${style.id}`,
    styleId: style.id,
    title: `${style.title} · Haute Couture Atelier Moodboard`,
    category: style.category,
    editorialTheme: 'Architectural Drama, Coutil Sculpting & Duchesse Luster',
    vibeKeywords: ['Sculpted Hourglass', 'Bordeaux Opulence', 'Fluid Waterfall Train', 'Spiral Steel Boning'],
    heroImage: style.image,
    textureImage: '/src/assets/images/moodboard_textures_swatches_1792949207828.jpg',
    accessoriesImage: '/src/assets/images/moodboard_accessories_bespoke_1792949208142.jpg',
    palette: [
      { name: 'Deep Bordeaux Satin', hex: '#4a0e17', role: 'Main Sculpted Corset & Skirt', percentage: 55 },
      { name: 'Crimson Silk Organza', hex: '#7b1122', role: 'Translucent Shoulder Drape', percentage: 22 },
      { name: 'Rich Burnished Gold', hex: '#d4af37', role: 'Jewelry & Bone Cap Accents', percentage: 11 },
      { name: 'Soft Travertine Cream', hex: '#f3ede2', role: 'Underbust Flattery Line', percentage: 7 },
      { name: 'Nocturne Wine Noir', hex: '#1c0307', role: 'Train Shadow Contour', percentage: 5 }
    ],
    textures: [
      { name: 'Heavy Duchesse Satin', weight: '320 GSM', weave: 'Heavy Filament Satin', description: 'Sculptural body with high-density pearlescent sheen' },
      { name: 'English Cotton Coutil', weight: '280 GSM', weave: 'Herringbone Twill', description: 'Zero stretch along crosswise grain for maximum waist cinch' },
      { name: 'Translucent Silk Organza', weight: '45 GSM', weave: 'Crisp Plain Weave', description: 'Light-as-air asymmetric shoulder drape floating over satin' },
      { name: 'Structural Horsehair Braid', weight: '2-inch Wide', weave: 'Crinkle Mesh', description: 'Hemline reinforcement that produces dynamic architectural ripples' }
    ],
    accessories: [
      { name: 'Pointed Satin Gala Stiletto Pumps', type: 'Footwear', material: 'Duchesse Satin & Leather Sole', stylingNote: 'Elongates posture for the basque waistline drop.' },
      { name: 'Sculpted Brass Minaudière Clutch', type: 'Bag', material: 'Hammered Brass with Velvet Lining', stylingNote: 'Architectural geometric box clutch for evening galas.' },
      { name: 'Pavé Teardrop Crystal Chandelier Earrings', type: 'Jewelry', material: '18k Gold & Crystal', stylingNote: 'Balances the open sweetheart neckline and off-shoulder drape.' },
      { name: 'Heritage Signet Ring', type: 'Jewelry', material: 'Polished Brass & Onyx', stylingNote: 'Refined ring accent to frame hand gestures.' }
    ]
  };
};
