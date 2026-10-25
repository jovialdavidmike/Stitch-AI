import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { TabType, SketchProject, GarmentStyle, ProjectStatus, ClientMeasurements, TrendFeedItem } from './types';
import { INITIAL_VAULT_PROJECTS, TRENDING_STYLES } from './data/mockData';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from './lib/firebase';
import { useAuth } from './context/AuthContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import { 
  cacheVaultProjects, 
  getCachedVaultProjects, 
  cacheTrends, 
  queueOfflineMutation, 
  getQueuedMutations, 
  clearQueuedMutations 
} from './lib/offlineStorage';
import { registerServiceWorker } from './registerSW';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { TrendFeed } from './components/TrendFeed';
import { SketchVault } from './components/SketchVault';
import { FabricGuide } from './components/FabricGuide';
import { SnapToDesignModal } from './components/SnapToDesignModal';
import { SnapExploreModal } from './components/SnapExploreModal';
import { MeasurementModal } from './components/MeasurementModal';
import { AuthModal } from './components/AuthModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { OfflineBanner } from './components/OfflineBanner';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { Check, Cloud } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [projects, setProjects] = useState<SketchProject[]>(INITIAL_VAULT_PROJECTS);
  
  // PWA Offline and Install hooks
  const { isOnline, isSimulatedOffline, toggleSimulateOffline } = useOnlineStatus();
  const { isInstallable, install } = usePWAInstall();
  const prevOnlineRef = useRef(isOnline);

  // Modals state
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFirebaseGuideOpen, setIsFirebaseGuideOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [snapPresetStyle, setSnapPresetStyle] = useState<{ image?: string; title?: string }>({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Service Worker and local cache initialization on boot
  useEffect(() => {
    testFirestoreConnection();
    registerServiceWorker({
      onUpdate: () => showToast('New atelier update available! Refresh to update.'),
      onSuccess: () => console.log('StitchAI offline cache ready.'),
    });

    // Warm up local cache with trends and cached vault
    cacheTrends(TRENDING_STYLES);
    getCachedVaultProjects().then((cached) => {
      if (cached && cached.length > 0) {
        setProjects(cached);
      }
    });
  }, []);

  // Flush queued offline mutations when reconnecting online
  useEffect(() => {
    const handleReconnection = async () => {
      if (!prevOnlineRef.current && isOnline && user) {
        try {
          const pending = await getQueuedMutations();
          if (pending && pending.length > 0) {
            for (const mutation of pending) {
              const projectDocRef = doc(db, 'users', user.uid, 'sketches', mutation.docId);
              if (mutation.type === 'create') {
                await setDoc(projectDocRef, mutation.data);
              } else if (mutation.type === 'update') {
                await updateDoc(projectDocRef, mutation.data);
              } else if (mutation.type === 'delete') {
                await deleteDoc(projectDocRef);
              }
            }
            await clearQueuedMutations();
            showToast(`Reconnected: Synced ${pending.length} pending workshop change(s) to Firestore!`);
          }
        } catch (err) {
          console.warn('Reconnection sync error:', err);
        }
      }
      prevOnlineRef.current = isOnline;
    };

    handleReconnection();
  }, [isOnline, user]);

  // REAL-TIME FIRESTORE SYNCHRONIZATION (when online and authenticated)
  useEffect(() => {
    if (!user || !isOnline) {
      // In guest or offline mode, keep locally cached projects
      return;
    }

    const sketchesCollectionPath = `users/${user.uid}/sketches`;
    const colRef = collection(db, 'users', user.uid, 'sketches');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteProjects: SketchProject[] = [];
          snapshot.forEach((docSnap) => {
            remoteProjects.push({
              id: docSnap.id,
              ...docSnap.data()
            } as SketchProject);
          });
          // Sort newest first
          remoteProjects.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
          setProjects(remoteProjects);
          // Persist to IndexedDB/local storage cache for offline availability
          cacheVaultProjects(remoteProjects);
        } else {
          // If brand new user account, seed initial starter designs to Firestore
          INITIAL_VAULT_PROJECTS.forEach(async (p) => {
            try {
              const docRef = doc(db, 'users', user.uid, 'sketches', p.id);
              await setDoc(docRef, {
                ...p,
                userId: user.uid,
                tags: p.tags || [p.category]
              });
            } catch (err) {
              console.warn('Seeding note:', err);
            }
          });
          cacheVaultProjects(INITIAL_VAULT_PROJECTS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, sketchesCollectionPath);
      }
    );

    return () => unsubscribe();
  }, [user, isOnline]);

  const handleOpenSnap = (style?: GarmentStyle) => {
    if (style) {
      setSnapPresetStyle({ image: style.image, title: style.title });
    } else {
      setSnapPresetStyle({});
    }
    setIsSnapModalOpen(true);
  };

  // Add project with offline caching & queuing support
  const handleAddProject = async (newProject: SketchProject) => {
    const updatedProjects = [newProject, ...projects];
    // Optimistic UI update
    setProjects(updatedProjects);
    // Persist to local IndexedDB/localStorage cache immediately
    await cacheVaultProjects(updatedProjects);

    if (user) {
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', user.uid, 'sketches', newProject.id);
          await setDoc(docRef, {
            ...newProject,
            userId: user.uid,
            tags: newProject.tags || [newProject.category]
          });
          showToast(`"${newProject.title}" synced to Cloud Firestore!`);
          return;
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/sketches/${newProject.id}`);
        }
      } else {
        // Offline: queue mutation for sync upon reconnection
        await queueOfflineMutation({
          id: `mut-${Date.now()}`,
          type: 'create',
          collection: 'sketches',
          docId: newProject.id,
          data: {
            ...newProject,
            userId: user.uid,
            tags: newProject.tags || [newProject.category]
          },
          timestamp: Date.now()
        });
        showToast(`"${newProject.title}" cached offline (Queued for Firestore sync).`);
        return;
      }
    }

    showToast(`"${newProject.title}" saved to local Design Vault.`);
  };

  const handleSaveToVaultFromSnap = async (partialProject: Partial<SketchProject>) => {
    const fullProject: SketchProject = {
      id: `proj-${Date.now()}`,
      userId: user?.uid,
      title: partialProject.title || 'Deconstructed Garment',
      clientName: partialProject.clientName || 'Walk-in Client',
      category: partialProject.category || "Men's Native",
      dateCreated: new Date().toISOString().split('T')[0],
      dueDate: '2026-11-20',
      status: 'Pattern Making',
      fabricType: partialProject.fabricType || 'Swiss Damask',
      yardage: partialProject.yardage || '6.0 yds',
      thumbnail: partialProject.thumbnail || '/src/assets/images/tailor_notebook_sketch_1792948921650.jpg',
      notes: partialProject.notes || 'Deconstructed in StitchAI Studio.',
      tags: [partialProject.category || "Men's Native", partialProject.variationType || 'AI Variation'].filter(Boolean),
      variationType: partialProject.variationType,
      deconstructedAnatomy: partialProject.deconstructedAnatomy,
      measurements: {
        chestBust: 42,
        waist: 34,
        hips: 43,
        shoulderWidth: 18.5,
        sleeveLength: 25.5,
        fullLength: 50,
        unit: 'inches'
      }
    };

    await handleAddProject(fullProject);
  };

  const handleUpdateProjectStatus = async (id: string, status: ProjectStatus) => {
    const updatedProjects = projects.map(p => (p.id === id ? { ...p, status } : p));
    setProjects(updatedProjects);
    await cacheVaultProjects(updatedProjects);

    if (user) {
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', user.uid, 'sketches', id);
          await updateDoc(docRef, { status });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/sketches/${id}`);
        }
      } else {
        await queueOfflineMutation({
          id: `mut-${Date.now()}`,
          type: 'update',
          collection: 'sketches',
          docId: id,
          data: { status },
          timestamp: Date.now()
        });
        showToast(`Status updated to ${status} (Cached offline).`);
        return;
      }
    }

    showToast(`Status updated to ${status}.`);
  };

  const handleDeleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    await cacheVaultProjects(updatedProjects);

    if (user) {
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', user.uid, 'sketches', id);
          await deleteDoc(docRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/sketches/${id}`);
        }
      } else {
        await queueOfflineMutation({
          id: `mut-${Date.now()}`,
          type: 'delete',
          collection: 'sketches',
          docId: id,
          timestamp: Date.now()
        });
        showToast('Design removed (Queued deletion for reconnect).');
        return;
      }
    }

    showToast('Design removed from vault.');
  };

  const handleSaveMeasurements = (measurements: ClientMeasurements, clientName: string) => {
    showToast(`Tape recorded for ${clientName}. Ready for pattern cutting.`);
  };

  const handleApplyTrend = (item: TrendFeedItem, destination: 'workspace' | 'vault') => {
    if (destination === 'workspace') {
      setSnapPresetStyle({ image: item.image, title: item.title });
      setIsSnapModalOpen(true);
      showToast(`Transferred "${item.title}" into AI Studio workspace.`);
    } else {
      const newProj: SketchProject = {
        id: `proj-${Date.now()}`,
        userId: user?.uid,
        title: item.title,
        clientName: 'Atelier Trend Commission',
        category: item.category,
        dateCreated: new Date().toISOString().split('T')[0],
        dueDate: '2026-11-30',
        status: 'Pattern Making',
        fabricType: item.fabricTags?.[0] || item.recommendedFabric.split(',')[0],
        yardage: item.yardageRequired,
        thumbnail: item.image,
        notes: `Extracted from ${item.sourceBlogTag}: ${item.aiStyleSummary}`,
        tags: [item.category, ...(item.fabricTags || []), item.sourceBlogTag].slice(0, 5),
        measurements: {
          chestBust: 42,
          waist: 34,
          hips: 42,
          shoulderWidth: 18.5,
          sleeveLength: 25.5,
          fullLength: 48,
          unit: 'inches',
        },
      };
      handleAddProject(newProj);
      setActiveTab('vault');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/25 selection:text-amber-200">
      
      {/* Offline Mode Status Banner */}
      <OfflineBanner
        isOnline={isOnline}
        isSimulated={isSimulatedOffline}
        onToggleSimulate={toggleSimulateOffline}
        onRefreshSync={() => showToast('Re-checking workshop network connection...')}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSnap={() => handleOpenSnap()}
        onOpenMeasurements={() => setIsMeasurementModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenFirebaseGuide={() => setIsFirebaseGuideOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulateOffline={toggleSimulateOffline}
        isInstallable={isInstallable}
        onInstallPWA={install}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateTab={setActiveTab}
            onOpenSnapModal={() => handleOpenSnap()}
            onSelectTrendingStyle={(style) => handleOpenSnap(style)}
            activeProjects={projects}
            onOpenMeasurements={() => setIsMeasurementModalOpen(true)}
          />
        )}

        {activeTab === 'trends' && (
          <TrendFeed
            onDeconstructStyle={(style) => handleOpenSnap(style)}
            onApplyTrend={handleApplyTrend}
            onSendToVault={(style) => {
              handleAddProject({
                id: `proj-${Date.now()}`,
                userId: user?.uid,
                title: style.title,
                clientName: 'New Client Commission',
                category: style.category,
                dateCreated: new Date().toISOString().split('T')[0],
                dueDate: '2026-11-20',
                status: 'Pattern Making',
                fabricType: style.recommendedFabric.split(',')[0],
                yardage: style.yardageRequired,
                thumbnail: style.image,
                notes: style.tailoringNotes,
                tags: [style.category, style.complexity],
                measurements: {
                  chestBust: 42,
                  waist: 34,
                  hips: 42,
                  shoulderWidth: 18.5,
                  sleeveLength: 25.5,
                  fullLength: 48,
                  unit: 'inches'
                }
              });
              setActiveTab('vault');
            }}
            onSaveMoodboardToVault={(title, notes) => {
              handleAddProject({
                id: `proj-${Date.now()}`,
                userId: user?.uid,
                title,
                clientName: 'Atelier Moodboard Lookbook',
                category: 'Traditional & Ceremonial',
                dateCreated: new Date().toISOString().split('T')[0],
                dueDate: '2026-11-30',
                status: 'Draft',
                fabricType: 'Curated Textile Palette',
                yardage: 'Palette & Textures',
                thumbnail: '/src/assets/images/moodboard_textures_swatches_1792949207828.jpg',
                notes,
                tags: ['Moodboard', 'Palette', 'Accessories'],
                variationType: 'AI Moodboard',
              });
            }}
          />
        )}

        {activeTab === 'vault' && (
          <SketchVault
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateStatus={handleUpdateProjectStatus}
            onDeleteProject={handleDeleteProject}
            onOpenSnapModal={() => handleOpenSnap()}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'fabrics' && (
          <FabricGuide />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSnap={() => handleOpenSnap()}
      />

      {/* Flagship Snap-to-Design & AI Variation Module */}
      <SnapToDesignModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        onSaveToVault={handleSaveToVaultFromSnap}
        initialSketchUrl={snapPresetStyle.image}
        initialTitle={snapPresetStyle.title}
      />

      {/* Secondary Blueprint Deconstruction Modal */}
      <SnapExploreModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        onSaveToVault={handleSaveToVaultFromSnap}
        preselectedImage={snapPresetStyle.image}
        preselectedTitle={snapPresetStyle.title}
      />

      {/* Digital Client Tape Measurement Modal */}
      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSave={handleSaveMeasurements}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Firebase Setup Guide Modal */}
      <FirebaseGuideModal
        isOpen={isFirebaseGuideOpen}
        onClose={() => setIsFirebaseGuideOpen(false)}
      />

      {/* Atelier Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating Atelier Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-zinc-900 border border-amber-500/30 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
