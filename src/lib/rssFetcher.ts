import { TrendFeedItem, GarmentCategory } from '../types';
import { cacheTrends, getCachedTrends } from './offlineStorage';

export interface RssSourceConfig {
  id: string;
  name: string;
  tag: string;
  url: string;
  website: string;
  color: string;
  categoryDefault: GarmentCategory;
}

export const RSS_SOURCES: RssSourceConfig[] = [
  {
    id: 'bellanaija',
    name: 'BellaNaija Style',
    tag: 'BellaNaija Style',
    url: 'https://www.bellanaijastyle.com/feed/',
    website: 'https://bellanaijastyle.com',
    color: '#f43f5e',
    categoryDefault: 'Traditional & Ceremonial',
  },
  {
    id: 'dejiandkola',
    name: 'Deji & Kola',
    tag: 'Deji & Kola',
    url: 'https://dejiandkola.com/blogs/news.atom',
    website: 'https://dejiandkola.com',
    color: '#3b82f6',
    categoryDefault: "Men's Bespoke",
  },
  {
    id: 'voguerunway',
    name: 'Vogue Runway',
    tag: 'Vogue Runway Insights',
    url: 'https://www.vogue.com/feed/category/fashion/rss',
    website: 'https://vogue.com/fashion-shows',
    color: '#f59e0b',
    categoryDefault: "Women's Couture",
  },
];

