Project Title
PorraliaApp — React Native pools & prediction app

Project Overview

What it is: A React Native mobile app for creating, joining and managing prediction pools (betting/points-based pools) with user authentication and social/invite features.
Tech stack: React Native, React Navigation, @tanstack/react-query, AsyncStorage, fetch/axios, and native modules (image picker, linear gradient, vector icons).

What I implemented

Multi-step Pool Creation: A 5-step flow to create pools with payload shaping and API submission (CreatePoolScreen.js).
Pools List & Filtering: List, search and multi-criteria filters (status, role, category, user) with client-side filtering (PoolScreen.js).
Pool Cards & Details: Reusable UI component showing pool details, players, pot and copy-invite functionality (PoolCard.js).
API Hooks with react-query: Encapsulated hooks for creating pools, fetching pools/users/categories, predictions and result actions (PoolApis.js).
Auth & Persistence: Token+user persistence using AsyncStorage and AuthContext for app-wide auth state (AuthContext.js).
Navigation & App Shell: Auth vs App flows using NavigationContainer, AuthNavigator and RootNavigator with a loading state in App.tsx.
UI Utilities & Assets: Centralized colors/fonts/images and shared components (Header, Loader, Steps components).

Why this is helpful

User-friendly pool workflows: Stepper UI guides users to create pools reliably and validates payload shape before sending to backend.
Fast, consistent data fetching: react-query delivers caching, background refresh and invalidation to keep UI responsive and current.
Reusability: Components and hooks are modular so new screens/features can reuse existing logic.
Offline/resume friendly auth: AsyncStorage persistence allows returning users to resume without re-login.

How to run (basic)

Install deps and start:
npm install
npx pod-install ios
npm run start
npm run android    # or
npm run ios


Important files

Package metadata: package.json
App entry: App.tsx — App.tsx
Auth context: AuthContext.js — AuthContext.js
API hooks: PoolApis.js — PoolApis.js
Pool creation: CreatePoolScreen.js — CreatePoolScreen.js
Pools list & filter: PoolScreen.js — PoolScreen.js
Pool UI: PoolCard.js — PoolCard.js