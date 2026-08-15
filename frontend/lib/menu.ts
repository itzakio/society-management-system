import type { ComponentType, SVGProps } from "react";
import { LayoutDashboard, BookOpen } from "lucide-react";

export interface MenuItem {
  title: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Booked List",
    icon: BookOpen,
    children: [
      {
        title: "Reserved Booking",
        href: "/dashboard/booked-list/reserved",
      },
      {
        title: "Booking Request",
        href: "/dashboard/booked-list/request",
      },
      {
        title: "Overdue booking",
        href: "/dashboard/booked-list/overdue",
      },
      {
        title: "Cancel booking",
        href: "/dashboard/booked-list/cancelled",
      },
    ],
  },
];
