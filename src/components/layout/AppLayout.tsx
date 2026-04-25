import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ children, greeting }: { children: ReactNode; greeting?: string }) {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar greeting={greeting} />
        <main className="flex-1 p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
