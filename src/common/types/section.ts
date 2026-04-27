export interface ISectionItem {
  id: number | string;
  label: string;
}

export type ISectionRouteMapper = Record<string, (() => void) | undefined>;

export interface ISectionConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  items?: ISectionItem[];
  routeMapper: ISectionRouteMapper;
  editLabel: string;
  enableLabel: string;
  emptyLabel: string;
}