# Medications Screen — Design Spec

**Date:** 2026-03-19
**Branch:** medication_role_based
**Status:** Design Approved — Ready for Implementation

---

## 1. Overview

Replace the current stub `Medications.tsx` with a fully role-based screen. The data fetched and UI actions available depend entirely on the authenticated user's role. The screen reuses existing project patterns: dumb components, logic in hooks, TanStack Query for server data, i18n for all strings.

**Note on the existing stub:** The current `useMedications` hook exposes `setSearchTerm` directly. The new hook's return signature is completely different (`handleSearchChange`, `handleSortChange`, role flags, etc.). The existing stub is a full rewrite, not an extension.

---

## 2. TypeScript Interfaces

Extend `src/common/types/Medication.ts` with the domain models below. Field names follow the existing camelCase convention (`medName` not `med_name`).

```ts
// Already exists — keep as-is
export interface IMedication {
  id: string;
  medName: string;
  medForm: string;
  medUnitOfMeasurement: string;
}

// New
export interface IClinicMedication {
  id: string;
  clinicId: string;
  medicationId: string;
  medication: IMedication;        // populated by backend join
}

export type PrescriptionFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IPatientPrescription {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  medicationId: string;
  medName: string;                // denormalised for display
  startDate: string;              // ISO date string
  endDate: string;                // ISO date string
  dosage: string;
  frequency: PrescriptionFrequency;
  // frequency_data intentionally omitted from display (decided in spec)
}

// Pre-defined for future log-history feature — not rendered in this release
export type MedicationLogStatus = "TAKEN" | "SKIPPED" | "DELAYED";

export interface IPatientMedicationLog {
  id: string;
  patientMedicationId: string;
  patientId: string;
  takenAt: string;                // ISO datetime
  dosageTaken: string;
  status: MedicationLogStatus;
}
```

### Discriminated Union for `MedicationCard`

To safely narrow the union inside `MedicationCard`, use an `"in"` type guard:

```ts
function isCatalogItem(item: IMedication | IPatientPrescription): item is IMedication {
  return "medForm" in item;
}
```

Export this guard from `Medication.ts` so it can be imported by the card component.

---

## 3. API Service — `src/api/medicationService.ts`

Placeholder async functions; real endpoints will replace the mock bodies later.

| Function | Caller role(s) | Args | Returns |
|---|---|---|---|
| `fetchAllGlobalMedications()` | ADMIN, AddToClinicModal | — | `IMedication[]` |
| `fetchClinicMedications(clinicId)` | CLINIC_MANAGER, DOCTOR, RESEARCH_PATIENT | `string` | `IClinicMedication[]` |
| `fetchPatientPrescriptions(patientId)` | PATIENT | `string` | `IPatientPrescription[]` |
| `addGlobalMedication(data)` | ADMIN | `{medName, medForm, medUnit}` | `IMedication` |
| `addMedicationToClinic(clinicId, medicationId)` | CLINIC_MANAGER | `string, string` | `IClinicMedication` |
| `removeMedicationFromClinic(clinicId, medicationId)` | CLINIC_MANAGER | `string, string` | `void` |

All functions return resolved mock data during development.

---

## 4. Role Config Map

Extract to a separate file `src/screens/medications/hooks/medicationRoleConfig.ts` to keep `useMedications.ts` under 150 lines.

```ts
// medicationRoleConfig.ts
export type SortOption = "az" | "za" | "form";
export type ViewMode = "catalog" | "prescription";

export interface RoleConfig {
  queryFn: () => Promise<(IMedication | IClinicMedication | IPatientPrescription)[]>;
  viewMode: ViewMode;
  canAdd: boolean;
  canDelete: boolean;
  sortOptions: SortOption[];     // controls which sort options appear in dropdown
}
```

Config values per role (keys must match `UserRole` string literals exactly — uppercase with underscores):

| Role | queryFn | viewMode | canAdd | canDelete | sortOptions |
|---|---|---|---|---|---|
| `ADMIN` | `fetchAllGlobalMedications` | `catalog` | `true` | `false` | `["az","za","form"]` |
| `CLINIC_MANAGER` | `fetchClinicMedications(clinicId)` | `catalog` | `true` | `true` | `["az","za","form"]` |
| `DOCTOR` | `fetchClinicMedications(clinicId)` | `catalog` | `false` | `false` | `["az","za","form"]` |
| `PATIENT` | `fetchPatientPrescriptions(patientId)` | `prescription` | `false` | `false` | `["az","za"]` |
| `RESEARCH_PATIENT` | `fetchClinicMedications(clinicId)` | `catalog` | `false` | `false` | `["az","za","form"]` |

