# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (proxies `/api` to `https://genericweb.onrender.com`)
- `npm run build` — Type-check (`tsc -b`) then production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build
- `npm run test` — Run tests (Vitest)
- `npx tsc --noEmit` — Type-check only (strict mode, no unused locals/params)

## Architecture

Medical clinic management dashboard — React 19 + TypeScript + Vite.

**Auth flow:** Django backend sets HTTP-only session cookies. The frontend never stores tokens or passwords. Zustand persist only keeps `clinicId` and `userId` in localStorage for route guarding and API calls. The cookie is the real auth mechanism.

**State layers:**

- **Zustand** (`src/store/useAuthStore.tsx`) — Auth IDs only, persisted to localStorage as `"auth-store"`
- **TanStack React Query** (`src/hooks/queries/`) — Server data (users, modules), in-memory only
- **Axios instance** (`src/lib/axios.ts`) — Global config with `withCredentials`, `withXSRFToken`, and 401 interceptor that auto-logouts

**Routing:** Defined in `src/main.tsx` using React Router v7. Protected routes use `src/routes/ProtectedRoute.tsx`.

## Coding Standards & Best Practices

### 1. Component Architecture ("Dumb Components")

- **Separation of Concerns:** Components should be purely presentational ("dumb").
- **Logic Extraction:** Move all business logic, state management, and side effects into **Custom Hooks** or **Zustand Stores**.
- **No Inline Functions:** Do not define handlers inside the JSX `return` statement. Define them in the hook or component body.
  - _Bad:_ `<button onClick={() => setCount(c => c + 1)} />`
  - _Good:_ `<button onClick={handleIncrement} />`

### 2. Reusability (DRY Principle)

- **Logic:** If you write the same logic twice (e.g., toggle state, form handling), create a reusable hook in `src/hooks/common/` (e.g., `useToggle.ts`).
- **UI:** If you see repeated JSX structures, extract them into reusable components in `src/components/common/`.

### 3. File Structure & Naming

- **Hooks:** Must start with `use` (e.g., `useLogin.tsx`, `useToggle.ts`).
- **Components:** PascalCase (e.g., `PatientCard.tsx`).
- **Utilities:** camelCase (e.g., `dateUtils.ts`).
- **File Limits:** Files should aim to be under **150 lines**. If a file exceeds this, refactor and split logic into smaller hooks or sub-components.

### 4. Memoization (React 19)

**Do not use `useMemo` or `useCallback` manually.** This project targets React 19 with the React Compiler, which automatically handles memoization. Manual memoization adds noise without benefit and should be removed.

### 5. Testing

- **Mandatory Utils Testing:** Every new utility function created in `src/lib/` or `src/utils/` must have a corresponding unit test file (e.g., `MyUtil.test.ts`).

## Key Conventions

- Import alias: `@/*` maps to `./src/*`
- UI components live in `src/components/ui/` (Radix UI primitives + CVA variants)
- Screen components in `src/screens/{route}/` with co-located hooks
- Types: `I` prefix interfaces (`IAuthUser`, `IUser`) in `src/common/types/`
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, `cn()` utility in `src/lib/utils.ts`

## Security Rules

- **Never persist sensitive data** (passwords, tokens, PII) to localStorage.
- `IAuthUser` must be sanitized via `sanitizeUser()` before storage.
- All API calls use `src/lib/axios.ts` (Cookie-based auth).
- The 401 interceptor clears the store on session expiry.


### 6. Internationalization (i18n)

 - **All user-visible strings** must use `t()` from `react-i18next`. Never write raw English in JSX or component logic.
 - **No fallback strings:** Do not use `t("key") || "English fallback"` — add the key to the locale files instead.
 - **Schema error messages** must be i18n key strings (e.g. `"doctors.errFirstName"`), not raw English. The form field component calls `t(error.message)` to translate
 them.
 - **All 4 locale files** must be updated together: `src/i18n/locales/en.ts`, `ar.ts`, `he.ts`, `ru.ts`.

  Section 8 — Shared Hook Patterns

 ### 8. Shared Hook Patterns

 - **User list screens** (any screen that fetches a list of users and filters by search): use `useFilteredUsers(queryKey, queryFn)` from
 `src/hooks/common/useFilteredUsers.ts`. Do not duplicate the fetch + filter + search state logic.
 - The hook returns `handleSearchChange` (typed `React.ChangeEvent<HTMLInputElement>` handler) — use it directly on `<Input onChange={handleSearchChange} />` instead of
 wrapping in an inline arrow.