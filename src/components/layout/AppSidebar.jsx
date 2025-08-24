import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Target,
  Calendar,
  Briefcase,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";

const trackerItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "User Companies", url: "/user-companies", icon: Building2 },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Questions", url: "/questions", icon: HelpCircle },
];

const mainItems = [
  { title: "Companies", url: "/companies", icon: Building2 },
  { title: "Resume Matching", url: "/resume-matching", icon: Target },
  { title: "Interviews", url: "/interviews", icon: Calendar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isTrackerOpen, setIsTrackerOpen] = useState(
    trackerItems.some((item) => currentPath === item.url)
  );

  const isCollapsed = state === "collapsed";
  const isActive = (path) => currentPath === path;
  const isTrackerActive = trackerItems.some((item) => currentPath === item.url);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className="flex items-center justify-center p-4 border-b bg-primary">
          {isCollapsed ? (
            <img src="/logo_white2.png" className="w-8 h-8" alt="Logo" />
          ) : (
            <img src="/logo_white.png" className="w-32" alt="Job Lander" />
          )}
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={isCollapsed ? "hidden" : "block"}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Tracker Section */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsTrackerOpen(!isTrackerOpen)}
                  className={`flex items-center justify-between ${isTrackerActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-900 hover:bg-muted/50'}`}
                  asChild={false}
                  tooltip={isCollapsed ? "Tracker" : undefined}
                >
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span>Tracker</span>}
                  </div>
                  {!isCollapsed && (
                    isTrackerOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </SidebarMenuButton>
                {isTrackerOpen && !isCollapsed && (
                  <SidebarMenuSub>
                    {trackerItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={item.url}
                            className={isActive(item.url) ? "bg-primary/10 text-primary font-medium" : "text-gray-900 hover:bg-muted/50 hover:text-foreground"}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Main Items */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <Link
                      to={item.url}
                      className={isActive(item.url) ? "bg-primary/10 text-primary font-medium" : "text-gray-900 hover:bg-muted/50 hover:text-foreground"}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
