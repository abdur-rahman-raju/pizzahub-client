import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
  Users,
} from "lucide-react";

export const DASHBOARD_NAV = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: Settings },
  ],
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/vendor/menu-items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/vendor/add-menu-item", label: "Add Menu Item", icon: Plus },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/menu-items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/admin/profile", label: "Profile Settings", icon: Settings },
  ],
};