**Patient sort:** The `"form"` option is excluded from the patient view because `IPatientPrescription` has no `medForm` field. Patients see only A→Z and Z→A (sorted by `medName`).

---

## 5. Hook — `useMedications`

Lives at `src/screens/medications/hooks/useMedications.ts`. Imports `RoleConfig` and the role config map from `medicationRoleConfig.ts`.

**Responsibilities:**
- Read role via **`useRole()`** (not `useAuthStore` directly — use the existing hook)
- Guard for null role: if `role` is `null`, return a safe empty state (no query runs, no UI crash)
- Read `clinicId` and `userId` from `useAuthStore` for query arguments
- Look up the matching `RoleConfig` from the map
- Run TanStack Query (query key: `["medications", role, clinicId ?? userId]`) — enabled when role is non-null and relevant IDs are available
- Manage `searchTerm` (string, init `""`) and `sortOption` (SortOption, init `"az"`)
- Derive `filteredMedications` by filtering then sorting the query result
- Expose `canAdd`, `canDelete`, `viewMode`, `sortOptions`, `isLoading`, `error`, `handleDelete`, `handleSearchChange`, `handleSortChange`, `filteredMedications`, `totalCount`

**Sort logic:**
- `"az"` — `localeCompare` ascending on `medName`
- `"za"` — `localeCompare` descending on `medName`
- `"form"` (catalog only) — `localeCompare` ascending on `medForm`

**`handleDelete` strategy:**
- `handleDelete` in the hook accepts `(item: IClinicMedication)` and calls `removeMedicationFromClinic(clinicId, item.medicationId)`, then `queryClient.invalidateQueries({ queryKey: ["medications"] })`
- `MedicationList` receives `onDelete: (item: IClinicMedication) => void` and passes a pre-bound closure to each card: `onDelete={() => onDelete(item)}`
- `MedicationCard.onDelete` is `() => void` — the id is already captured in the closure

---

## 6. Components

### `MedicationSearchSort`
`src/screens/medications/components/MedicationSearchSort.tsx`

Props:
```ts
interface Props {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  sortOptions: SortOption[];   // only show options the role supports
}
```

Renders the search `<Input>` (with `Search` icon) and a sort `<select>` dropdown populated from `sortOptions`. Stateless.

### `MedicationCard`
`src/screens/medications/components/MedicationCard.tsx`

Props:
```ts
interface Props {
  item: IMedication | IPatientPrescription;
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete?: () => void;
}
```

Use the exported `isCatalogItem(item)` guard to narrow the type safely.

**`catalog` mode** renders:
- 💊 icon + `medName` (bold)
- `medForm` badge (blue) + `medUnitOfMeasurement` badge (green)
- `Trash2` icon (lucide-react, red/muted) if `canDelete && onDelete`

**`prescription` mode** renders:
- 💊 icon + `medName` (bold)
- Dosage and frequency label (from `freq.*` i18n keys) on one row
- Start date → End date on a second row
- No delete icon ever

### `MedicationList`
`src/screens/medications/components/MedicationList.tsx`

Props: `medications`, `viewMode`, `canDelete`, `onDelete: (item) => void`

Renders a count header, then maps `medications` to `MedicationCard` instances, passing `onDelete={() => onDelete(item)}` to each. Shows dashed-border empty state with `t("medications.noData")` when array is empty.

### `AddMedicationModal` (Admin only)
`src/screens/medications/components/AddMedicationModal.tsx`

Uses Radix UI `Dialog` (same pattern as `AddDoctorDialog`). Form fields:
- `medName` — free text input
- `medForm` — `Select` dropdown: TAB, CAP, GEL, SUS, VAC, INJ, CRE, OIN, DRO, SPR (abbreviations rendered as-is; no i18n needed for the values themselves)
- `medUnit` — `Select` dropdown: MG, ML, MCG, IU, MEQ, G (same — abbreviations as-is)

Logic in `hooks/useAddMedicationDialog.ts` (open state, react-hook-form, submit handler calling `addGlobalMedication`, then `queryClient.invalidateQueries`).

### `AddToClinicModal` (Clinic Manager only)
`src/screens/medications/components/AddToClinicModal.tsx`

Uses Radix UI `Dialog`. Logic in `hooks/useAddToClinicDialog.ts`.

The inner hook runs a **separate** TanStack Query for the global catalog:
- Query key: `["medications", "global"]`
- Query fn: `fetchAllGlobalMedications()`
- `staleTime: 5 * 60 * 1000` (5 min — catalog changes rarely)

Body: search input (local filter, not re-fetched) + scrollable checkbox list of global medications. User ticks items, confirms, hook calls `addMedicationToClinic(clinicId, med.id)` for each selected, then invalidates `["medications"]`.

---

## 7. Screen — `Medications.tsx`

