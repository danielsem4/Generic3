# Medications Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully role-based Medications Screen that shows different data and UI actions depending on the authenticated user's role (Admin, Clinic Manager, Doctor, Patient).

**Architecture:** A single `useMedications` hook detects the user's role, selects the correct query function from a `ROLE_CONFIG` map, runs TanStack Query, and derives `canAdd`/`canDelete`/`viewMode` flags. A shared `MedicationCard` component renders in either `catalog` or `prescription` mode depending on `viewMode`. All role logic is data; components are purely presentational.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI (Dialog), TanStack Query, Zustand, react-hook-form, Zod, react-i18next, lucide-react, Vitest + Testing Library

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/common/types/Medication.ts` | Extend | Add 3 new interfaces + `isCatalogItem` guard |
| `src/common/types/Medication.test.ts` | Create | Unit test for `isCatalogItem` |
| `src/api/medicationService.ts` | Create | 6 placeholder async functions with mock data |
| `src/screens/medications/hooks/medicationRoleConfig.ts` | Create | `SortOption`, `ViewMode`, `RoleConfig`, `ROLE_CONFIG` map |
| `src/screens/medications/hooks/useMedications.ts` | Rewrite | Role query + search/sort/delete logic |
| `src/i18n/locales/en.ts` | Extend | New `medications.*` keys |
| `src/i18n/locales/ar.ts` | Extend | Same keys in Arabic |
| `src/i18n/locales/he.ts` | Extend | Same keys in Hebrew |
| `src/i18n/locales/ru.ts` | Extend | Same keys in Russian |
| `src/screens/medications/components/MedicationSearchSort.tsx` | Create | Stateless search + sort dropdown |
| `src/screens/medications/components/MedicationCard.tsx` | Create | Unified card, `catalog` and `prescription` modes |
| `src/screens/medications/components/MedicationList.tsx` | Create | List + empty state |
| `src/screens/medications/Schema/medicationSchema.ts` | Create | Zod schema for Admin add form |
| `src/screens/medications/hooks/useAddMedicationDialog.ts` | Create | Admin add modal state + submit |
| `src/screens/medications/components/AddMedicationModal.tsx` | Create | Admin add dialog (Radix UI) |
| `src/screens/medications/hooks/useAddToClinicDialog.ts` | Create | Clinic Manager catalog picker state |
| `src/screens/medications/components/AddToClinicModal.tsx` | Create | Clinic Manager add-to-clinic dialog |
| `src/screens/medications/Medications.tsx` | Rewrite | Dumb screen container |

---

## Task 1: Extend TypeScript Types

**Files:**
- Modify: `src/common/types/Medication.ts`
- Create: `src/common/types/Medication.test.ts`

- [ ] **Step 1: Add the new interfaces and type guard**

Open `src/common/types/Medication.ts`. It currently has only `IMedication`. Replace the entire file with:

```ts
export interface IMedication {
  id: string;
  medName: string;
  medForm: string;
  medUnitOfMeasurement: string;
}

export interface IClinicMedication {
  id: string;
  clinicId: string;
  medicationId: string;
  medication: IMedication;
}

export type PrescriptionFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IPatientPrescription {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  medicationId: string;
  medName: string;
  startDate: string;
  endDate: string;
  dosage: string;
  frequency: PrescriptionFrequency;
}

// Pre-defined for future log-history feature — not rendered in this release
export type MedicationLogStatus = "TAKEN" | "SKIPPED" | "DELAYED";

export interface IPatientMedicationLog {
  id: string;
  patientMedicationId: string;
  patientId: string;
  takenAt: string;
  dosageTaken: string;
  status: MedicationLogStatus;
}

/**
 * Type guard: returns true when item is IMedication (catalog view).
 * Use "medication" in item to detect IClinicMedication.
 * Use "medForm" in item to detect IMedication vs IPatientPrescription.
 */
export function isCatalogItem(
  item: IMedication | IPatientPrescription,
): item is IMedication {
  return "medForm" in item;
}
```

- [ ] **Step 2: Write the test file**

Create `src/common/types/Medication.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { isCatalogItem } from "./Medication";
import type { IMedication, IPatientPrescription } from "./Medication";

