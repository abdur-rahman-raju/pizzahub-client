"use client";

import Link from "next/link";
import {
  DollarSign,
  Loader2,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusDonut from "@/components/dashboard/StatusDonut";
import { ErrorState } from "@/components/dashboard/States";
import { useApiData } from "@/lib/use-api-data";
import { formatPrice } from "@/lib/format";

export default function AdminOverviewPage() {
  const { data, status, error, reload } = useApiData("/api/admin/stats");

  if (status === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform activity at a glance" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard label="Vendors" value={data.users.vendor} icon={Store} tone="blue" />
        <StatCard label="Menu Items" value={data.totalItems} icon={UtensilsCrossed} tone="amber" />
        <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingBag} tone="gray" />
        <StatCard label="Premium Revenue" value={formatPrice(data.revenue)} icon={DollarSign} tone="green" />
        <StatCard label="Customers" value={data.users.customer} icon={Users} tone="primary" />
      </div>

      {data.items.pending > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            {data.items.pending} menu item{data.items.pending > 1 ? "s" : ""} waiting for your review
          </p>
          <Link
            href="/dashboard/admin/menu-items"
            className={buttonVariants({ size: "sm" })}
          >
            Review now
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Menu items by status</h2>
          <StatusDonut counts={data.items} />
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Orders by status</h2>
          <StatusDonut counts={data.orders} />
        </section>
      </div>
    </div>
  );
}