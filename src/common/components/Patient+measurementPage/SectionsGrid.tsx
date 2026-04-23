import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SectionItem from "@/common/components/Patient+measurementPage/SectionItem";
import type { ISectionConfig } from "@/common/types/section";

function Section({
  title,
  icon: Icon,
  iconClassName,
  items = [],
  routeMapper,
  emptyLabel,
}: ISectionConfig) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border bg-muted/30 py-6 text-sm text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          items.map((item) => (
            <SectionItem
              key={item.id}
              item={item}
              icon={Icon}
              iconClassName={iconClassName}
              onClick={routeMapper[item.label]}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  readonly sections: ISectionConfig[];
}

export default function SectionsGrid({ sections }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {sections.map((section) => (
        <Section key={section.title} {...section} />
      ))}
    </div>
  );
}