"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ShoppingBag, XCircle } from "lucide-react";
import { useApiData } from "@/lib/use-api-data";
import { formatDeliveryDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import StatusDonut from "@/components/dashboard/StatusDonut";
import { EmptyState, ErrorState } from "@/components/dashboard/States";

export default function CustomerOverviewPage() {
  const { data: orders, status, error, reload } = useApiData("/api/orders/mine");

  const counts = { pending: 0, accepted: 0, rejected: 0, cancelled: 0 };
  (orders || []).forEach((order) => {
    if (counts[order.status] !== undefined) counts[order.status] += 1;
  });

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A quick look at your pizza orders"
        action={
          <Link href="/menu" className={buttonVariants()}>
            Order Pizza
          </Link>
        }
      />

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} tone="primary" />
            <StatCard label="Pending" value={counts.pending} icon={Clock} tone="amber" />
            <StatCard label="Accepted" value={counts.accepted} icon={CheckCircle2} tone="green" />
            <StatCard label="Rejected" value={counts.rejected} icon={XCircle} tone="red" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-2 font-semibold">Orders by status</h2>
              <StatusDonut counts={counts} />
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Recent orders</h2>
                <Link
                  href="/dashboard/customer/orders"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Browse the menu and place your first order."
                  action={
                    <Link href="/menu" className={buttonVariants({ size: "sm" })}>
                      Browse Menu
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y">
                  {orders.slice(0, 5).map((order) => (
                    <li
                      key={order._id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {order.item?.itemName || "Item no longer available"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Delivery: {formatDeliveryDate(order.deliveryDate)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}