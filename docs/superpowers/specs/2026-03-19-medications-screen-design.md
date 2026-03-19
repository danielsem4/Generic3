# Medications Screen — Design Spec

**Date:** 2026-03-19
**Branch:** medication_role_based
**Status:** Approved

---

## 1. Overview

Replace the current stub `Medications.tsx` with a fully role-based screen. The data fetched and UI actions available depend entirely on the authenticated user's role. The screen reuses existing project patterns: dumb components, logic in hooks, TanStack Query for server data, i18n for all strings.

---

## 2. TypeScript Interfaces

Extend `src/common/types/Medication.ts` with all four domain models. Field names follow the existing camelCase convention (`medName` not `med_name`).

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
  medication: IMedication;       // populated by backend join
}

export type PrescriptionFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IPatientPrescription {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  medicationId: string;
  medName: string;               // denormalised for display
  startDate: string;             // ISO date string
  endDate: string;               // ISO date string
  dosage: string;
  frequency: PrescriptionFrequency;
  // frequency_data intentionally omitted from display (decided in spec)
}

export type MedicationLogStatus = "TAKEN" | "SKIPPED" | "DELAYED";

export interface IPatientMedicationLog {
  id: string;
  patientMedicationId: string;
  patientId: string;
  takenAt: string;               // ISO datetime
  dosageTaken: string;
  status: MedicationLogStatus;
}
```

---

## 3. API Service — `src/api/medicationService.ts`

Placeholder async functions; real endpoints will replace the mock bodies later.

| Function | Caller role | Args | Returns |
|---|---|---|---|
| `fetchAllGlobalMedications()` | ADMIN | — | `IMedication[]` |
| `fetchClinicMedications(clinicId)` | CLINIC_MANAGER, DOCTOR | `string` | `IClinicMedication[]` |
| `fetchPatientPrescriptions(patientId)` | PATIENT | `string` | `IPatientPrescription[]` |
| `addGlobalMedication(data)` | ADMIN | `{medName, medForm, medUnit}` | `IMedication` |
| `addMedicationToClinic(clinicId, medicationId)` | CLINIC_MANAGER | `string, string` | `IClinicMedication` |
| `removeMedicationFromClinic(clinicId, medicationId)` | CLINIC_MANAGER | `string, string` | `void` |

All functions return resolved mock data during development.

---

## 4. Role Config Map

Inside `useMedications`, a `ROLE_CONFIG` map encodes everything role-specific:

```ts
const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  ADMIN:           { queryFn, viewMode: "catalog",      canAdd: true,  canDelete: false },
  CLINIC_MANAGER:  { queryFn, viewMode: "catalog",      canAdd: true,  canDelete: true  },
  DOCTOR:          { queryFn, viewMode: "catalog",      canAdd: false, canDelete: false },
  PATIENT:         { queryFn, viewMode: "prescription", canAdd: false, canDelete: false },
  RESEARCH_PATIENT:{ queryFn, viewMode: "catalog",      canAdd: false, canDelete: false },
}
```

`viewMode` drives which fields `MedicationCard` renders. `canAdd` and `canDelete` are passed down as props.

---

## 5. Hook — `useMedications`

Lives at `src/screens/medications/hooks/useMedications.ts`.

**Responsibilities:**
- Read `role`, `clinicId`, `userId` from `useAuthStore`
- Look up the matching `RoleConfig` from the map
- Run TanStack Query with the role's `queryFn` (enabled when IDs are available)
- Manage `searchTerm` (string) and `sortOption` (`"az" | "za" | "form"`)
- Derive `filteredMedications` by filtering then sorting the query result
- Expose `canAdd`, `canDelete`, `viewMode`, `isLoading`, `error`, `handleDelete`, `totalCount`

**Sort logic:**
- `"az"` — `localeCompare` on `medName` (or `medName` from prescription)
- `"za"` — reverse of above
- `"form"` — `localeCompare` on `medForm` (patients: sort by `frequency` label instead)

---

## 6. Components

### `MedicationSearchSort`
`src/screens/medications/components/MedicationSearchSort.tsx`

Props: `searchTerm`, `onSearchChange`, `sortOption: SortOption`, `onSortChange`

Renders the search `<Input>` (with `Search` icon) and a sort `<select>` / shadcn `Select` dropdown with three options: A→Z, Z→A, By Form. Stateless — all state lives in the hook.

### `MedicationCard`
`src/screens/medications/components/MedicationCard.tsx`

Props: `item: IMedication | IPatientPrescription`, `viewMode: "catalog" | "prescription"`, `canDelete: boolean`, `onDelete?: () => void`

**`catalog` mode** renders:
- 💊 icon + `medName` (bold)
- `medForm` badge (blue) + `medUnitOfMeasurement` badge (green)
- Trash icon (red, `lucide-react Trash2`) if `canDelete`

**`prescription` mode** renders:
- 💊 icon + `medName` (bold)
- Dosage and Frequency label on one row
- Start date → End date on a second row
- No delete icon ever

### `MedicationList`
`src/screens/medications/components/MedicationList.tsx`

Props: `medications`, `viewMode`, `canDelete`, `onDelete`

Renders a header row showing count, then maps over medications to produce `MedicationCard` instances. Shows an empty-state `div` with dashed border when the array is empty.

### `AddMedicationModal` (Admin only)
`src/screens/medications/components/AddMedicationModal.tsx`

Uses Radix UI `Dialog` (same pattern as `AddDoctorDialog`). Form fields:
- `medName` — free text input
- `medForm` — `Select` dropdown with preset values: TAB, CAP, GEL, SUS, VAC, INJ, CRE, OIN, DRO, SPR
- `medUnit` — `Select` dropdown with preset values: MG, ML, MCG, IU, MEQ, G

Logic extracted to `hooks/useAddMedicationDialog.ts` (open state, react-hook-form, submit handler calling `addGlobalMedication`).

### `AddToClinicModal` (Clinic Manager only)
`src/screens/medications/components/AddToClinicModal.tsx`

Uses Radix UI `Dialog`. Body: search input + scrollable list of global medications (fetched via `fetchAllGlobalMedications`). Multi-select — user ticks checkboxes, confirms, triggers `addMedicationToClinic` for each selected item. Logic in `hooks/useAddToClinicDialog.ts`.

---

## 7. Screen — `Medications.tsx`

**Dumb container.** Calls `useMedications()`, derives nothing itself. Renders:

```
<page header: title + count + conditional Add button>
<MedicationSearchSort ... />
<MedicationList ... />
```

The Add button label differs by role: `"medications.addNew"` for Admin, `"medications.addToClinic"` for Clinic Manager. It opens the appropriate modal.

---

## 8. i18n Keys

All four locale files (`en.ts`, `ar.ts`, `he.ts`, `ru.ts`) gain the following keys under `medications`:

| Key | EN value |
|---|---|
| `title` | `"Medications"` *(already exists)* |
| `allMedications` | `"All Medications"` *(already exists)* |
| `searchPlaceholder` | `"Search for a medication..."` *(already exists)* |
| `noData` | `"No matching medications found"` *(already exists)* |
| `addNew` | `"Add New Medication"` |
| `addToClinic` | `"Add Medication to Clinic"` |
| `sortAZ` | `"Sort: A → Z"` |
| `sortZA` | `"Sort: Z → A"` |
| `sortForm` | `"Sort: By Form"` |
| `medNameLabel` | `"Medication Name"` |
| `medFormLabel` | `"Form"` |
| `medUnitLabel` | `"Unit"` |
| `medNamePlaceholder` | `""` |
| `dosage` | `"Dosage"` |
| `frequency` | `"Frequency"` |
| `startDate` | `"Start"` |
| `endDate` | `"End"` |
| `registerButton` | `"Add"` |
| `registerTitle` | `"Add New Medication"` |
| `addToClinicTitle` | `"Add Medication to Clinic"` |
| `searchGlobal` | `"Search global catalog..."` |
| `confirm` | `"Confirm"` |
| `errMedName` | `"medications.errMedName"` |
| `freq.ONCE` | `"Once"` |
| `freq.DAILY` | `"Daily"` |
| `freq.WEEKLY` | `"Weekly"` |
| `freq.MONTHLY` | `"Monthly"` |

Schema validation error keys follow the project convention: the key string is passed to `t()` by the form field component.

---

## 9. Error & Loading States

- **Loading:** `isLoading` from TanStack Query — screen renders the same `"home.loading"` text used by Doctors/ClinicManagers screens.
- **Error:** `error` from TanStack Query — render a simple error message using `"home.error"` key (matches existing pattern). No custom error boundary needed.
- **Empty search:** `MedicationList` shows the dashed-border empty state with `"medications.noData"`.

---

## 10. Out of Scope

- `PatientMedicationLog` display (no current requirement to show log history)
- Pagination (not implemented on any other screen yet)
- Optimistic updates on delete (use standard `queryClient.invalidateQueries` after mutation)
- `RESEARCH_PATIENT` role: treated identically to DOCTOR (read-only catalog view, no add/delete)
