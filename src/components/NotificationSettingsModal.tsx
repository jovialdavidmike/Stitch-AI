import React, { useState, useEffect } from 'react';
import { 
  X, Bell, BellRing, Clock, Calendar, Volume2, 
  Check, AlertCircle, Sparkles, Send, ShieldCheck 
} from 'lucide-react';
import { NotificationSettings } from '../types/pwa';
import { 
  getCachedNotificationSettings, 
  cacheNotificationSettings, 
  DEFAULT_NOTIFICATION_SETTINGS 
} from '../lib/offlineStorage';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCachedNotificationSettings().then(setSettings);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserPermission(Notification.permission);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Web Notifications API is not supported in this browser.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        onShowToast('Browser notifications enabled for StitchAI!');
      } else {
        onShowToast('Notification permission was not granted.');
      }
    } catch (e) {
      console.warn('Error requesting notification permission', e);
    }
  };

  const handleSendTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('StitchAI Atelier · Order Reminder', {
          body: 'Chief Babatunde fitting is in 24 hours. Sokoto trouser hem is ready for basting.',
          icon: '/favicon.ico',
        });
        onShowToast('Test notification sent to system tray!');
        return;
      } catch (err) {
        console.warn('Native notification failed, showing in-app notification', err);
      }
    }

    // Fallback: in-app audio/toast alert
    onShowToast('Atelier Alert: Chief Babatunde fitting is in 24 hours (Basting stage).');
  };

  const handleSave = async () => {
    await cacheNotificationSettings(settings);
    setSaveSuccess(true);
    onShowToast('Notification preferences saved to local storage.');
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-editorial">
                Atelier Notification Settings
              </h3>
              <p className="text-[11px] text-zinc-400">
                PWA background alerts for trend forecasts and client fitting deadlines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
          
          {/* Browser System Permission Banner */}
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Browser Web Notification Permission:
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                {browserPermission === 'granted' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Permission Granted
                  </span>
                ) : browserPermission === 'denied' ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Blocked by Browser
                  </span>
                ) : (
                  <span className="text-amber-400">Not Prompted Yet</span>
                )}
              </div>
            </div>

            {browserPermission !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shrink-0"
              >
                Allow Alerts
              </button>
            )}
          </div>

          {/* Toggle 1: Daily Trend Digests */}
          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Daily Trend Digests</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Receive a daily summary of new bespoke silhouette releases, seasonal fabrics, and trending embroidery layouts.
                </p>
              </div>

              {/* iOS-Style Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.dailyTrendDigest}
                onClick={() => handleToggle('dailyTrendDigest')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.dailyTrendDigest ? 'bg-amber-400' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.dailyTrendDigest ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.dailyTrendDigest && (
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  Digest Delivery Time:
                </span>
                <input
                  type="time"
                  value={settings.digestTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, digestTime: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white font-mono text-xs focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Toggle 2: Order Deadline Reminders */}
          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Order Deadline Reminders</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Alerts prior to scheduled client fittings and delivery dates so cutting, basting, and hemming stay on track.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.orderDeadlineReminders}
                onClick={() => handleToggle('orderDeadlineReminders')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.orderDeadlineReminders ? 'bg-amber-400' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.orderDeadlineReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.orderDeadlineReminders && (
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs">
                <span className="text-zinc-400">Advance Warning Window:</span>
                <select
                  value={settings.reminderAdvanceHours}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderAdvanceHours: parseInt(e.target.value) }))}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-white text-xs focus:border-amber-400"
                >
                  <option value={12}>12 hours before fitting</option>
                  <option value={24}>24 hours before fitting (Recommended)</option>
                  <option value={48}>48 hours before fitting</option>
                  <option value={72}>3 days before fitting</option>
                </select>
              </div>
            )}
          </div>

          {/* Toggle 3: Fitting Milestone Alerts */}
          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-2xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-white block">Fitting Milestone Stage Changes</span>
              <p className="text-[11px] text-zinc-400">
                Notify when a garment moves from Cutting to Basting or Ready for Pickup.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.fittingMilestoneAlerts}
              onClick={() => handleToggle('fittingMilestoneAlerts')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.fittingMilestoneAlerts ? 'bg-amber-400' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                  settings.fittingMilestoneAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Test Notification Trigger */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSendTestNotification}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Dispatch Test Workshop Alert</span>
            </button>
          </div>

          {/* Save Action */}
          <div className="pt-2 border-t border-zinc-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveSuccess}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{saveSuccess ? 'Saved Preferences!' : 'Save Notification Preferences'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
