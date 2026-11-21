"use client";

import Link from "next/link";
import { Clock, Crown, DollarSign, Loader2, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import StatusDonut from "@/components/dashboard/StatusDonut";
import { ErrorState } from "@/components/dashboard/States";
import { useApiData } from "@/lib/use-api-data";
import { formatDeliveryDate, formatPrice } from "@/lib/format";

export default function VendorOverviewPage() {
  const { data, status, error, reload } = useApiData("/api/stats/vendor");

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

  const isPremium = data.plan === "premium";

  return (
    <div>
      <PageHeader
        title="Vendor Overview"
        description="Your shop at a glance"
        action={
          <Link href="/dashboard/vendor/add-menu-item" className={buttonVariants()}>
            Add Menu Item
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Menu Items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingBag} tone="blue" />
        <StatCard label="Pending Orders" value={data.orders.pending} icon={Clock} tone="amber" />
        <StatCard label="Revenue (accepted)" value={formatPrice(data.revenue)} icon={DollarSign} tone="green" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold capitalize">{data.plan} plan</p>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "Unlimited menu items"
                : `${data.activeItems} of ${data.planLimit} active items used`}
            </p>
          </div>
        </div>
        {!isPremium && (
          <Link
            href="/dashboard/vendor/subscription"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Upgrade to Premium
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Orders by status</h2>
          <StatusDonut counts={data.orders} />
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Menu items by status</h2>
          <StatusDonut counts={data.items} />
        </section>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/dashboard/vendor/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No orders yet
          </p>
        ) : (
          <ul className="divide-y">
            {data.recentOrders.map((order) => (
              <li
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{order.itemName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} · {formatDeliveryDate(order.deliveryDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">
                    {formatPrice(order.price)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}