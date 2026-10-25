import { SketchProject, GarmentStyle } from './index';

export interface NotificationSettings {
  dailyTrendDigest: boolean;
  orderDeadlineReminders: boolean;
  fittingMilestoneAlerts: boolean;
  workshopSoundChimes: boolean;
  digestTime: string; // e.g. "08:00"
  reminderAdvanceHours: number; // e.g. 24 or 48
}

export interface OfflineMutation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  docId: string;
  data?: any;
  timestamp: number;
}

export interface OfflineCacheMetadata {
  vaultCount: number;
  trendsCount: number;
  lastCachedAt: string;
  storageEngine: 'IndexedDB' | 'localStorage';
}
