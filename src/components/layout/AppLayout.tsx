import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ children, greeting }: { children: ReactNode; greeting?: string }) {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_32%)]" />
        <Topbar greeting={greeting} />
        <main className="relative flex-1 space-y-6 p-6">{children}</main>
      </div>
    </div>
  );
}