**Dumb container.** Calls `useMedications()`, derives nothing itself. Renders:

```
<page header: title + count + conditional Add button>
<MedicationSearchSort ... />
<MedicationList ... />
<AddMedicationModal /> (if role === "ADMIN")
<AddToClinicModal />  (if role === "CLINIC_MANAGER")
```

The Add button label: `t("medications.addNew")` for Admin, `t("medications.addToClinic")` for Clinic Manager.

Loading state: renders `t("home.loading")` text (matches Doctors/ClinicManagers pattern).
Error state: renders `t("home.error")` text.

---

## 8. i18n Keys

All four locale files (`en.ts`, `ar.ts`, `he.ts`, `ru.ts`) gain the following keys under `medications`. Existing keys are marked *(exists)*.

| Key | EN value |
|---|---|
| `title` | `"Medications"` *(exists)* |
| `allMedications` | `"All Medications"` *(exists)* |
| `searchPlaceholder` | `"Search for a medication..."` *(exists)* |
| `noData` | `"No matching medications found"` *(exists)* |
| `sort` | `"Sort: A-Z"` *(exists — can be repurposed as dropdown label)* |
| `addNew` | `"Add New Medication"` |
| `addToClinic` | `"Add Medication to Clinic"` |
| `sortAZ` | `"A → Z"` |
| `sortZA` | `"Z → A"` |
| `sortForm` | `"By Form"` |
| `medNameLabel` | `"Medication Name"` |
| `medFormLabel` | `"Form"` |
| `medUnitLabel` | `"Unit"` |
| `medNamePlaceholder` | `""` *(empty string in all 4 locales)* |
| `dosage` | `"Dosage"` |
| `frequency` | `"Frequency"` |
| `startDate` | `"Start"` |
| `endDate` | `"End"` |
| `registerButton` | `"Add"` |
| `registerTitle` | `"Add New Medication"` |
| `addToClinicTitle` | `"Add Medication to Clinic"` |
| `searchGlobal` | `"Search global catalog..."` |
| `confirm` | `"Confirm"` |
| `errMedName` | `"Medication name is required"` |
| `freq.ONCE` | `"Once"` |
| `freq.DAILY` | `"Daily"` |
| `freq.WEEKLY` | `"Weekly"` |
| `freq.MONTHLY` | `"Monthly"` |

Schema validation error keys follow project convention: the Zod schema stores the key string (e.g., `"medications.errMedName"`), and the form field component calls `t(error.message)` to translate it.

Form/unit option values (TAB, CAP, MG, ML, etc.) are uppercase abbreviations rendered as-is in the dropdown — no i18n keys needed for the option values themselves.

---

## 9. Error & Loading States

- **Null role:** `useMedications` returns `{ filteredMedications: [], isLoading: false, canAdd: false, canDelete: false, ... }` — screen renders nothing (router guards should prevent a logged-out user reaching this screen)
- **Loading:** TanStack Query `isLoading` — render `t("home.loading")` text
- **Query error:** TanStack Query `error` — render `t("home.error")` text
- **Empty search:** `MedicationList` shows dashed-border empty state with `t("medications.noData")`

---

## 10. File Summary

| File | Action | Notes |
|---|---|---|
| `src/common/types/Medication.ts` | Extend | Add 3 new interfaces + `isCatalogItem` guard |
| `src/api/medicationService.ts` | Create | 6 placeholder async functions |
| `src/screens/medications/Medications.tsx` | Rewrite | Dumb container |
| `src/screens/medications/hooks/useMedications.ts` | Rewrite | Role query + search/sort |
| `src/screens/medications/hooks/medicationRoleConfig.ts` | Create | `ROLE_CONFIG` map (keeps hook under 150 lines) |
| `src/screens/medications/hooks/useAddMedicationDialog.ts` | Create | Admin add form logic |
| `src/screens/medications/hooks/useAddToClinicDialog.ts` | Create | Clinic Manager multi-select logic |
| `src/screens/medications/components/MedicationSearchSort.tsx` | Create | Search + sort dropdown |
| `src/screens/medications/components/MedicationList.tsx` | Create | List + empty state |
| `src/screens/medications/components/MedicationCard.tsx` | Create | Unified card, two view modes |
| `src/screens/medications/components/AddMedicationModal.tsx` | Create | Admin form dialog |
| `src/screens/medications/components/AddToClinicModal.tsx` | Create | Clinic Manager catalog picker |
| `src/i18n/locales/en.ts` + 3 others | Extend | New `medications.*` keys |

---

## 11. Out of Scope

- `PatientMedicationLog` display (log history is a future feature; types pre-defined above)
- Pagination (not implemented on any other screen)
- Optimistic updates on delete (use `queryClient.invalidateQueries` after mutation)
