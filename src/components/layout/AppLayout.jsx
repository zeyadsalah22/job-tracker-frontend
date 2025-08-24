import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import FloatingChatBot from "../robot/FloatingChatBot";

export function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
      <FloatingChatBot />
    </SidebarProvider>
  );
}
