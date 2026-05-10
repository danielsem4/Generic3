import { useAnalyticsPage } from "./hooks/useAnalyticsPage";

function Analytics() {
  const { title, description } = useAnalyticsPage();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

export default Analytics;
