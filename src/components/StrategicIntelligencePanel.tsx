import { Target, Users2, BadgeCheck, ShieldAlert, TrendingUp } from "lucide-react";

/**
 * Strategic Intelligence Panel
 * - Pixel-consistent vertical alignment
 * - Equal column rhythm and responsive grid
 * - Semantic color accents for quick scanning
 * - Accessible labels, keyboard focusable controls
 */
export default function StrategicIntelligencePanel() {
  const kpis: Array<{
    id: string;
    icon: JSX.Element;
    value: string;
    label: string;
    sublabel: string;
    delta?: string;
    tone: "positive" | "neutral" | "risk";
  }> = [
    {
      id: "forecastAccuracy",
      icon: <Target className="h-5 w-5" aria-hidden />,
      value: "94.2%",
      label: "Workforce Forecast Accuracy",
      sublabel: "",
      delta: "+2.1%",
      tone: "positive",
    },
    {
      id: "pipelineStrength",
      icon: <Users2 className="h-5 w-5" aria-hidden />,
      value: "76",
      label: "Talent Pipeline Strength",
      sublabel: "high-potential candidates",
      tone: "neutral",
    },
    {
      id: "employeeScore",
      icon: <BadgeCheck className="h-5 w-5" aria-hidden />,
      value: "8.7/10",
      label: "Employee Experience Score",
      sublabel: "quarterly improvement",
      delta: "+0.3",
      tone: "positive",
    },
    {
      id: "riskIndex",
      icon: <ShieldAlert className="h-5 w-5" aria-hidden />,
      value: "12",
      label: "Predictive Risk Index",
      sublabel: "high-risk employees",
      tone: "risk",
    },
  ];

  return (
    <section className="w-full bg-surface-dark text-foreground px-6 py-10 md:px-10 rounded-2xl shadow-lg ring-1 ring-border/50">
      {/* Header */}
      <header className="mb-8">
        <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            {/* decorative brain-like glyph */}
            <span className="block h-3 w-3 rounded-full bg-primary"></span>
          </span>
          Strategic Intelligence Panel
          <span className="ml-2 align-middle rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300 ring-1 ring-inset ring-sky-500/20">
            AI Insights
          </span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-300/80">
          Predictive intelligence and advanced strategic analytics
        </p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 transition-all duration-200 hover:bg-white/10 hover:ring-1 hover:ring-white/20"
          >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-slate-200 ring-1 ring-white/10">
              {kpi.icon}
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold leading-tight text-white">
                  {kpi.value}
                </span>
                {kpi.delta && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      kpi.tone === "positive"
                        ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                        : kpi.tone === "risk"
                        ? "bg-red-500/10 text-red-300 ring-red-500/20"
                        : "bg-slate-500/10 text-slate-300 ring-slate-500/20"
                    }`}
                  >
                    <TrendingUp className="h-3 w-3" aria-hidden />
                    {kpi.delta}
                  </span>
                )}
              </div>
            </div>

            {/* Label and Sublabel */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-snug text-slate-200">
                {kpi.label}
              </h3>
              {kpi.sublabel && (
                <p className="text-xs leading-relaxed text-slate-400">
                  {kpi.sublabel}
                </p>
              )}
            </div>

            {/* Status indicator */}
            <div
              className={`absolute right-3 top-3 h-2 w-2 rounded-full ${
                kpi.tone === "positive"
                  ? "bg-emerald-400"
                  : kpi.tone === "risk"
                  ? "bg-red-400"
                  : "bg-slate-400"
              }`}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <footer className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
        <p className="text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString()} at{" "}
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
          <TrendingUp className="h-4 w-4" aria-hidden />
          View Detailed Analytics
        </button>
      </footer>
    </section>
  );
}