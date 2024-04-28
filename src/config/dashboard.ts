import { type DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    // {
    //   title: "Documentation",
    //   href: "/docs",
    // },
  ],
  sidebarNav: [
    {
      title: "Home",
      href: "/home",
      icon: "home",
    },
    {
      title: "Tickets",
      href: "/tickets",
      icon: "ticket",
    },
    {
      title: "Users",
      href: "/users",
      icon: "user",
      managerOnly: true,
    },
    {
      title: "Flights",
      href: "/flights",
      icon: "logo",
      managerOnly: true,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
};
