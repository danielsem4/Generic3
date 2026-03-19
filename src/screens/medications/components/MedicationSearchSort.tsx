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
