import React, { useState } from 'react';
import { 
  FolderGit2, Plus, Search, Calendar, User, 
  Scissors, CheckCircle2, AlertCircle, ChevronRight, 
  Ruler, Trash2, Edit3, X, FileText, Cloud, Tag, 
  LayoutGrid, List, Sparkles, Filter 
} from 'lucide-react';
import { SketchProject, ProjectStatus, GarmentCategory } from '../types';
import { useAuth } from '../context/AuthContext';

interface SketchVaultProps {
  projects: SketchProject[];
  onAddProject: (project: SketchProject) => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onDeleteProject: (id: string) => void;
  onOpenSnapModal: () => void;
  onOpenAuth?: () => void;
  isFirestoreSyncing?: boolean;
}

const GARMENT_CATEGORIES = [
  'All Categories',
  "Men's Native",
  "Women's Wear",
  'Casual',
  'Traditional & Ceremonial',
  "Men's Bespoke"
];

const PRESET_TAGS = [
  "Men's Native", "Women's Wear", "Casual", "Wedding", 
  "Agbada", "Kaftan", "Corset", "Gold Embroidery", "Linen"
];

export const SketchVault: React.FC<SketchVaultProps> = ({
  projects,
  onAddProject,
  onUpdateStatus,
  onDeleteProject,
  onOpenSnapModal,
  onOpenAuth,
  isFirestoreSyncing = false,
}) => {
  const { user, atelierName } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMeasurementView, setActiveMeasurementView] = useState<SketchProject | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState<string>("Men's Native");
  const [newFabric, setNewFabric] = useState('Super 150s Wool');
  const [newYardage, setNewYardage] = useState('4.5 yds');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(["Men's Native"]);
  const [customTagInput, setCustomTagInput] = useState('');

  const statuses: (ProjectStatus | 'All')[] = [
    'All', 'Pattern Making', 'Cutting', 'In Fitting', 'Ready for Pickup', 'Draft'
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags(prev => [...prev, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesTag = !activeTagFilter || (p.tags && p.tags.includes(activeTagFilter));
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(query) ||
      p.clientName.toLowerCase().includes(query) ||
      p.fabricType.toLowerCase().includes(query) ||
      (p.variationType && p.variationType.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

    return matchesStatus && matchesCategory && matchesTag && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;

    const newProject: SketchProject = {
      id: `proj-${Date.now()}`,
      userId: user?.uid,
      title: newTitle.trim(),
      clientName: newClient.trim(),
      category: newCategory,
      dateCreated: new Date().toISOString().split('T')[0],
      dueDate: newDueDate || '2026-11-25',
      status: 'Pattern Making',
      fabricType: newFabric,
      yardage: newYardage,
      thumbnail: '/src/assets/images/trending_fitted_kaftan_1792948464218.jpg',
      notes: newNotes,
      tags: selectedTags.length > 0 ? selectedTags : [newCategory],
      measurements: {
        chestBust: 42,
        waist: 34,
        hips: 42,
        shoulderWidth: 18.5,
        sleeveLength: 25.5,
        fullLength: 44,
        unit: 'inches'
      }
    };

    onAddProject(newProject);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewClient('');
    setNewNotes('');
    setSelectedTags(["Men's Native"]);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Ready for Pickup': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'In Fitting': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Cutting': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Pattern Making': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Design Vault & Archive</span>
            {user ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 ml-2 normal-case flex items-center gap-1">
                <Cloud className="w-3 h-3" />
                Firestore Synced
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 ml-2 normal-case">
                Guest Workspace
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            {user ? `${atelierName}'s Design Vault` : 'Design Vault Gallery'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Private archive of snapped client sketches, AI variations, garment category tags, and bespoke fitting statuses.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-0.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'gallery' ? 'bg-amber-400 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Gallery Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-400 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Design Entry</span>
          </button>
        </div>
      </div>

      {/* Guest Workspace Callout (if logged out) */}
      {!user && onOpenAuth && (
        <div className="p-3.5 bg-zinc-950 border border-amber-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-zinc-300">
              Sign in to automatically sync your sketches and AI variations across workshop tablets and phones with <strong>Cloud Firestore</strong>.
            </span>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold rounded-lg shrink-0 transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="space-y-3">
        
        {/* Row 1: Search & Statuses */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                  selectedStatus === status
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, client, fabric, tag..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Row 2: Garment Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-zinc-800/60">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" />
            Category:
          </span>
          {GARMENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-zinc-200 text-zinc-950 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}

          {activeTagFilter && (
            <button
              onClick={() => setActiveTagFilter(null)}
              className="px-2 py-0.5 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg flex items-center gap-1"
            >
              <span>Tag: {activeTagFilter}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* GALLERY GRID VIEW */}
      {viewMode === 'gallery' && (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 px-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl">
              <FolderGit2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">No design sketches found</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">Try clearing filters or snap a new notebook sketch.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 text-xs font-medium text-zinc-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Create New Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    {/* Sketch Visual Banner */}
                    <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      
                      {/* Category Badge on photo */}
                      <div className="absolute top-3 left-3 text-[11px] font-semibold text-white bg-zinc-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                        {project.category}
                      </div>

                      {/* Status Dropdown on photo */}
                      <div className="absolute top-3 right-3">
                        <select
                          value={project.status}
                          onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border appearance-none cursor-pointer focus:outline-none backdrop-blur-md ${getStatusColor(project.status)}`}
                        >
                          <option value="Draft" className="bg-zinc-900 text-zinc-300">Draft</option>
                          <option value="Pattern Making" className="bg-zinc-900 text-zinc-300">Pattern Making</option>
                          <option value="Cutting" className="bg-zinc-900 text-zinc-300">Cutting</option>
                          <option value="In Fitting" className="bg-zinc-900 text-zinc-300">In Fitting</option>
                          <option value="Ready for Pickup" className="bg-zinc-900 text-zinc-300">Ready for Pickup</option>
                        </select>
                      </div>

                      {/* Bottom Image Strip: Client Name & Due Date */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                        <span className="font-semibold text-white flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{project.clientName}</span>
                        </span>
                        <span className="text-[11px] text-zinc-400 shrink-0">Due {project.dueDate.slice(5)}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-editorial">
                          {project.title}
                        </h3>
                        {project.variationType && (
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-block mt-1">
                            {project.variationType} Variation
                          </span>
                        )}
                      </div>

                      {/* Tags Strip */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {(project.tags || [project.category]).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setActiveTagFilter(tag === activeTagFilter ? null : tag)}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                              activeTagFilter === tag
                                ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400'
                                : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>

                      {/* Fabric & Yardage */}
                      <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Fabric:</span>
                          <span className="text-zinc-200 truncate block font-medium">{project.fabricType}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Yardage:</span>
                          <span className="text-amber-400 font-semibold block">{project.yardage}</span>
                        </div>
                      </div>

                      {/* Tailor Notes */}
                      {project.notes && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          <strong className="text-zinc-300">Notes:</strong> {project.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-4 sm:px-5 py-3 bg-zinc-950/60 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {project.measurements && (
                        <button
                          onClick={() => setActiveMeasurementView(project)}
                          className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors flex items-center gap-1"
                          title="View Tape Measurements"
                        >
                          <Ruler className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tape Card</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                      title="Delete design entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* COMPACT LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Garment & Client</th>
                  <th className="py-3 px-4">Category & Tags</th>
                  <th className="py-3 px-4">Fabric</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-800"
                        />
                        <div>
                          <div className="font-semibold text-white">{project.title}</div>
                          <div className="text-[11px] text-zinc-400">{project.clientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="text-zinc-200 block font-medium">{project.category}</span>
                        <div className="flex flex-wrap gap-1">
                          {(project.tags || []).slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] bg-zinc-950 px-1.5 py-0.2 rounded text-zinc-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      <div>{project.fabricType}</div>
                      <div className="text-[11px] text-amber-400">{project.yardage}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={project.status}
                        onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(project.status)}`}
                      >
                        <option value="Draft" className="bg-zinc-900 text-zinc-300">Draft</option>
                        <option value="Pattern Making" className="bg-zinc-900 text-zinc-300">Pattern Making</option>
                        <option value="Cutting" className="bg-zinc-900 text-zinc-300">Cutting</option>
                        <option value="In Fitting" className="bg-zinc-900 text-zinc-300">In Fitting</option>
                        <option value="Ready for Pickup" className="bg-zinc-900 text-zinc-300">Ready for Pickup</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-mono">
                      {project.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {project.measurements && (
                          <button
                            onClick={() => setActiveMeasurementView(project)}
                            className="p-1.5 text-zinc-400 hover:text-amber-400 rounded"
                            title="Tape Card"
                          >
                            <Ruler className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Design Modal with Categories & Tags */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <h3 className="text-base font-bold text-white font-editorial">Save New Design to Vault</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="text-zinc-400 block mb-1 font-medium">Garment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Asymmetric Senator Kaftan & Trousers"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-medium">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="e.g. Chief Adeleke"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-medium">Garment Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      if (!selectedTags.includes(e.target.value)) {
                        setSelectedTags(prev => [...prev, e.target.value]);
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Men's Native">Men's Native</option>
                    <option value="Women's Wear">Women's Wear</option>
                    <option value="Casual">Casual</option>
                    <option value="Traditional & Ceremonial">Traditional & Ceremonial</option>
                    <option value="Men's Bespoke">Men's Bespoke</option>
                  </select>
                </div>
              </div>

              {/* Tagging System */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-medium">Tags (Click to toggle):</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleTag(t)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                        selectedTags.includes(t)
                          ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                      }`}
                    >
                      +{t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="Add custom tag (e.g. #SilkCrepe)..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white text-[11px] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-medium">Fabric Type</label>
                  <input
                    type="text"
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    placeholder="e.g. Polish Cotton"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-medium">Target Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-medium">Workshop Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Fitting preferences, seam finishes, embroidery placement..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow"
                >
                  Save to Design Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Measurements Drawer */}
      {activeMeasurementView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <div className="text-[11px] text-amber-400 font-semibold uppercase">Client Tape Record</div>
                <h3 className="text-base font-bold text-white font-editorial">{activeMeasurementView.clientName}</h3>
              </div>
              <button
                onClick={() => setActiveMeasurementView(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeMeasurementView.measurements ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block">Chest/Bust:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.chestBust}"
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Waist:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.waist}"
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Full Hips:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.hips}"
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Shoulder Width:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.shoulderWidth}"
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Sleeve Length:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.sleeveLength}"
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Garment Length:</span>
                    <span className="font-mono text-zinc-200 text-sm font-semibold">
                      {activeMeasurementView.measurements.fullLength}"
                    </span>
                  </div>
                </div>

                {activeMeasurementView.measurements.notes && (
                  <div className="text-[11px] text-zinc-400 p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800">
                    <strong className="text-amber-400">Fitting Note:</strong> {activeMeasurementView.measurements.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-zinc-400 text-xs">
                No measurements recorded yet for this client.
              </div>
            )}

            <button
              onClick={() => setActiveMeasurementView(null)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
