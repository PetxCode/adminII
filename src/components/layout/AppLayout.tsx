import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              {/* <SidebarTrigger className="text-muted-foreground hover:text-foreground" /> */}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users, studios..."
                  className="pl-10 w-80 bg-muted/50 border-0 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
              </Button>

              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div> */}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
