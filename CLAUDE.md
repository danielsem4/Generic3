# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (proxies `/api` to `https://genericweb.onrender.com`)
- `npm run build` — Type-check (`tsc -b`) then production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build
- `npx tsc --noEmit` — Type-check only (strict mode, no unused locals/params)

## Architecture

Medical clinic management dashboard — React 19 + TypeScript + Vite.

**Auth flow:** Django backend sets HTTP-only session cookies. The frontend never stores tokens or passwords. Zustand persist only keeps `clinicId` and `userId` in localStorage for route guarding and API calls. The cookie is the real auth mechanism.

**State layers:**
- **Zustand** (`src/store/useAuthStore.tsx`) — Auth IDs only, persisted to localStorage as `"auth-store"`
- **TanStack React Query** (`src/hooks/queries/`) — Server data (users, modules), in-memory only
- **Axios instance** (`src/lib/axios.ts`) — Global config with `withCredentials`, `withXSRFToken`, and 401 interceptor that auto-logouts

**Routing:** Defined in `src/main.tsx` using React Router v7. Protected routes use `src/routes/ProtectedRoute.tsx` which checks `clinicId`/`userId` from the auth store.

**API pattern:** Functions in `src/api/` use the global axios instance from `src/lib/axios.ts`. Query hooks in `src/hooks/queries/` wrap these with `useQuery`. Login uses `useMutation` in `src/screens/login/use_login.tsx`.

**API endpoints (all proxied through Vite in dev):**
- `POST /api/v1/auth/login/` — Returns `{ user: IAuthUser }` + sets session cookie
- `GET /api/v1/users/{clinicId}/user/{userId}/` — User list
- `GET /api/v1/modules` — Modules list

## Key Conventions

- Import alias: `@/*` maps to `./src/*`
- UI components live in `src/components/ui/` (Radix UI primitives + CVA variants)
- Screen components in `src/screens/{route}/` with co-located hooks
- Types: `I` prefix interfaces (`IAuthUser`, `IUser`, `IModule`) in `src/common/types/` and `src/common/`
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, theme vars in `src/index.css`, `cn()` utility in `src/lib/utils.ts`
- Notifications: `sonner` toast

## Security Rules

- **Never persist sensitive data** (passwords, tokens, PII, server URLs) to localStorage
- `IAuthUser` from the API contains a password hash — it must be sanitized via `sanitizeUser()` before any storage. Only `clinicId` and `userId` are persisted.
- All API calls go through `src/lib/axios.ts` which sets `withCredentials` and `withXSRFToken` globally
- The 401 interceptor in `src/lib/axios.ts` clears the store and redirects to `/` on session expiry
