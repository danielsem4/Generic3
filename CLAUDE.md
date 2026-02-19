# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Architecture & Engineering Rules

> **This document is the single source of truth.**
> Claude Code MUST follow every rule here on every task.
> If a user request conflicts with these rules, **these rules win.**

---

## Development Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

There are no tests configured in this project yet.

### Environment

The API base URL is stored in `.env` as `VITE_API_URL_DEV`. The backend is hosted at `https://genericweb.onrender.com/api/v1/`. When creating the centralized `apiClient`, use `import.meta.env.VITE_API_URL_DEV`.

---

## Current Migration State

**This codebase is mid-refactor.** The architecture rules below define the target state. The current source still contains forbidden folders that must be migrated:

| Current (wrong) | Target (correct) |
|---|---|
| `src/screens/login/` | `src/features/auth/` |
| `src/screens/home/` | `src/features/dashboard/` |
| `src/screens/verify/` | `src/features/auth/` |
| `src/api/usersApi.ts` | `src/features/dashboard/api/dashboard.api.ts` |
| `src/store/useUserStore.tsx` | Zustand slice + TanStack Query |
| `src/common/types/User.ts` | `src/types/user.types.ts` |
| `src/components/ui/AppSidebar.tsx` | `src/components/shared/AppSidebar.tsx` |
| `src/components/ui/SiteHeader.tsx` | `src/components/shared/SiteHeader.tsx` |
| `src/router.tsx` | `src/app/router.tsx` (or keep at root — confirm with user) |

**Missing libraries that must be installed before implementing forms:**
- `zod` — not yet in package.json
- `react-hook-form` + `@hookform/resolvers` — not yet in package.json

**Known bugs to fix during migration:**
- `src/routes/ProtectedRoute.tsx` redirects unauthenticated users to `/home` — must be `/`
- `src/store/useUserStore.tsx` stores server data (users array) in Zustand — move to TanStack Query
- `src/screens/home/Home.tsx` fetches in `useEffect` — must use `useQuery`
- Auth uses `localStorage.setItem("isAuthenticated", "true")` — acceptable as client-side identity flag

---

