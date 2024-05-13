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
      title: "Planes",
      href: "/planes",
      icon: "flight",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
};
