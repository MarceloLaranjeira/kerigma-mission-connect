import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface CrmHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function CrmHero({ eyebrow, title, description, actions }: CrmHeroProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-hero p-6 text-white shadow-elegant">
      <div className="absolute inset-0 bg-gradient-glow opacity-80" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </Card>
  );
}