## Table of Contents
1. [Tech Stack](#1-tech-stack)
2. [Directory Structure](#2-directory-structure)
3. [Core Architecture Principles](#3-core-architecture-principles)
4. [Data Ownership Rules](#4-data-ownership-rules)
5. [Data Fetching Rules](#5-data-fetching-rules)
6. [API Layer Rules](#6-api-layer-rules)
7. [React 19 Rules](#7-react-19-rules)
8. [Zustand Rules](#8-zustand-rules)
9. [TypeScript Rules](#9-typescript-rules)
10. [Import Rules](#10-import-rules)
11. [Styling Rules](#11-styling-rules)
12. [Error Handling](#12-error-handling)
13. [Naming Conventions](#13-naming-conventions)
14. [Refactoring Rules](#14-refactoring-rules)
15. [Configuration & Env](#15-configuration--env)
16. [Decision Priority](#16-decision-priority)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + Shadcn/UI |
| Routing | React Router v7 (Data API: loaders/actions) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 (Slice Pattern) |
| Validation | Zod + React Hook Form |
| HTTP | Axios (centralized instance only) |
| Notifications | Sonner |

> ❌ No alternative libraries may be introduced without explicit instruction.

---

## 2. Directory Structure

```
src/
│├── App.tsx
│├── router.tsx
│└── providers/
│
├── components/                   # Reusable UI ONLY — no business logic
│   ├── ui/                       # Shadcn primitives only
│   └── shared/                   # Global composite components
│
├── features/                     # ALL business logic lives here
│   └── [feature-name]/
│       ├── api/                  # API functions for this feature
│       ├── components/           # Feature-scoped components
│       ├── hooks/                # Feature-scoped hooks
│       ├── pages/                # Route-level components
│       ├── schemas/              # Zod schemas + derived types
│       ├── types/                # Feature-only types
│       └── stores/               # (Optional) Client UI state only
│
├── hooks/                        # Truly global hooks — no feature coupling
├── lib/                          # Pure utilities — no React
│   ├── apiClient.ts
│   └── utils.ts
│
└── types/                        # Global shared types only
```

### 2.1 Forbidden Folders

These folders **MUST NOT** exist anywhere in the project:

```
src/api/
src/store/
src/screens/
src/common/
```

### 2.2 Feature Creation Checklist

Every new feature MUST include all of these subfolders:

- `api/`
- `components/`
- `hooks/`
- `pages/`
- `schemas/`
- `types/`

Optional (only if client UI state is genuinely needed):

- `stores/`

> If a feature does not require client state, **do NOT create a store.**

### 2.3 Barrel Exports

Each feature MUST expose its public API via `index.ts` at the feature root.

```ts
// features/users/index.ts
export { UserList } from "./components/UserList";
export { useUsers } from "./hooks/useUsers";
export type { User } from "./types/user.types";
```

Pages and internal helpers are **not** exported from `index.ts`.

---

## 3. Core Architecture Principles

### 3.1 Feature-Based Architecture (Strict)

- All business logic MUST live inside `src/features/`
- There is **no** global business logic layer
- The project is structured by **domain feature**, not by technical type

Business logic includes:
- API calls
- Feature-specific hooks
- Feature components
- Validation schemas
- Feature state
- Types that belong only to that feature

### 3.2 Non-Negotiable Rules

Claude Code MUST:

| Rule | Enforcement |
|---|---|
| NEVER break feature boundaries | Hard rule |
| NEVER move business logic outside `features/` | Hard rule |
| NEVER fetch data inside `useEffect` | Hard rule |
| NEVER place API calls inside Zustand stores | Hard rule |
| NEVER duplicate server state into Zustand | Hard rule |
| ALWAYS use the central `apiClient` | Hard rule |
| ALWAYS use named exports (except lazy-loaded pages) | Hard rule |
| ALWAYS guard dependent queries using `enabled` | Hard rule |
| ALWAYS respect server/client state separation | Hard rule |

> When in doubt, **prefer existing patterns** in the project.

---

## 4. Data Ownership Rules

### 4.1 Server State

```
API → TanStack Query → Component
```

- Server data comes from the API and lives **only** in TanStack Query
- MUST NOT be stored in Zustand
- MUST NOT be manually cached

Always use:
- `useQuery`
- `useMutation`
- React Router loaders (when appropriate)

### 4.2 Client State

```
UI interaction → Zustand slice → Component
```

- Lives **only** in Zustand
- Must **never** contain server-fetched data

Examples of valid client state:
- `isSidebarOpen`
- `selectedUserId`
- Modal visibility flags

> If unsure whether something is server or client state, **prefer TanStack Query.**

---

## 5. Data Fetching Rules

### 5.1 Absolute Rules

| ❌ Never | ✅ Always |
|---|---|
| Fetch inside `useEffect` | Use `useQuery` or Router loaders |
| Run queries without required deps | Guard with `enabled` |
| Call API directly from a component | Route through a hook |

### 5.2 Query Pattern

```ts
const { data } = useQuery({
  queryKey: ["users", "detail", userId],
  queryFn: () => getUserById(userId),
  enabled: !!userId,  // REQUIRED when query depends on a variable
});
```

### 5.3 Query Key Convention

Keys MUST follow this structure: `[featureName, operation, ...params]`

```ts
// ✅ Correct
queryKey: ["users", "list"]
queryKey: ["users", "detail", userId]
queryKey: ["orders", "list", { status: "pending" }]

// ❌ Wrong
queryKey: ["getUsers"]
queryKey: [userId]
```

### 5.4 Mutation Pattern

```ts
const { mutate } = useMutation({
  mutationFn: (payload: CreateUserPayload) => createUser(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    toast.success("User created");
  },
  onError: () => {
    toast.error("Something went wrong");
  },
});
```

> Always invalidate related queries in `onSuccess`. Never update Zustand with the response.

---

## 6. API Layer Rules

### 6.1 Location

All API functions MUST live in:

```
features/[feature]/api/[feature].api.ts
```

### 6.2 Axios Usage

```ts
// ✅ Correct
import { apiClient } from "@/lib/apiClient";

// ❌ Wrong — never import axios directly
import axios from "axios";
```

Always use the centralized `apiClient` to guarantee interceptors and global config.

### 6.3 Component Restrictions

```
✅ Component → Hook → API function
❌ Component → API function (direct call forbidden)
```

### 6.4 API Function Shape

```ts
// features/users/api/users.api.ts
import { apiClient } from "@/lib/apiClient";
import type { User, CreateUserPayload } from "../types/user.types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get("/users");
  return data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post("/users", payload);
  return data;
};
```

---

## 7. React 19 Rules

### 7.1 Forms

```ts
// ✅ Required pattern
const form = useForm<FormSchema>({
  resolver: zodResolver(schema),
});

// ❌ Forbidden
const [email, setEmail] = useState("");  // raw useState for fields
```

Forms MUST:
- Use `useActionState`
- Use React Hook Form
- Use Zod validation
- Derive types from Zod schemas

Forms MUST NOT:
- Use raw `useState` for field management
- Handle validation manually

### 7.2 Refs

```ts
// ✅ React 19 — ref as a normal prop
function Input({ ref, ...props }) { ... }

// ❌ Old pattern — do not use
const Input = forwardRef((props, ref) => { ... });
```

---

## 8. Zustand Rules

### 8.1 Absolute Rules

- Zustand is **only** for client UI state
- NEVER place async API logic inside a store
- NEVER store server-fetched data

### 8.2 Slice Pattern (Required)

```ts
// features/users/stores/usersUiSlice.ts
export interface UsersUiSlice {
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}

export const createUsersUiSlice = (set: SetState<UsersUiSlice>): UsersUiSlice => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
});
```

```ts
// app/stores/rootStore.ts
import { create } from "zustand";
import { createUsersUiSlice, UsersUiSlice } from "@/features/users/stores/usersUiSlice";

type RootStore = UsersUiSlice; // extend with more slices as needed

export const useStore = create<RootStore>()((...args) => ({
  ...createUsersUiSlice(...args),
}));
```

---

## 9. TypeScript Rules

| Rule | Detail |
|---|---|
| No `any` | Use `unknown` + type guards instead |
| Derive types from Zod | `z.infer<typeof schema>` |
| Strict API response typing | No implicit `any` from axios |
| Shared types → `src/types/` | Only if used across multiple features |
| Feature types → feature `types/` | If used only within that feature |

```ts
// ✅ Correct
const schema = z.object({ name: z.string() });
type FormData = z.infer<typeof schema>;

// ❌ Wrong
const handleSubmit = (data: any) => { ... };
```

---

## 10. Import Rules

### 10.1 Path Aliases

```ts
// ✅ Correct
import { apiClient } from "@/lib/apiClient";
import { useUsers } from "@/features/users";

// ❌ Wrong
import { apiClient } from "../../../lib/apiClient";
```

### 10.2 Feature Encapsulation

```ts
// ✅ Import from feature's public index
import { UserCard } from "@/features/users";

// ❌ Deep import into another feature's internals
import { UserCard } from "@/features/users/components/UserCard";
```

- Features expose public API via `index.ts` only
- Cross-feature imports go through `index.ts`
- If logic is needed by 2+ features, move it to `lib/` or `types/`

---

## 11. Styling Rules

- Use Tailwind only — no inline styles, no CSS modules
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- `components/ui/` is for Shadcn primitives only — no business logic
- No business logic inside UI primitives

```ts
// ✅ Correct
<div className={cn("base-class", isActive && "active-class")} />

// ❌ Wrong
<div style={{ color: "red" }} />
```

---

## 12. Error Handling

- Every route MUST define an `errorElement`
- Surface user-facing errors via **Sonner** (`toast.error(...)`)
- 401 handling MUST be centralized in `apiClient` interceptors
- Do not silently swallow errors

```ts
// lib/apiClient.ts — centralized 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle globally
    }
    return Promise.reject(error);
  }
);
```

---

## 13. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useUsers.ts` |
| API files | `[feature].api.ts` | `users.api.ts` |
| Schema files | `[feature].schema.ts` | `users.schema.ts` |
| Type files | `[feature].types.ts` | `user.types.ts` |
| Store slices | `[feature]UiSlice.ts` | `usersUiSlice.ts` |
| Pages | PascalCase + `Page` suffix | `UsersPage.tsx` |
| Utilities | camelCase | `formatDate.ts` |

---

## 14. Refactoring Rules

When refactoring, Claude Code MUST:

- ✅ Improve type safety where possible
- ✅ Preserve public component APIs
- ✅ Follow existing patterns

Claude Code MUST NOT:

- ❌ Change the architecture
- ❌ Move files across features unless explicitly requested
- ❌ Introduce global state unnecessarily
- ❌ Rename exports without confirming impact

---

## 15. Configuration & Env

- Access environment variables ONLY through a typed config file or `import.meta.env`
- Do not hardcode API URLs anywhere
- The env variable for the API base URL is `VITE_API_URL_DEV`

```ts
// lib/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL_DEV,
} as const;
```

---

## 16. Decision Priority

When implementing any task, apply rules in this exact order:

```
1. Feature architecture rules       ← highest priority
2. Data ownership rules
3. API layer rules
4. React 19 rules
5. Type safety rules
6. Styling rules                    ← lowest priority
```

> Architecture decisions always take priority over convenience or speed.
