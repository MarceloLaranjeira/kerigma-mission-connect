import { type ReactNode } from "react";

interface CrmHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function CrmHero({ actions }: CrmHeroProps) {
  if (!actions) return null;
  return <div className="flex justify-end">{actions}</div>;
}
