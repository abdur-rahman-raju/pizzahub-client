import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Admin Dashboard | PizzaHub",
};

export default function AdminLayout({ children }) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}