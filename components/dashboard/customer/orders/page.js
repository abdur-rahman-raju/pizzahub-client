"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pizza } from "lucide-react";
import { apiRequest } from "@/lib/api-private";
import { useApiData } from "@/lib/use-api-data";
import { formatDate, formatDeliveryDate } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import OrderDetailsDialog from "@/components/dashboard/OrderDetailsDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/dashboard/States";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"];

function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Pizza className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-xl object-cover"
    />
  );
}

export default function CustomerOrdersPage() {
  const { data: orders, setData, status, error, reload } = useApiData("/api/orders/mine");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const visible = (orders || []).filter((o) => filter === "all" || o.status === filter);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await apiRequest(`/api/orders/${cancelTarget._id}/cancel`, { method: "PATCH" });
      setData((prev) =>
        prev.map((o) => (o._id === cancelTarget._id ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order cancelled");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
      if (err.status === 409) {
        setCancelTarget(null);
        reload();
      }
    } finally {
      setCancelling(false);
    }
  };

  const handlePay = () => {
    toast("This is a demo button. Stripe payment is used only for vendor subscriptions.");
  };

  return (
    <div>
      <PageHeader title="My Orders" description="Track and manage all your pizza orders" />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === name
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-primary/50"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && visible.length === 0 && (
        <EmptyState
          title={filter === "all" ? "No orders yet" : `No ${filter} orders`}
          description="Browse the menu and place an order."
          action={
            <Link href="/menu" className={buttonVariants({ size: "sm" })}>
              Browse Menu
            </Link>
          }
        />
      )}

      {status === "success" && visible.length > 0 && (
        <div className="space-y-4">
          {visible.map((order) => {
            const item = order.item?.itemName ? order.item : null;
            const vendorName =
              order.vendor?.businessName || order.vendor?.name || "Unknown vendor";

            return (
              <div
                key={order._id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <Thumb src={item?.images?.[0]} alt={item?.itemName || "Item"} />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item ? (
                      <Link
                        href={`/menu/${item._id}`}
                        className="truncate font-semibold hover:text-primary"
                      >
                        {item.itemName}
                      </Link>
                    ) : (
                      <span className="font-semibold">Item no longer available</span>
                    )}
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">Sold by {vendorName}</p>
                  <p className="text-sm text-muted-foreground">
                    Delivery on {formatDeliveryDate(order.deliveryDate)} · {order.deliveryAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col">
                  <Button variant="outline" size="sm" onClick={() => setSelected(order)}>
                    View Details
                  </Button>
                  {order.status === "pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCancelTarget(order)}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status === "accepted" && (
                    <Button size="sm" onClick={handlePay}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OrderDetailsDialog
        order={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel this order?"
        description="This cannot be undone. Only pending orders can be cancelled."
        confirmLabel="Yes, cancel order"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}