const catalogItem: IMedication = {
  id: "1",
  medName: "Aspirin",
  medForm: "TAB",
  medUnitOfMeasurement: "MG",
};

const prescriptionItem: IPatientPrescription = {
  id: "2",
  patientId: "p1",
  clinicId: "c1",
  doctorId: "d1",
  medicationId: "1",
  medName: "Aspirin",
  startDate: "2025-01-01",
  endDate: "2025-04-01",
  dosage: "500mg",
  frequency: "DAILY",
};

describe("isCatalogItem", () => {
  it("returns true for IMedication", () => {
    expect(isCatalogItem(catalogItem)).toBe(true);
  });

  it("returns false for IPatientPrescription", () => {
    expect(isCatalogItem(prescriptionItem)).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test**

```bash
npx vitest run src/common/types/Medication.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/common/types/Medication.ts src/common/types/Medication.test.ts
git commit -m "feat: extend Medication types with IClinicMedication, IPatientPrescription, isCatalogItem guard"
```

---

## Task 2: Create Medication API Service

**Files:**
- Create: `src/api/medicationService.ts`

- [ ] **Step 1: Create the file with mock data and placeholder functions**

```ts
import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";

// ─── Mock data ───────────────────────────────────────────────────────────────

const GLOBAL_MEDICATIONS: IMedication[] = [
  { id: "1", medName: "ASPIRIN TAB 500MG", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "2", medName: "ADVIL FORTE LIQUI-GELS CAP 400mg", medForm: "CAP", medUnitOfMeasurement: "MG" },
  { id: "3", medName: "AGRIPPAL S1 VAC 10X0.5mL", medForm: "VAC", medUnitOfMeasurement: "ML" },
  { id: "4", medName: "LEVODOPA-CARBIDOPA TAB 50mg/200mg", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "5", medName: "METHYLDOPA 250MG TAB", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "6", medName: "SINEMET ORAL SUS 5mg/ml", medForm: "SUS", medUnitOfMeasurement: "ML" },
];

const CLINIC_MEDICATIONS: IClinicMedication[] = [
  { id: "cm1", clinicId: "clinic1", medicationId: "1", medication: GLOBAL_MEDICATIONS[0] },
  { id: "cm2", clinicId: "clinic1", medicationId: "3", medication: GLOBAL_MEDICATIONS[2] },
  { id: "cm3", clinicId: "clinic1", medicationId: "4", medication: GLOBAL_MEDICATIONS[3] },
];

const PATIENT_PRESCRIPTIONS: IPatientPrescription[] = [
  {
    id: "rx1", patientId: "patient1", clinicId: "clinic1", doctorId: "doc1",
    medicationId: "1", medName: "ASPIRIN TAB 500MG",
    startDate: "2025-01-01", endDate: "2025-04-01", dosage: "500mg", frequency: "DAILY",
  },
  {
    id: "rx2", patientId: "patient1", clinicId: "clinic1", doctorId: "doc1",
    medicationId: "4", medName: "LEVODOPA-CARBIDOPA TAB",
    startDate: "2025-02-01", endDate: "2025-08-01", dosage: "200mg", frequency: "WEEKLY",
  },
];

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchAllGlobalMedications(): Promise<IMedication[]> {
  return Promise.resolve(GLOBAL_MEDICATIONS);
}

export async function fetchClinicMedications(
  _clinicId: string,
): Promise<IClinicMedication[]> {
  return Promise.resolve(CLINIC_MEDICATIONS);
}

export async function fetchPatientPrescriptions(
  _patientId: string,
): Promise<IPatientPrescription[]> {
  return Promise.resolve(PATIENT_PRESCRIPTIONS);
}

export async function addGlobalMedication(data: {
  medName: string;
  medForm: string;
  medUnit: string;
}): Promise<IMedication> {
  const newMed: IMedication = {
    id: String(Date.now()),
    medName: data.medName,
    medForm: data.medForm,
    medUnitOfMeasurement: data.medUnit,
  };
  return Promise.resolve(newMed);
}

export async function addMedicationToClinic(
  clinicId: string,
  medicationId: string,
): Promise<IClinicMedication> {
  const med = GLOBAL_MEDICATIONS.find((m) => m.id === medicationId);
  if (!med) throw new Error("Medication not found");
  return Promise.resolve({
    id: String(Date.now()),
    clinicId,
    medicationId,
    medication: med,
  });
}

export async function removeMedicationFromClinic(
  _clinicId: string,
  _medicationId: string,
): Promise<void> {
  return Promise.resolve();
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/medicationService.ts
git commit -m "feat: add medicationService with placeholder API functions and mock data"
```

---

## Task 3: Create Role Config

**Files:**
- Create: `src/screens/medications/hooks/medicationRoleConfig.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/screens/medications/hooks
```

Create `src/screens/medications/hooks/medicationRoleConfig.ts`:

```ts
import type { UserRole } from "@/common/types/Role";
import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";
import {
  fetchAllGlobalMedications,
  fetchClinicMedications,
  fetchPatientPrescriptions,
} from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";

export type SortOption = "az" | "za" | "form";
export type ViewMode = "catalog" | "prescription";

export type MedicationItem = IMedication | IClinicMedication | IPatientPrescription;

export interface RoleConfig {
  queryFn: () => Promise<MedicationItem[]>;
  viewMode: ViewMode;
  canAdd: boolean;
  canDelete: boolean;
  sortOptions: SortOption[];
}

/**
 * Returns query function bound to the current auth store IDs.
 * Must be called inside a React component/hook (reads Zustand store).
 */
export function buildRoleConfig(role: UserRole): RoleConfig {
  const clinicId = useAuthStore.getState().clinicId ?? "";
  const userId = useAuthStore.getState().userId ?? "";

  const configs: Record<UserRole, RoleConfig> = {
    ADMIN: {
      queryFn: fetchAllGlobalMedications,
      viewMode: "catalog",
      canAdd: true,
      canDelete: false,
      sortOptions: ["az", "za", "form"],
    },
    CLINIC_MANAGER: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      canAdd: true,
      canDelete: true,
      sortOptions: ["az", "za", "form"],
    },
    DOCTOR: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      canAdd: false,
      canDelete: false,
      sortOptions: ["az", "za", "form"],
    },
    PATIENT: {
      queryFn: () => fetchPatientPrescriptions(userId),
      viewMode: "prescription",
      canAdd: false,
      canDelete: false,
      sortOptions: ["az", "za"],
    },
    RESEARCH_PATIENT: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      canAdd: false,
      canDelete: false,
      sortOptions: ["az", "za", "form"],
    },
  };

  return configs[role];
}

export const SORT_LABEL_KEYS: Record<SortOption, string> = {
  az: "medications.sortAZ",
  za: "medications.sortZA",
  form: "medications.sortForm",
};
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/medications/hooks/medicationRoleConfig.ts
git commit -m "feat: add medicationRoleConfig with ROLE_CONFIG map and sort option labels"
```

---

## Task 4: Rewrite `useMedications` Hook

**Files:**
- Rewrite: `src/screens/medications/hooks/useMedications.ts`

- [ ] **Step 1: Write the hook**

Replace the entire contents of `src/screens/medications/hooks/useMedications.ts`:

```ts
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/hooks/common/useRole";
import { useAuthStore } from "@/store/useAuthStore";
import { removeMedicationFromClinic } from "@/api/medicationService";
import type { IClinicMedication } from "@/common/types/Medication";
import {
  buildRoleConfig,
  type SortOption,
  type ViewMode,
  type MedicationItem,
} from "./medicationRoleConfig";

function getItemName(item: MedicationItem): string {
  if ("medication" in item) return item.medication.medName;
  return item.medName;
}

function getItemForm(item: MedicationItem): string {
  if ("medication" in item) return item.medication.medForm;
  if ("medForm" in item) return item.medForm;
  return "";
}

const EMPTY_STATE = {
  filteredMedications: [] as MedicationItem[],
  totalCount: 0,
  isLoading: false,
  error: null as Error | null,
  canAdd: false,
  canDelete: false,
  viewMode: "catalog" as ViewMode,
  sortOptions: [] as SortOption[],
  searchTerm: "",
  sortOption: "az" as SortOption,
  handleSearchChange: (_e: React.ChangeEvent<HTMLInputElement>) => {},
  handleSortChange: (_v: SortOption) => {},
  handleDelete: (_item: IClinicMedication) => {},
};

export function useMedications() {
  const role = useRole();
  const clinicId = useAuthStore((s) => s.clinicId);
  const userId = useAuthStore((s) => s.userId);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("az");

  const config = role ? buildRoleConfig(role) : null;

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["medications", role, clinicId ?? userId],
    queryFn: config?.queryFn ?? (() => Promise.resolve([])),
    enabled: !!role && (!!clinicId || !!userId),
  });

  if (!role || !config) return EMPTY_STATE;

  const filtered = data.filter((item) =>
    getItemName(item).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "form") {
      return getItemForm(a).localeCompare(getItemForm(b));
    }
    const nameA = getItemName(a);
    const nameB = getItemName(b);
    return sortOption === "az"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
  };

  const handleDelete = async (item: IClinicMedication) => {
    await removeMedicationFromClinic(item.clinicId, item.medicationId);
    queryClient.invalidateQueries({ queryKey: ["medications"] });
  };

  return {
    filteredMedications: sorted,
    totalCount: data.length,
    isLoading,
    error: error as Error | null,
    canAdd: config.canAdd,
    canDelete: config.canDelete,
    viewMode: config.viewMode,
    sortOptions: config.sortOptions,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleDelete,
  };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/medications/hooks/useMedications.ts
git commit -m "feat: rewrite useMedications hook with role-based query, search, sort, and delete"
```

---

## Task 5: Add i18n Keys to All 4 Locale Files

**Files:**
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/i18n/locales/ar.ts`
- Modify: `src/i18n/locales/he.ts`
- Modify: `src/i18n/locales/ru.ts`

The existing `medications` block in each file (lines ~197-204) has 5 keys. Replace the entire block in each file with the expanded version below.

- [ ] **Step 1: Update `src/i18n/locales/en.ts`**

Find the existing `medications: {` block (around line 197) and replace it:

```ts
  // Medications
  medications: {
    title: "Medications",
    allMedications: "All Medications",
    searchPlaceholder: "Search for a medication...",
    sort: "Sort",
    noData: "No matching medications found",
    addNew: "Add New Medication",
    addToClinic: "Add Medication to Clinic",
    sortAZ: "A → Z",
    sortZA: "Z → A",
    sortForm: "By Form",
    medNameLabel: "Medication Name",
    medFormLabel: "Form",
    medUnitLabel: "Unit",
    medNamePlaceholder: "",
    dosage: "Dosage",
    frequency: "Frequency",
    startDate: "Start",
    endDate: "End",
    registerButton: "Add",
    registerTitle: "Add New Medication",
    addToClinicTitle: "Add Medication to Clinic",
    searchGlobal: "Search global catalog...",
    confirm: "Confirm",
    errMedName: "Medication name is required",
    freq: {
      ONCE: "Once",
      DAILY: "Daily",
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
    },
  },
```

- [ ] **Step 2: Update `src/i18n/locales/ar.ts`**

Find and replace the `medications:` block:

```ts
  // Medications
  medications: {
    title: "الأدوية",
    allMedications: "جميع الأدوية",
    searchPlaceholder: "البحث عن دواء...",
    sort: "فرز",
    noData: "لم يتم العثور على أدوية مطابقة",
    addNew: "إضافة دواء جديد",
    addToClinic: "إضافة دواء إلى العيادة",
    sortAZ: "أ → ي",
    sortZA: "ي → أ",
    sortForm: "حسب الشكل",
    medNameLabel: "اسم الدواء",
    medFormLabel: "الشكل",
    medUnitLabel: "الوحدة",
    medNamePlaceholder: "",
    dosage: "الجرعة",
    frequency: "التكرار",
    startDate: "البداية",
    endDate: "النهاية",
    registerButton: "إضافة",
    registerTitle: "إضافة دواء جديد",
    addToClinicTitle: "إضافة دواء إلى العيادة",
    searchGlobal: "البحث في الكتالوج العالمي...",
    confirm: "تأكيد",
    errMedName: "اسم الدواء مطلوب",
    freq: {
      ONCE: "مرة واحدة",
      DAILY: "يومياً",
      WEEKLY: "أسبوعياً",
      MONTHLY: "شهرياً",
    },
  },
```

- [ ] **Step 3: Update `src/i18n/locales/he.ts`**

Find and replace the `medications:` block:

```ts
  // Medications
  medications: {
    title: "תרופות",
    allMedications: "כל התרופות",
    searchPlaceholder: "חיפוש תרופה...",
    sort: "מיון",
    noData: "לא נמצאו תרופות מתאימות",
    addNew: "הוסף תרופה חדשה",
    addToClinic: "הוסף תרופה למרפאה",
    sortAZ: "א → ת",
    sortZA: "ת → א",
    sortForm: "לפי צורה",
    medNameLabel: "שם התרופה",
    medFormLabel: "צורה",
    medUnitLabel: "יחידה",
    medNamePlaceholder: "",
    dosage: "מינון",
    frequency: "תדירות",
    startDate: "התחלה",
    endDate: "סיום",
    registerButton: "הוסף",
    registerTitle: "הוסף תרופה חדשה",
    addToClinicTitle: "הוסף תרופה למרפאה",
    searchGlobal: "חיפוש בקטלוג הגלובלי...",
    confirm: "אישור",
    errMedName: "שם התרופה הוא שדה חובה",
    freq: {
      ONCE: "פעם אחת",
      DAILY: "יומי",
      WEEKLY: "שבועי",
      MONTHLY: "חודשי",
    },
  },
```

- [ ] **Step 4: Update `src/i18n/locales/ru.ts`**

Find and replace the `medications:` block:

```ts
  // Medications
  medications: {
    title: "Лекарства",
    allMedications: "Все лекарства",
    searchPlaceholder: "Поиск лекарства...",
    sort: "Сортировка",
    noData: "Не найдено подходящих лекарств",
    addNew: "Добавить новое лекарство",
    addToClinic: "Добавить лекарство в клинику",
    sortAZ: "А → Я",
    sortZA: "Я → А",
    sortForm: "По форме",
    medNameLabel: "Название лекарства",
    medFormLabel: "Форма",
    medUnitLabel: "Единица",
    medNamePlaceholder: "",
    dosage: "Дозировка",
    frequency: "Частота",
    startDate: "Начало",
    endDate: "Конец",
    registerButton: "Добавить",
    registerTitle: "Добавить новое лекарство",
    addToClinicTitle: "Добавить лекарство в клинику",
    searchGlobal: "Поиск в глобальном каталоге...",
    confirm: "Подтвердить",
    errMedName: "Название лекарства обязательно",
    freq: {
      ONCE: "Однократно",
      DAILY: "Ежедневно",
      WEEKLY: "Еженедельно",
      MONTHLY: "Ежемесячно",
    },
  },
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locales/en.ts src/i18n/locales/ar.ts src/i18n/locales/he.ts src/i18n/locales/ru.ts
git commit -m "feat: add new medications i18n keys (add, sort, form fields, frequency, prescription) to all 4 locales"
```

---

## Task 6: Create `MedicationSearchSort` Component

**Files:**
- Create: `src/screens/medications/components/MedicationSearchSort.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/screens/medications/components
```

Create `src/screens/medications/components/MedicationSearchSort.tsx`:

```tsx
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { SORT_LABEL_KEYS, type SortOption } from "../hooks/medicationRoleConfig";

interface Props {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  sortOptions: SortOption[];
}

export function MedicationSearchSort({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  sortOptions,
}: Props) {
  const { t } = useTranslation();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption);
  };

  return (
    <div className="flex gap-3">
      <select
        value={sortOption}
        onChange={handleSelectChange}
        className="bg-card px-4 py-2 rounded-md border border-border text-sm shadow-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            {t(SORT_LABEL_KEYS[opt])}
          </option>
        ))}
      </select>

      <div className="relative flex-1">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={t("medications.searchPlaceholder")}
          className="w-full pr-12 h-12 bg-card border-border shadow-sm focus-visible:ring-primary"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/medications/components/MedicationSearchSort.tsx
git commit -m "feat: add MedicationSearchSort component with sort dropdown and search input"
```

---

## Task 7: Create `MedicationCard` Component

**Files:**
- Create: `src/screens/medications/components/MedicationCard.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Pill, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { isCatalogItem } from "@/common/types/Medication";
import type { IMedication, IPatientPrescription, PrescriptionFrequency } from "@/common/types/Medication";
import type { ViewMode } from "../hooks/medicationRoleConfig";

interface Props {
  item: IMedication | IPatientPrescription;
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete?: () => void;
}

const FREQ_KEYS: Record<PrescriptionFrequency, string> = {
  ONCE: "medications.freq.ONCE",
  DAILY: "medications.freq.DAILY",
  WEEKLY: "medications.freq.WEEKLY",
  MONTHLY: "medications.freq.MONTHLY",
};

export function MedicationCard({ item, viewMode, canDelete, onDelete }: Props) {
  const { t } = useTranslation();

  if (viewMode === "catalog" && isCatalogItem(item)) {
    return (
      <Card className="bg-card hover:shadow-md transition-shadow border-border">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Pill size={18} className="text-primary rotate-45 shrink-0" />
            <span className="font-semibold text-foreground truncate">{item.medName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
              {item.medForm}
            </span>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded">
              {item.medUnitOfMeasurement}
            </span>
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                aria-label="Remove medication"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // prescription mode — item is IPatientPrescription
  if (!isCatalogItem(item)) {
    return (
      <Card className="bg-card hover:shadow-md transition-shadow border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Pill size={18} className="text-primary rotate-45 shrink-0" />
            <span className="font-semibold text-foreground">{item.medName}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>
              {t("medications.dosage")}: <span className="text-foreground font-medium">{item.dosage}</span>
            </span>
            <span>
              {t("medications.frequency")}: <span className="text-foreground font-medium">{t(FREQ_KEYS[item.frequency])}</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t("medications.startDate")}: {item.startDate} → {t("medications.endDate")}: {item.endDate}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/medications/components/MedicationCard.tsx
git commit -m "feat: add MedicationCard with catalog and prescription view modes"
```

---

## Task 8: Create `MedicationList` Component

**Files:**
- Create: `src/screens/medications/components/MedicationList.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Pill } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MedicationCard } from "./MedicationCard";
import type { ViewMode, MedicationItem } from "../hooks/medicationRoleConfig";
import type { IMedication, IClinicMedication, IPatientPrescription } from "@/common/types/Medication";

interface Props {
  medications: MedicationItem[];
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete: (item: IClinicMedication) => void;
  totalCount: number;
}

function getDisplayItem(item: MedicationItem): IMedication | IPatientPrescription {
  if ("medication" in item) return item.medication;
  return item as IMedication | IPatientPrescription;
}

export function MedicationList({ medications, viewMode, canDelete, onDelete, totalCount }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Pill className="text-primary rotate-45" size={22} />
        <span>{t("medications.allMedications")} ({totalCount})</span>
      </div>

      <div className="space-y-2">
        {medications.map((item, index) => {
          const displayItem = getDisplayItem(item);
          const handleDelete =
            canDelete && "medication" in item
              ? () => onDelete(item as IClinicMedication)
              : undefined;

          return (
            <MedicationCard
              key={displayItem.id || index}
              item={displayItem}
              viewMode={viewMode}
              canDelete={canDelete}
              onDelete={handleDelete}
            />
          );
        })}

        {medications.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
            {t("medications.noData")}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/medications/components/MedicationList.tsx
git commit -m "feat: add MedicationList with IClinicMedication normalization and empty state"
```

---

## Task 9: Admin — Schema, Dialog Hook, and Modal

**Files:**
- Create: `src/screens/medications/Schema/medicationSchema.ts`
- Create: `src/screens/medications/hooks/useAddMedicationDialog.ts`
- Create: `src/screens/medications/components/AddMedicationModal.tsx`

- [ ] **Step 1: Create the Zod schema**

```bash
mkdir -p src/screens/medications/Schema
```

Create `src/screens/medications/Schema/medicationSchema.ts`:

```ts
import * as z from "zod";

export const medicationSchema = z.object({
  medName: z.string().min(1, "medications.errMedName"),
  medForm: z.string().min(1),
  medUnit: z.string().min(1),
});

export type MedicationFormValues = z.infer<typeof medicationSchema>;
```

- [ ] **Step 2: Create the dialog hook**

Create `src/screens/medications/hooks/useAddMedicationDialog.ts`:

```ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { addGlobalMedication } from "@/api/medicationService";
import { medicationSchema, type MedicationFormValues } from "../Schema/medicationSchema";

export function useAddMedicationDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { medName: "", medForm: "", medUnit: "" },
    mode: "onChange",
  });

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) form.reset();
  };

  const onSubmit = async (data: MedicationFormValues) => {
    setIsSubmitting(true);
    try {
      await addGlobalMedication(data);
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      form.reset();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { open, form, isSubmitting, handleClose, onSubmit };
}
```

- [ ] **Step 3: Create the modal component**

Create `src/screens/medications/components/AddMedicationModal.tsx`:

```tsx
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAddMedicationDialog } from "../hooks/useAddMedicationDialog";

const MED_FORMS = ["TAB", "CAP", "GEL", "SUS", "VAC", "INJ", "CRE", "OIN", "DRO", "SPR"];
const MED_UNITS = ["MG", "ML", "MCG", "IU", "MEQ", "G"];

export function AddMedicationModal() {
  const { t } = useTranslation();
  const { open, form, isSubmitting, handleClose, onSubmit } = useAddMedicationDialog();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm">
          <PlusCircle size={18} /> {t("medications.addNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground mb-4">
            {t("medications.registerTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-foreground">
              {t("medications.medNameLabel")} <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("medName")}
              placeholder={t("medications.medNamePlaceholder")}
              className={errors.medName ? "border-destructive" : "border-border"}
            />
            {errors.medName && (
              <p className="text-[10px] text-destructive font-medium">
                {t(errors.medName.message as string)}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label className="font-bold text-foreground">{t("medications.medFormLabel")}</Label>
              <select
                {...register("medForm")}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">—</option>
                {MED_FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-1.5 flex-1">
              <Label className="font-bold text-foreground">{t("medications.medUnitLabel")}</Label>
              <select
                {...register("medUnit")}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">—</option>
                {MED_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-2"
          >
            {t("medications.registerButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/screens/medications/Schema/medicationSchema.ts src/screens/medications/hooks/useAddMedicationDialog.ts src/screens/medications/components/AddMedicationModal.tsx
git commit -m "feat: add Admin AddMedicationModal with Zod schema, form validation, and dialog hook"
```

---

## Task 10: Clinic Manager — Add-to-Clinic Dialog Hook and Modal

**Files:**
- Create: `src/screens/medications/hooks/useAddToClinicDialog.ts`
- Create: `src/screens/medications/components/AddToClinicModal.tsx`

- [ ] **Step 1: Create the hook**

Create `src/screens/medications/hooks/useAddToClinicDialog.ts`:

```ts
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  fetchAllGlobalMedications,
  addMedicationToClinic,
} from "@/api/medicationService";
import type { IMedication } from "@/common/types/Medication";

export function useAddToClinicDialog() {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clinicId = useAuthStore((s) => s.clinicId) ?? "";
  const queryClient = useQueryClient();

  const { data: globalMeds = [], isLoading } = useQuery({
    queryKey: ["medications", "global"],
    queryFn: fetchAllGlobalMedications,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const filteredGlobal = globalMeds.filter((m: IMedication) =>
    m.medName.toLowerCase().includes(localSearch.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelected(new Set());
      setLocalSearch("");
    }
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const onConfirm = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        [...selected].map((medId) => addMedicationToClinic(clinicId, medId)),
      );
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      handleClose(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    open,
    handleClose,
    localSearch,
    handleLocalSearchChange,
    filteredGlobal,
    selected,
    toggleSelect,
    isSubmitting,
    isLoading,
    onConfirm,
  };
}
```

- [ ] **Step 2: Create the modal component**

Create `src/screens/medications/components/AddToClinicModal.tsx`:

```tsx
import { PlusCircle, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddToClinicDialog } from "../hooks/useAddToClinicDialog";

export function AddToClinicModal() {
  const { t } = useTranslation();
  const {
    open, handleClose,
    localSearch, handleLocalSearchChange,
    filteredGlobal, selected, toggleSelect,
    isSubmitting, isLoading, onConfirm,
  } = useAddToClinicDialog();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm">
          <PlusCircle size={18} /> {t("medications.addToClinic")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground mb-2">
            {t("medications.addToClinicTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={handleLocalSearchChange}
            placeholder={t("medications.searchGlobal")}
            className="pl-9 border-border"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-md p-2">
          {isLoading && (
            <p className="text-center text-muted-foreground text-sm py-4">{t("home.loading")}</p>
          )}
          {filteredGlobal.map((med) => (
            <label
              key={med.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(med.id)}
                onChange={() => toggleSelect(med.id)}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">{med.medName}</span>
              <span className="ml-auto text-xs text-muted-foreground">{med.medForm}</span>
            </label>
          ))}
          {!isLoading && filteredGlobal.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">{t("medications.noData")}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => handleClose(false)}>
            {t("nav.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selected.size === 0 || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t("medications.confirm")} {selected.size > 0 && `(${selected.size})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/screens/medications/hooks/useAddToClinicDialog.ts src/screens/medications/components/AddToClinicModal.tsx
git commit -m "feat: add Clinic Manager AddToClinicModal with multi-select from global catalog"
```

---

## Task 11: Rewrite `Medications.tsx` Screen Container

**Files:**
- Rewrite: `src/screens/medications/Medications.tsx`

- [ ] **Step 1: Rewrite the screen**

Replace the entire file:

```tsx
import { useTranslation } from "react-i18next";
import { useRole } from "@/hooks/common/useRole";
import { useMedications } from "./hooks/useMedications";
import { MedicationSearchSort } from "./components/MedicationSearchSort";
import { MedicationList } from "./components/MedicationList";
import { AddMedicationModal } from "./components/AddMedicationModal";
import { AddToClinicModal } from "./components/AddToClinicModal";

export default function Medications() {
  const { t } = useTranslation();
  const role = useRole();
  const {
    filteredMedications,
    totalCount,
    isLoading,
    error,
    canAdd,
    canDelete,
    viewMode,
    sortOptions,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleDelete,
  } = useMedications();

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground font-medium">
        {t("home.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-destructive font-medium">
        {t("home.error")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {t("medications.title")}
            </h1>
          </div>
          {canAdd && role === "ADMIN" && <AddMedicationModal />}
          {canAdd && role === "CLINIC_MANAGER" && <AddToClinicModal />}
        </div>

        <MedicationSearchSort
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />

        <MedicationList
          medications={filteredMedications}
          viewMode={viewMode}
          canDelete={canDelete}
          onDelete={handleDelete}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run all tests**

```bash
npm run test -- --run
```

Expected: All tests pass.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 5: Start the dev server and manually verify**

```bash
npm run dev
```

Navigate to `/medications` and verify:

| Role | Expected |
|---|---|
| ADMIN | Sees global catalog. "Add New Medication" button opens 3-field form. No delete icons. |
| CLINIC_MANAGER | Sees clinic subset. "Add Medication to Clinic" opens catalog picker. Trash icon on each card. |
| DOCTOR | Sees clinic subset. No add button. No delete icons. |
| PATIENT | Sees prescriptions with dosage/frequency/dates. No add or delete. |

Sort dropdown should show A→Z, Z→A, and By Form for all roles except PATIENT (only A→Z and Z→A).

- [ ] **Step 6: Final commit**

```bash
git add src/screens/medications/Medications.tsx
git commit -m "feat: rewrite Medications screen as dumb container with full role-based rendering"
```
