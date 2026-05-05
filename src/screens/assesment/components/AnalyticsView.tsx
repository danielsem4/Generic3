import { useTranslation } from "react-i18next";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";
import { Award, Target, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "../hooks/useAnalytics";
import { StatCard } from "./AnalyticsCards";

export const AnalyticsView = ({ answers }: { answers: IMeasurementSubmissionAnswerRaw[] }) => {
  const { t } = useTranslation();
  const { avgGrade, passRate, distributionData, pieData, total, passedCount, failedCount } = useAnalytics(answers);

  return (
    <div className="p-8 space-y-6 bg-card" dir="ltr">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t("measurements.analytics.avg_grade")} value={`${avgGrade}%`} icon={Award} colorClass="bg-primary/10" iconColor="text-primary" />
        <StatCard title={t("measurements.analytics.passed")} value={passedCount} subValue={`/ ${total}`} icon={Target} colorClass="bg-success/10" iconColor="text-success" />
        <StatCard title={t("measurements.analytics.needs_improvement")} value={failedCount} subValue={t("measurements.analytics.questions")} icon={TrendingDown} colorClass="bg-destructive/10" iconColor="text-destructive" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="md:col-span-3 border-border shadow-sm bg-background/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{t("measurements.analytics.grade_distribution")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 0.5)" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ backgroundColor: "oklch(var(--card))", border: "1px solid oklch(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                  {distributionData.map((entry) => <Cell key={entry.range} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border shadow-sm bg-background/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{t("measurements.analytics.pass_fail_ratio")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0 flex flex-col items-center">
            <div className="relative w-full h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={75} outerRadius={95} paddingAngle={5} dataKey="value" startAngle={90} endAngle={-270}>
                    {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-foreground">{passRate}%</span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2">{t("measurements.analytics.passed_label")}</span>
              </div>
            </div>
            <div className="flex gap-6 pb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground"><div className="w-3 h-3 rounded-full bg-success" /> {t("measurements.analytics.pass")}</div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground"><div className="w-3 h-3 rounded-full bg-destructive" /> {t("measurements.analytics.fail")}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};