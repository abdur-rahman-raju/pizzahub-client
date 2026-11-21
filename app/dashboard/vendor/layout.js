import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Vendor Dashboard | PizzaHub",
};

export default function VendorLayout({ children }) {
  return <DashboardShell role="vendor">{children}</DashboardShell>;
}