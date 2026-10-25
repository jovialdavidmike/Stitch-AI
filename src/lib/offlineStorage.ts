import { SketchProject, GarmentStyle } from '../types';
import { NotificationSettings, OfflineMutation, OfflineCacheMetadata } from '../types/pwa';
import { INITIAL_VAULT_PROJECTS, TRENDING_STYLES } from '../data/mockData';

const DB_NAME = 'stitchai_offline_db';
const DB_VERSION = 1;
const STORE_VAULT = 'design_vault';
const STORE_TRENDS = 'trend_feed';
const STORE_MUTATIONS = 'offline_mutations';
const STORE_SETTINGS = 'user_settings';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dailyTrendDigest: true,
  orderDeadlineReminders: true,
  fittingMilestoneAlerts: true,
  workshopSoundChimes: false,
  digestTime: '08:30',
  reminderAdvanceHours: 24,
};

// Open IndexedDB with graceful fallback
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_VAULT)) {
          db.createObjectStore(STORE_VAULT, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_TRENDS)) {
          db.createObjectStore(STORE_TRENDS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_MUTATIONS)) {
          db.createObjectStore(STORE_MUTATIONS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error, falling back to localStorage');
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB unavailable, using localStorage fallback', e);
      resolve(null);
    }
  });
}

// -------------------------------------------------------------
// 1. DESIGN VAULT CACHING
// -------------------------------------------------------------

export async function cacheVaultProjects(projects: SketchProject[]): Promise<void> {
  const db = await openDB();
  const timestamp = new Date().toISOString();

  if (db) {
    try {
      const tx = db.transaction(STORE_VAULT, 'readwrite');
      const store = tx.objectStore(STORE_VAULT);
      store.clear();
      for (const project of projects) {
        store.put(project);
      }
      localStorage.setItem('stitchai_vault_synced_at', timestamp);
      return;
    } catch (err) {
      console.warn('IndexedDB cache write error', err);
    }
  }

  // Fallback: localStorage
  try {
    localStorage.setItem('stitchai_cached_vault', JSON.stringify(projects));
    localStorage.setItem('stitchai_vault_synced_at', timestamp);
  } catch (e) {
    console.warn('localStorage vault quota exceeded', e);
  }
}

export async function getCachedVaultProjects(): Promise<SketchProject[]> {
  const db = await openDB();

  if (db) {
    try {
      const tx = db.transaction(STORE_VAULT, 'readonly');
      const store = tx.objectStore(STORE_VAULT);
      const request = store.getAll();

      const items = await new Promise<SketchProject[]>((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });

      if (items && items.length > 0) {
        return items;
      }
    } catch (err) {
      console.warn('IndexedDB read error', err);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('stitchai_cached_vault');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('localStorage parse error', e);
  }

  return INITIAL_VAULT_PROJECTS;
}

// -------------------------------------------------------------
// 2. TREND FEED CACHING
// -------------------------------------------------------------

export async function cacheTrends(trends: GarmentStyle[]): Promise<void> {
  const db = await openDB();
  const timestamp = new Date().toISOString();

  if (db) {
    try {
      const tx = db.transaction(STORE_TRENDS, 'readwrite');
      const store = tx.objectStore(STORE_TRENDS);
      store.clear();
      for (const item of trends) {
        store.put(item);
      }
      localStorage.setItem('stitchai_trends_synced_at', timestamp);
      return;
    } catch (err) {
      console.warn('IndexedDB trends write error', err);
    }
  }

  try {
    localStorage.setItem('stitchai_cached_trends', JSON.stringify(trends));
    localStorage.setItem('stitchai_trends_synced_at', timestamp);
  } catch (e) {
    console.warn('localStorage trends quota exceeded', e);
  }
}

export async function getCachedTrends(): Promise<GarmentStyle[]> {
  const db = await openDB();

  if (db) {
    try {
      const tx = db.transaction(STORE_TRENDS, 'readonly');
      const store = tx.objectStore(STORE_TRENDS);
      const request = store.getAll();

      const items = await new Promise<GarmentStyle[]>((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });

      if (items && items.length > 0) return items;
    } catch (err) {
      console.warn('IndexedDB trends read error', err);
    }
  }

  try {
    const raw = localStorage.getItem('stitchai_cached_trends');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('localStorage trends parse error', e);
  }

  return TRENDING_STYLES;
}

// -------------------------------------------------------------
// 3. NOTIFICATION SETTINGS STORAGE
// -------------------------------------------------------------

export async function cacheNotificationSettings(settings: NotificationSettings): Promise<void> {
  const db = await openDB();

  if (db) {
    try {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      store.put({ key: 'notifications', ...settings });
    } catch (err) {
      console.warn('IndexedDB settings write error', err);
    }
  }

  try {
    localStorage.setItem('stitchai_notification_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('localStorage settings write error', e);
  }
}

export async function getCachedNotificationSettings(): Promise<NotificationSettings> {
  const db = await openDB();

  if (db) {
    try {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const request = store.get('notifications');

      const data = await new Promise<any>((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });

      if (data) {
        const { key, ...rest } = data;
        return rest as NotificationSettings;
      }
    } catch (err) {
      console.warn('IndexedDB settings read error', err);
    }
  }

  try {
    const raw = localStorage.getItem('stitchai_notification_settings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('localStorage settings read error', e);
  }

  return DEFAULT_NOTIFICATION_SETTINGS;
}

// -------------------------------------------------------------
// 4. OFFLINE MUTATIONS QUEUE (SYNC ON RECONNECT)
// -------------------------------------------------------------

export async function queueOfflineMutation(mutation: OfflineMutation): Promise<void> {
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_MUTATIONS, 'readwrite');
      const store = tx.objectStore(STORE_MUTATIONS);
      store.put(mutation);
      return;
    } catch (err) {
      console.warn('IndexedDB mutation queue error', err);
    }
  }

  try {
    const raw = localStorage.getItem('stitchai_pending_mutations') || '[]';
    const queue: OfflineMutation[] = JSON.parse(raw);
    queue.push(mutation);
    localStorage.setItem('stitchai_pending_mutations', JSON.stringify(queue));
  } catch (e) {
    console.warn('localStorage mutation queue error', e);
  }
}

export async function getQueuedMutations(): Promise<OfflineMutation[]> {
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_MUTATIONS, 'readonly');
      const store = tx.objectStore(STORE_MUTATIONS);
      const request = store.getAll();
      return await new Promise<OfflineMutation[]>((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (err) {
      console.warn('IndexedDB mutation read error', err);
    }
  }

  try {
    const raw = localStorage.getItem('stitchai_pending_mutations');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('localStorage mutation read error', e);
  }

  return [];
}

export async function clearQueuedMutations(): Promise<void> {
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_MUTATIONS, 'readwrite');
      tx.objectStore(STORE_MUTATIONS).clear();
    } catch (err) {
      console.warn('IndexedDB clear error', err);
    }
  }
  localStorage.removeItem('stitchai_pending_mutations');
}

// -------------------------------------------------------------
// 5. CACHE STATUS METADATA
// -------------------------------------------------------------

export async function getCacheMetadata(): Promise<OfflineCacheMetadata> {
  const vault = await getCachedVaultProjects();
  const trends = await getCachedTrends();
  const lastSync = localStorage.getItem('stitchai_vault_synced_at') || 'Cached on app launch';

  const hasIDB = typeof window !== 'undefined' && 'indexedDB' in window;

  return {
    vaultCount: vault.length,
    trendsCount: trends.length,
    lastCachedAt: lastSync,
    storageEngine: hasIDB ? 'IndexedDB' : 'localStorage',
  };
}