// Rich curated fallback dataset featuring modern Agbada cuts, structured senator styles, and contemporary Ankara designs
export const CURATED_FALLBACK_TRENDS: TrendFeedItem[] = [
  {
    id: 'trend-agbada-2026',
    title: 'The 2026 Minimalist Agbada: Sculpted Shoulders & Tonal Chevron Inlays',
    category: 'Traditional & Ceremonial',
    subtitle: 'Streamlined 3-piece grand silhouette with anchor darts and hidden chest placket',
    sourceName: 'BellaNaija Style',
    sourceBlogTag: 'BellaNaija Style',
    sourceUrl: 'https://bellanaijastyle.com/minimalist-agbada-craft-2026',
    author: 'Editorial Atelier Desk',
    pubDate: '2026-10-24',
    isLiveFeed: false,
    readTime: '3 min read',
    image: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    accentColor: '#10b981',
    yardageRequired: '7.5 – 8.5 yds',
    recommendedFabric: 'Swiss Cotton Damask, Aso-Oke, or Structured Wool Brocade',
    drapeRating: 9.4,
    complexity: 'Advanced',
    estimatedHours: 28,
    description: 'A contemporary reimagining of the classic Yoruba 3-piece grand attire. Features refined shoulder tucks, a slimmer interior buba silhouette, and tapered trousers, allowing the flowing outer robe to billow with architectural grace without overwhelming the wearer.',
    aiStyleSummary: 'Streamlined ceremonial grand robe shedding excess wing weight through interior shoulder anchor stays, engineered with subtle metallic chevron embroidery for high-society weddings.',
    structuralNotes: {
      lapelStyle: '1.5-inch split mandarin stand collar with geometric chest placket',
      hemCuts: 'Curved winged drape hitting 2 inches above ankle; slim cigarette trouser hem',
      dartsWaist: 'Internal shoulder stay-tape eliminating wing slippage during movement',
      sleeveFinish: 'Open-wing buba with rolled satin edge binding and wrist drape slits',
      neckline: 'Geometric notch neckline with hand-sewn button loops',
    },
    fabricTags: ['Swiss Damask', 'Aso-Oke Accents', 'Structured Linen', 'Raw Silk'],
    highlights: [
      'Tailored inner buba prevents excess bulk under outer wings',
      'Engineered geometric chest placket with reinforced fusible canvas',
      'Shoulder drape anchors prevent constant sliding off shoulders',
      'Slim cigarette-cut Sokoto trousers with drawstring & welt pockets',
    ],
    patternPieces: [
      'Outer Grand Wing (Front & Back fold - 1pc)',
      'Chequered Front Embroidered Placket (1pc)',
      'Inner Buba Bodice (Front & Back - 2pcs)',
      'Buba Straight Cut Sleeves (2pcs)',
      'Tapered Sokoto Trouser Legs (4pcs)',
      'Neckband & Internal Facing Stays (3pcs)',
    ],
    tailoringNotes: 'Pre-shrink damask before embroidery. Stabilize the chest area with 85gsm woven fusible interfacing to hold heavyweight metallic embroidery without puckering.',
  },
  {
    id: 'trend-senator-kaftan',
    title: 'Sculpted Senator Kaftans: Concealed Fasteners & Razor-Creased Shoulders',
    category: "Men's Bespoke",
    subtitle: 'High-armhole ergonomic cut with asymmetric slant buttoning and tonal needlework',
    sourceName: 'Deji & Kola',
    sourceBlogTag: 'Deji & Kola',
    sourceUrl: 'https://dejiandkola.com/blogs/news/bespoke-senator-tailoring-rules',
    author: 'Kolawole Sartorial',
    pubDate: '2026-10-23',
    isLiveFeed: false,
    readTime: '4 min read',
    image: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
    accentColor: '#3b82f6',
    yardageRequired: '4.0 – 4.5 yds',
    recommendedFabric: 'Super 150s Cashmere-Wool Blend, Polish Cotton, or Italian Wool',
    drapeRating: 8.6,
    complexity: 'Intermediate',
    estimatedHours: 16,
    description: 'The definitive modern Senator/Kaftan tunic. Precision-engineered with high armholes for effortless arm movement, a structured 1.25" mandarin collar, and hidden snap placket with tonal geometric thread accent on the upper left chest.',
    aiStyleSummary: 'Razor-sharp tailored tunic featuring disguised stainless press-studs, high armhole ergonomics for unrestricted arm raise, and crisp vertical chest topstitching.',
    structuralNotes: {
      lapelStyle: 'Asymmetric stand collar with concealed magnetic fastener stay',
      hemCuts: 'Deep side vents reinforced with 4-inch herringbone bar tacks',
      dartsWaist: 'Dual curved back contour darts sculpting the spinal silhouette',
      sleeveFinish: 'Two-piece curved tailored sleeve with 0.5-inch French mitered cuff',
      neckline: 'Contoured neck aperture with 1mm edge saddle stitching',
    },
    fabricTags: ['Super 150s Wool', 'Polish Cotton', 'Cashmere Blend', 'Italian Linen'],
    highlights: [
      'Ergonomic two-piece sleeve with 0.5" shoulder slope compensation',
      'Concealed placket with invisible reinforced press fasteners',
      'Side seam vents reinforced with herringbone stay-tape',
      'Tailored flat-front trousers with concealed waistband adjusters',
    ],
    patternPieces: [
      'Front Bodice with asymmetric slant cut (1pc)',
      'Back Bodice with split shoulder yoke (2pcs)',
      'Mandarin Stand Collar with canvas stay (2pcs)',
      'Curved Two-Piece Sleeve (4pcs)',
      'Trouser Front & Back Panels (4pcs)',
      'Side Pocket Bags & Concealed Fly Facing (4pcs)',
    ],
    tailoringNotes: 'Use 0.75" seam allowances on side seams for future client fitting adjustments. Press collar points using tailor clapper for crisp razor edges.',
  },
  {
    id: 'trend-ankara-sartorial',
    title: 'Contemporary Ankara Sartorial: Double-Breasted Wax Blazers & Tailored Pleats',
    category: "Men's Bespoke",
    subtitle: 'Merging authentic Dutch wax vibrance with Savile Row canvas chest structuring',
    sourceName: 'BellaNaija Style',
    sourceBlogTag: 'BellaNaija Style',
    sourceUrl: 'https://bellanaijastyle.com/ankara-blazer-suits-trend-2026',
    author: 'Isio Wanogho',
    pubDate: '2026-10-22',
    isLiveFeed: false,
    readTime: '3 min read',
    image: '/src/assets/images/tailor_notebook_sketch_1792948921650.jpg',
    accentColor: '#d97706',
    yardageRequired: '5.0 – 6.0 yds',
    recommendedFabric: 'Guaranteed Real Dutch Wax, Raw Silk Facing, & Horsehair Canvas',
    drapeRating: 7.8,
    complexity: 'Advanced',
    estimatedHours: 26,
    description: 'An audacious cross-continental blazer silhouette that pairs bold Ankara geometric wax prints with traditional floating horsehair chest canvas, wide peaked lapels, and high-waisted pleated trousers.',
    aiStyleSummary: 'Vibrant Dutch wax print structured with full floating canvas chest pieces, 3.75-inch peaked lapels, and double forward trouser pleats for modern African sartorialists.',
    structuralNotes: {
      lapelStyle: '3.75-inch peak lapel with hand-sewn Milanese boutonnière',
      hemCuts: 'Straight jacket hem with double side vents; 2-inch trouser turn-up cuffs',
      dartsWaist: 'Fish-mouth waist suppression darts aligned to wax motif repeat',
      sleeveFinish: 'Functional 4-button surgeon cuffs with horn buttons',
      neckline: 'Tailored collar felt stand with bias-cut gorge line',
    },
    fabricTags: ['Dutch Wax Cotton', 'Raw Silk', 'Horsehair Canvas', 'Bemberg Cupro'],
    highlights: [
      'Pattern matching across center front button overlap and lapel gorge',
      'Floating horsehair canvas chest piece prevents fabric bubbling',
      'High-rise double forward pleat trousers with side tab buckles',
      'Cupro breathable interior lining optimized for warm climates',
    ],
    patternPieces: [
      'Front Blazer Panels with pattern matching (2pcs)',
      'Side Body & Back Panels (3pcs)',
      'Upper & Under Collar (2pcs)',
      'Peak Lapel Facing & Canvas Interfacing (4pcs)',
      'Two-Piece Sleeve (4pcs)',
      'High-Rise Pleated Trouser Panels (4pcs)',
    ],
    tailoringNotes: 'Conduct pattern placement layout before cutting to ensure central motifs balance across the chest placket. Avoid synthetic fusibles on pure wax cotton.',
  },
  {
    id: 'trend-couture-corset',
    title: 'Structural Corsetry & Fluid Draping: West African Haute Couture Bridal',
    category: "Women's Couture",
    subtitle: '14-point spiral steel internal boning paired with asymmetric waterfall hip drape',
    sourceName: 'Vogue Runway',
    sourceBlogTag: 'Vogue Runway Insights',
    sourceUrl: 'https://vogue.com/fashion-shows/couture-corsetry-african-bridal',
    author: 'Nicole Phelps',
    pubDate: '2026-10-21',
    isLiveFeed: false,
    readTime: '5 min read',
    image: '/src/assets/images/trending_corset_gown_1792948464647.jpg',
    accentColor: '#e11d48',
    yardageRequired: '6.0 – 7.0 yds',
    recommendedFabric: 'Heavy Duchesse Satin, Silk Organza, & Cotton Coutil Lining',
    drapeRating: 9.8,
    complexity: 'Master Tailor',
    estimatedHours: 38,
    description: 'An architectural evening masterpiece featuring a sculpted sweetheart neckline, internal coutil waist cincher, and an asymmetric sculpted drape that falls from the right hip into an editorial cascading waterfall train.',
    aiStyleSummary: 'Dual-layered architectural gown combining a waist-reducing 14-bone coutil corset foundation with dramatic silk organza cascading hip trails.',
    structuralNotes: {
      lapelStyle: 'Off-shoulder sweetheart neckline with contoured bustier cups',
      hemCuts: 'Floor-length mermaid hem stabilized with 3-inch horsehair braid',
      dartsWaist: 'Deep Basque waistline drop with 2-inch internal cinching waist stay',
      sleeveFinish: 'Detachable pleated silk organza off-shoulder bicep cuffs',
      neckline: 'Plunge sweetheart neckline with invisible mesh modesty insert',
    },
    fabricTags: ['Duchess Satin', 'Silk Organza', 'Cotton Coutil', 'Bridal Crinoline'],
    highlights: [
      '14 internal bone casings utilizing 6mm spiral steel for flexible support',
      'Underwired foam laminate cups contoured to custom apex measurements',
      'Deep Basque waist drop creating an elongated hourglass contour',
      'Horsehair braid hem reinforcement for structural skirt flare',
    ],
    patternPieces: [
      'Corset Bodice Panels: Center Front, Side Front, Side Back, Center Back (8pcs)',
      'Upper & Lower Bust Cups (4pcs)',
      'Interior Coutil Waist Stay Belt (1pc)',
      'Asymmetric Waterfall Hip Cascade Drapes (3pcs)',
      'Mermaid Skirt Quarter Panels (4pcs)',
      'Integrated Horsehair Braid Hem Binding (1pc)',
    ],
    tailoringNotes: 'Ensure coutil grainline runs strictly horizontal around the waistline to eliminate any stretch. Always conduct a muslin toile fitting prior to cutting final satin.',
  },
  {
    id: 'trend-linen-safari',
    title: 'Atelier Resort: Textured Slub Linen Native Sets for Tropical Elegance',
    category: 'Contemporary Minimal',
    subtitle: 'Breathable heavyweight linen with convertible camp collar and relaxed drawstring hem',
    sourceName: 'Deji & Kola',
    sourceBlogTag: 'Deji & Kola',
    sourceUrl: 'https://dejiandkola.com/blogs/news/resort-linen-native-wear',
    author: 'Deji & Kola Studio',
    pubDate: '2026-10-20',
    isLiveFeed: false,
    readTime: '3 min read',
    image: '/src/assets/images/moodboard_textures_swatches_1792949207828.jpg',
    accentColor: '#ca8a04',
    yardageRequired: '4.5 – 5.0 yds',
    recommendedFabric: 'Pure Irish Slub Linen, Textured Cotton Slub, or Bamboo Silk',
    drapeRating: 7.2,
    complexity: 'Beginner',
    estimatedHours: 12,
    description: 'Engineered for tropical daytime wear and destination celebrations. Heavyweight slub linen is tailored with relaxed shoulder drop, chest patch bellows pockets, and easy-wearing drawstring ankle trousers.',
    aiStyleSummary: 'Effortless luxury resort wear blending traditional native proportion with Italian camp collar casualness in pure breathable slub linen.',
    structuralNotes: {
      lapelStyle: 'Convertible one-piece Cuban camp collar with loop fastening',
      hemCuts: 'Straight boxy tunic hem with 2-inch side splits and topstitch finish',
      dartsWaist: 'Relaxed un-darted torso with internal herringbone drawstring',
      sleeveFinish: 'Short sleeve with 1.25-inch turnback cuff and bar-tack hold',
      neckline: 'Open V-revere neckline with topstitched facing',
    },
    fabricTags: ['Structured Linen', 'Bamboo Silk', 'Raw Silk Slub', 'Organic Cotton'],
    highlights: [
      'Pre-washed pure linen minimizing post-craft shrinkage',
      'Dual chest safari patch pockets with inverted center pleats',
      'Clean French seam finishes throughout interior garment',
      'Relaxed cropped trousers with elasticated back and flat front',
    ],
    patternPieces: [
      'Front Shirt Body with integrated facing (2pcs)',
      'Back Shirt Body with center pleat yoke (2pcs)',
      'Camp Revere Collar (2pcs)',
      'Bellows Chest Pockets with Flaps (4pcs)',
      'Short Sleeves (2pcs)',
      'Relaxed Trouser Legs (4pcs)',
    ],
    tailoringNotes: 'Linen ravels rapidly; bind all raw seam allowances with lightweight cotton bias tape or use reinforced 5mm French seams.',
  },
  {
    id: 'trend-danshiki-pleats',
    title: 'The Evolution of Danshiki: Metallic Micro-Pleated Wings & Tonal Embroidery',
    category: 'Traditional & Ceremonial',
    subtitle: 'Lightweight ceremonial tunic leveraging heat-set micro-pleats along side panels',
    sourceName: 'Vogue Runway',
    sourceBlogTag: 'Vogue Runway Insights',
    sourceUrl: 'https://vogue.com/fashion-shows/danshiki-micro-pleats-afro-futurism',
    author: 'Chioma Nnadi',
    pubDate: '2026-10-19',
    isLiveFeed: false,
    readTime: '4 min read',
    image: '/src/assets/images/trending_modern_agbada_1792948463357.jpg',
    accentColor: '#8b5cf6',
    yardageRequired: '5.0 – 6.0 yds',
    recommendedFabric: 'Metallic Lamé, Silk Brocade, & Featherweight Cotton Voile',
    drapeRating: 9.1,
    complexity: 'Advanced',
    estimatedHours: 22,
    description: 'A futuristic dialogue between ancestral Danshiki geometry and micro-accordion pleating. The side wings float weightlessly during stride, capturing ambient light across metallic textile threads.',
    aiStyleSummary: 'Neo-ceremonial Danshiki incorporating heat-pressed micro-pleating into side panels for kinetic garment flare while maintaining a structured center chest spine.',
    structuralNotes: {
      lapelStyle: 'Keyhole stand collar with antique bronze hook and eye closure',
      hemCuts: 'Asymmetric handkerchief side hem with laser-sealed borders',
      dartsWaist: 'Shoulder anchor darts transferring wing weight to collar bone',
      sleeveFinish: 'Flutter wing sleeve ending gracefully at the forearm mid-point',
      neckline: 'Keyhole slit reinforced with silk cord piping',
    },
    fabricTags: ['Metallic Lamé', 'Silk Brocade', 'Cotton Voile', 'Micro-Pleat Chiffon'],
    highlights: [
      'Heat-set permanent micro-pleating ensures pleats survive gentle washing',
      'Central spine stays anchored flat against chest during rapid movements',
      'Featherweight construction ideal for high-energy wedding receptions',
      'Complementary slim cigarette trousers in matching solid tonal silk',
    ],
    patternPieces: [
      'Center Front Embroidered Panel (1pc)',
      'Pleated Side Wings (4pcs)',
      'Center Back Body (1pc)',
      'Shoulder Yoke Support (2pcs)',
      'Slim Fit Trousers (4pcs)',
    ],
    tailoringNotes: 'Never iron directly over heat-set micro-pleats. Use vertical steam wand only. Stabilize central embroidery panel with tear-away backing.',
  },
];

