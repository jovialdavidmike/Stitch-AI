import React, { useState } from 'react';
import { X, Cloud, Check, Copy, Shield, Database, Lock, Terminal, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const sampleConfigSnippet = `// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();`;

  const sampleSecurityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /sketches/{sketchId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-editorial">
                Firebase Setup & Configuration Guide
              </h3>
              <p className="text-[11px] text-zinc-400">
                Authentication, Firestore Database & Private Workspace Architecture
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
          
          {/* Live Status Card */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Live Provisioned Environment
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Cloud Firestore
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div>
                <span className="text-zinc-500 block">Project ID:</span>
                <span className="text-zinc-200">{firebaseConfig.projectId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Database ID:</span>
                <span className="text-zinc-200 truncate block">{firebaseConfig.firestoreDatabaseId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Auth State:</span>
                <span className="text-amber-400">
                  {user ? `Authenticated as ${user.email || user.displayName}` : 'Guest / Offline Atelier Mode'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Security Rules:</span>
                <span className="text-zinc-200">Deployed (Private /users/{'{userId}'} paths)</span>
              </div>
            </div>
          </div>

          {/* Section 1: Step-by-Step Setup Instructions */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm font-editorial">
              1. Setup & Installation Instructions
            </h4>
            <div className="space-y-1.5 text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Install the Firebase JavaScript SDK via npm: <code className="bg-zinc-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">npm install firebase</code></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Configure <code className="bg-zinc-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">firebase-applet-config.json</code> with your projectId, apiKey, authDomain, and firestoreDatabaseId.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Enable Google Sign-In and Email/Password in the Firebase Console under <em>Authentication &gt; Sign-in method</em>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <span>Deploy Firestore Security Rules to isolate tailor workspaces by user UID.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm font-editorial">
                2. Firebase Client Configuration Code
              </h4>
              <button
                onClick={() => handleCopy(sampleConfigSnippet, 'config')}
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'config' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto text-[11px] font-mono text-zinc-300">
              {sampleConfigSnippet}
            </pre>
          </div>

          {/* Section 3: Security Rules */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm font-editorial">
                3. Firestore Security Rules (ABAC & User Isolation)
              </h4>
              <button
                onClick={() => handleCopy(sampleSecurityRules, 'rules')}
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'rules' ? 'Copied' : 'Copy Rules'}</span>
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto text-[11px] font-mono text-zinc-300">
              {sampleSecurityRules}
            </pre>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold rounded-xl transition-colors shadow text-xs"
          >
            Understood & Done
          </button>

        </div>
      </div>
    </div>
  );
};
