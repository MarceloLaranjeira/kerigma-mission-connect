import { LucideIcon, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "accent";
}

const toneMap = {
  primary: "from-primary to-primary-glow",
  success: "from-success to-success",
  warning: "from-warning to-accent",
  accent: "from-accent to-primary-glow",
};

export function KpiCard({ label, value, delta, icon: Icon, tone = "primary" }: Props) {
  return (
    <Card className="p-5 bg-gradient-card border-border/60 shadow-card hover:shadow-elegant transition-smooth">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          {delta && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUp className="h-3 w-3" /> {delta}
              <span className="text-muted-foreground font-normal ml-1">vs mês anterior</span>
            </p>
          )}
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center shadow-elegant`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}
