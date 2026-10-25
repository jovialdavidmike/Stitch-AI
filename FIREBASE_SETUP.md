# StitchAI — Firebase Authentication & Firestore Setup Guide

This document outlines the architecture, configuration code, security rules, and setup instructions for StitchAI's private tailor workspaces.

---

## 1. Architecture Overview

StitchAI provides private, isolated atelier workspaces for each fashion designer and bespoke tailor.
- **Authentication**: Firebase Authentication (Google Sign-In + Email/Password).
- **Database**: Cloud Firestore Enterprise with custom database ID.
- **Data Isolation**: Each tailor's sketches, variations, and measurements reside exclusively under `/users/{userId}/sketches/{sketchId}`.
- **Security Rules**: Attribute-Based Access Control (ABAC) ensuring tailors can strictly only read and write their own design documents.

---

## 2. Configuration & Initialization

Load configuration from `firebase-applet-config.json`:

```typescript
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// CRITICAL: Explicitly pass the firestoreDatabaseId from the configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
```

---

## 3. Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default-deny all unlisted paths
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    // Tailor User Profile
    match /users/{userId} {
      allow read, write: if isOwner(userId) && isValidId(userId);

      // Private Design Vault: Snapped Sketches & AI Variations
      match /sketches/{sketchId} {
        allow read, write: if isOwner(userId) && isValidId(userId);
      }
    }
  }
}
```

---

## 4. Firestore Intermediate Blueprint (`firebase-blueprint.json`)

The structural data schema is formally documented in `firebase-blueprint.json`:
- **Entity**: `UserProfile` (`id`, `email`, `displayName`, `atelierName`, `createdAt`)
- **Entity**: `SavedSketch` (`id`, `userId`, `title`, `clientName`, `category`, `status`, `fabricType`, `yardage`, `thumbnail`, `notes`, `tags`, `variationType`, `createdAt`)

---

## 5. Setup Instructions for External / Production Deployments

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. **Enable Authentication Providers**:
   - Navigate to *Authentication > Sign-in method*.
   - Enable **Google** and **Email/Password**.
3. **Provision Cloud Firestore**:
   - Navigate to *Firestore Database*.
   - Click *Create Database* and select production rules.
4. **Deploy Rules**:
   - Run `firebase deploy --only firestore:rules` or use the AI Studio `deploy_firebase` tool.
5. **Add Environment Config**:
   - Copy client credentials into `firebase-applet-config.json`.
