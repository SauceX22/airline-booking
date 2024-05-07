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
      adminOnly: true,
    },
    {
      title: "Flights",
      href: "/flights",
      icon: "logo",
      adminOnly: true,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
};
