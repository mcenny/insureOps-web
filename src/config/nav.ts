import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboardIcon,
  ShieldCheckIcon,
  FileWarningIcon,
  UsersIcon,
  CreditCardIcon,
  FilesIcon,
  SettingsIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    description: "Operational overview",
  },
  {
    label: "Policies",
    href: "/policies",
    icon: ShieldCheckIcon,
    description: "Active and historical policies",
  },
  {
    label: "Claims",
    href: "/claims",
    icon: FileWarningIcon,
    description: "Claims review queue",
  },
  {
    label: "Customers",
    href: "/customers",
    icon: UsersIcon,
    description: "Customer records",
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCardIcon,
    description: "Premium payment status",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FilesIcon,
    description: "KYC and supporting documents",
  },
];

export const SECONDARY_NAV: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];
