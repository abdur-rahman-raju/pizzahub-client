"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useApiData } from "@/lib/use-api-data";
import { apiRequest } from "@/lib/api-private";
import { formatDate, formatDeliveryDate, formatPrice } from "@/lib/format";

const TABS = ["all", "pending", "accepted", "rejected", "cancelled"];

export default function VendorOrdersPage() {
  const [tab, setTab] = useState("all");
  const path =
    tab === "all" ? "/api/orders/vendor" : `/api/orders/vendor?status=${tab}`;
  const { data: orders, status, error, reload } = useApiData(path);

  const [target, setTarget] = useState(null); // { order, status }
  const [saving, setSaving] = useState(false);

  async function confirmAction() {
    setSaving(true);
    try {
      const res = await apiRequest(`/api/orders/${target.order._id}/status`, {
        method: "PATCH",
        body: { status: target.status },
      });
      toast.success(res.message);
      setTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const accepting = target?.status === "accepted";

  return (
    <div>
      <PageHeader
        title="Customer Orders"
        description="Review and respond to incoming orders"
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && orders.length === 0 && (
        <EmptyState
          title="No orders here"
          description={
            tab === "all"
              ? "Orders from customers will appear here."
              : `You have no ${tab} orders.`
          }
        />
      )}

      {status === "success" && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.item?.images?.[0]}
                  alt={order.item?.itemName}
                  className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">
                      {order.item?.itemName}
                    </h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPrice(order.item?.price)} · Ordered{" "}
                    {formatDate(order.createdAt)}
                  </p>

                  <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="inline text-muted-foreground">Customer: </dt>
                      <dd className="inline font-medium">{order.customer?.name}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="inline text-muted-foreground">Email: </dt>
                      <dd className="inline break-all">{order.customer?.email}</dd>
                    </div>
                    <div>
                      <dt className="inline text-muted-foreground">Delivery date: </dt>
                      <dd className="inline font-medium">
                        {formatDeliveryDate(order.deliveryDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline text-muted-foreground">Address: </dt>
                      <dd className="inline">{order.deliveryAddress}</dd>
                    </div>
                  </dl>

                  {order.message && (
                    <p className="mt-2 rounded-lg bg-secondary/50 p-2 text-sm">
                      <span className="text-muted-foreground">Note: </span>
                      {order.message}
                    </p>
                  )}
                </div>
              </div>

              {order.status === "pending" && (
                <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTarget({ order, status: "rejected" })}
                  >
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setTarget({ order, status: "accepted" })}
                  >
                    <Check className="mr-1 h-4 w-4" /> Accept
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && !saving && setTarget(null)}
        title={accepting ? "Accept this order?" : "Reject this order?"}
        description="You can respond only once. The decision cannot be changed afterwards."
        confirmLabel={accepting ? "Accept" : "Reject"}
        destructive={!accepting}
        loading={saving}
        onConfirm={confirmAction}
      />
    </div>
  );
}