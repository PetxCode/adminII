import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  ChevronLeft,
  Menu,
  Activity,
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
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import logo from "./logo.png";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Activities",
    url: "/activities",
    icon: Activity,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Studios",
    url: "/studios",
    icon: Building2,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
 
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? "bg-[#8c0707] hover:bg-[#8c0707]/40  !text-white hover:!text-[#8c0707]"
      : "hover:bg-secondary text-muted-foreground hover:text-foreground";
  };



  return (
    <Sidebar
      className={`${
        collapsed ? "!w-24" : "w-64"
      } transition-all duration-300 border-r border-border bg-gradient-card`}
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border mb-4 pb-10">
          {!collapsed && (
            <div className="flex items-center justify-center w-full space-x-2">
              <div className="w-30 h-30  rounded-lg flex items-center justify-center">
                {/* <Building2 className="w-5 h-5 text-white" /> */}
                <img src={logo} />
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <img src={logo} />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel
            className={collapsed ? "sr-only" : ""}
          ></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(
                        item.url
                      )} flex items-center space-x-3 px-3 py-4 h-[48px] my-1 transition-all duration-300 rounded-lg  group`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
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