// Helper to sanitize HTML tags from RSS item descriptions
function cleanHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract image URL from RSS enclosure, media, or HTML description
function extractImageUrl(item: any): string {
  if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) {
    return item.thumbnail;
  }
  if (item.enclosure && item.enclosure.link) {
    return item.enclosure.link;
  }
  if (item.description && typeof item.description === 'string') {
    const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }
  // Fallback to high quality atelier image
  return '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg';
}

// Synthesize tailoring notes, fabric tags, and AI style summary from article metadata
function analyzeRssArticle(title: string, content: string, source: RssSourceConfig): {
  category: GarmentCategory;
  aiStyleSummary: string;
  structuralNotes: TrendFeedItem['structuralNotes'];
  fabricTags: string[];
  recommendedFabric: string;
  yardageRequired: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Tailor';
} {
  const combined = (title + ' ' + content).toLowerCase();

  let category: GarmentCategory = source.categoryDefault;
  if (combined.includes('agbada') || combined.includes('aso-oke') || combined.includes('ceremonial') || combined.includes('wedding')) {
    category = 'Traditional & Ceremonial';
  } else if (combined.includes('kaftan') || combined.includes('senator') || combined.includes('suit') || combined.includes('blazer') || combined.includes('men')) {
    category = "Men's Bespoke";
  } else if (combined.includes('corset') || combined.includes('gown') || combined.includes('couture') || combined.includes('dress') || combined.includes('women')) {
    category = "Women's Couture";
  } else if (combined.includes('linen') || combined.includes('minimal') || combined.includes('casual') || combined.includes('resort')) {
    category = 'Contemporary Minimal';
  }

  // Detect fabric tags
  const tags: string[] = [];
  if (combined.includes('satin') || combined.includes('duchesse')) tags.push('Duchess Satin');
  if (combined.includes('silk') || combined.includes('organza')) tags.push('Raw Silk');
  if (combined.includes('linen')) tags.push('Structured Linen');
  if (combined.includes('damask')) tags.push('Swiss Damask');
  if (combined.includes('ankara') || combined.includes('wax')) tags.push('Dutch Wax Cotton');
  if (combined.includes('wool') || combined.includes('cashmere')) tags.push('Super 150s Wool');
  if (combined.includes('cotton')) tags.push('Polish Cotton');
  if (combined.includes('aso-oke') || combined.includes('brocade')) tags.push('Aso-Oke Accents');

  if (tags.length === 0) {
    tags.push('Structured Linen', 'Polish Cotton', 'Raw Silk');
  }

  // Tailoring structural specifications
  const structuralNotes: TrendFeedItem['structuralNotes'] = {
    lapelStyle: category === "Men's Bespoke" 
      ? '3.5-inch peak lapel or asymmetric 1.25" mandarin collar' 
      : category === "Traditional & Ceremonial"
      ? 'Geometric embroidered chest placket with reinforced stay-tape'
      : 'Sculpted basque sweetheart or cowl neckline with boned stay',
    hemCuts: category === 'Traditional & Ceremonial'
      ? 'Floor sweeping winged drape with 2-inch rolled hem allowance'
      : category === "Men's Bespoke"
      ? 'Straight tunic hem with 4-inch reinforced side seam vents'
      : 'Mermaid flare reinforced with 3-inch horsehair braid support',
    dartsWaist: 'Contoured spinal suppression darts for tailored body posture',
    sleeveFinish: category === 'Traditional & Ceremonial'
      ? 'Wide draped wing sleeves with hand-finished hemline'
      : 'Two-piece tailored sleeve with 0.5-inch mitered cuff',
    neckline: 'Reinforced neckline facing with 1mm edge stitching',
  };

  const aiStyleSummary = `High-impact ${category.toLowerCase()} design spotlighted on ${source.name}. Features architectural cuts tailored in ${tags.slice(0, 2).join(' & ')} with sharp seam discipline.`;

  return {
    category,
    aiStyleSummary,
    structuralNotes,
    fabricTags: tags.slice(0, 4),
    recommendedFabric: tags.join(', ') + ' with breathable cotton lining',
    yardageRequired: category === 'Traditional & Ceremonial' ? '7.0 – 8.5 yds' : '4.0 – 5.5 yds',
    complexity: category === 'Women\'s Couture' ? 'Master Tailor' : category === 'Traditional & Ceremonial' ? 'Advanced' : 'Intermediate',
  };
}

export interface FetchFeedResult {
  items: TrendFeedItem[];
  fromCache: boolean;
  lastUpdated: string;
  error?: string;
  activeSources: string[];
}

/**
 * Fetches dynamic live RSS feeds via RSS2JSON proxy with full CORS handling.
 * Automatically saves new/live items to the local IndexedDB/localStorage offline cache.
 * Returns cached or fallback data when offline or upon fetch failure.
 */
export async function fetchLiveRssFeeds(forceRefresh = false): Promise<FetchFeedResult> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. If completely offline, immediately load from local cache or fallback
  if (!isOnline) {
    try {
      const cached = await getCachedTrends();
      if (cached && cached.length > 0) {
        return {
          items: cached as TrendFeedItem[],
          fromCache: true,
          lastUpdated: 'Loaded from local offline cache',
          activeSources: RSS_SOURCES.map(s => s.name),
        };
      }
    } catch (e) {
      console.warn('Offline cache read error, using curated trends', e);
    }

    return {
      items: CURATED_FALLBACK_TRENDS,
      fromCache: true,
      lastUpdated: 'Offline Mode (Curated Atelier Dataset)',
      activeSources: RSS_SOURCES.map(s => s.name),
    };
  }

  // 2. Online: Attempt to fetch live RSS feeds via RSS-to-JSON proxy
  const liveItems: TrendFeedItem[] = [];
  const successfulSources: string[] = [];

  for (const source of RSS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout per feed

      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          successfulSources.push(source.name);

          // Process top 3 articles from each feed
          const sourceArticles = data.items.slice(0, 3).map((item: any, idx: number) => {
            const cleanTitle = cleanHtml(item.title);
            const cleanDesc = cleanHtml(item.description || item.content || '');
            const imageUrl = extractImageUrl(item);
            const analysis = analyzeRssArticle(cleanTitle, cleanDesc, source);

            const trendItem: TrendFeedItem = {
              id: `rss-${source.id}-${idx}-${Date.now()}`,
              title: cleanTitle,
              category: analysis.category,
              subtitle: cleanDesc.slice(0, 110) + '...',
              sourceName: source.name,
              sourceBlogTag: source.tag,
              sourceUrl: item.link || source.website,
              author: item.author || source.name,
              pubDate: item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
              isLiveFeed: true,
              readTime: '3 min read',
              image: imageUrl,
              accentColor: source.color,
              yardageRequired: analysis.yardageRequired,
              recommendedFabric: analysis.recommendedFabric,
              drapeRating: 8.8,
              complexity: analysis.complexity,
              estimatedHours: analysis.category === "Traditional & Ceremonial" ? 24 : 18,
              description: cleanDesc.slice(0, 280) + '...',
              aiStyleSummary: analysis.aiStyleSummary,
              structuralNotes: analysis.structuralNotes,
              fabricTags: analysis.fabricTags,
              highlights: [
                `Spotted on ${source.name} runway insights`,
                `Optimized for ${analysis.fabricTags.slice(0, 2).join(' and ')}`,
                `${analysis.structuralNotes.lapelStyle}`,
                `${analysis.structuralNotes.hemCuts}`,
              ],
              patternPieces: [
                'Front Bodice Panels (2pcs)',
                'Back Bodice with contour darts (2pcs)',
                'Engineered Collar / Neckband (2pcs)',
                'Curved Sleeve Construction (4pcs)',
                'Trouser / Skirt Assemblies (4pcs)',
              ],
              tailoringNotes: `Verify fabric weight before pattern cutting. ${analysis.structuralNotes.dartsWaist}. Press all critical seams with tailor clapper.`,
            };

            return trendItem;
          });

          liveItems.push(...sourceArticles);
        }
      }
    } catch (feedErr) {
      console.info(`[StitchAI RSS] Live fetch bypassed for ${source.name}, using curated backup`, feedErr);
    }
  }

  // Merge live items with curated items (keeping unique titles, live items first)
  const combinedItems: TrendFeedItem[] = [...liveItems];
  const existingTitles = new Set(liveItems.map(i => i.title.toLowerCase().trim()));

  for (const fallback of CURATED_FALLBACK_TRENDS) {
    if (!existingTitles.has(fallback.title.toLowerCase().trim())) {
      combinedItems.push(fallback);
      existingTitles.add(fallback.title.toLowerCase().trim());
    }
  }

  // 3. Cache the enriched trend items into local IndexedDB / localStorage for offline access
  try {
    await cacheTrends(combinedItems);
  } catch (err) {
    console.warn('Failed to cache merged trends to offline storage', err);
  }

  return {
    items: combinedItems,
    fromCache: liveItems.length === 0,
    lastUpdated: liveItems.length > 0 
      ? `Live RSS updated at ${timestamp}` 
      : `Curated Archive (Updated ${timestamp})`,
    activeSources: successfulSources.length > 0 ? successfulSources : RSS_SOURCES.map(s => s.name),
  };
}
