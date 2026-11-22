"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Power, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useApiData } from "@/lib/use-api-data";
import { apiRequest } from "@/lib/api-private";
import { formatPrice } from "@/lib/format";
// export const dynamic = "force-dynamic";

const TABS = ["all", "pending", "approved", "rejected", "inactive"];

// action -> ডায়ালগের লেখা আর API কল
const ACTIONS = {
  approve: {
    title: "Approve this item?",
    description: "It will appear on the public menu.",
    label: "Approve",
    status: "approved",
  },
  reject: {
    title: "Reject this item?",
    description: "The vendor will see it as rejected and can edit and resubmit it.",
    label: "Reject",
    status: "rejected",
    destructive: true,
  },
  deactivate: {
    title: "Deactivate this item?",
    description: "It will be hidden from the menu. Only an admin can activate it again.",
    label: "Deactivate",
    status: "inactive",
    destructive: true,
  },
  activate: {
    title: "Activate this item?",
    description: "It will appear on the public menu again.",
    label: "Activate",
    status: "approved",
  },
  delete: {
    title: "Delete this item?",
    description: "It will be removed permanently. This cannot be undone.",
    label: "Delete",
    destructive: true,
  },
};

export default function AdminMenuItemsPage() {
  const [tab, setTab] = useState("pending");
  const path =
    tab === "all" ? "/api/admin/menu-items" : `/api/admin/menu-items?status=${tab}`;
  const { data: items, status, error, reload } = useApiData(path);

  const [target, setTarget] = useState(null); // { item, action }
  const [saving, setSaving] = useState(false);

  async function confirmAction() {
    const { item, action } = target;
    const config = ACTIONS[action];
    setSaving(true);
    try {
      const res =
        action === "delete"
          ? await apiRequest(`/api/admin/menu-items/${item._id}`, { method: "DELETE" })
          : await apiRequest(`/api/admin/menu-items/${item._id}/status`, {
              method: "PATCH",
              body: { status: config.status },
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

  const config = target ? ACTIONS[target.action] : null;

  return (
    <div>
      <PageHeader
        title="Manage Menu Items"
        description="Review new items and control what appears on the menu"
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

      {status === "success" && items.length === 0 && (
        <EmptyState
          title="No items here"
          description={tab === "pending" ? "Nothing is waiting for review." : `There are no ${tab} items.`}
        />
      )}

      {status === "success" && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.images?.[0]}
                alt={item.itemName}
                className="h-28 w-full rounded-xl object-cover lg:h-24 lg:w-32"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{item.itemName}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.category} · {item.location} ·{" "}
                  <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                </p>
                <p className="mt-1 truncate text-sm">
                  <span className="text-muted-foreground">Vendor: </span>
                  {item.vendor?.businessName || item.vendor?.name || "Unknown"}
                  {item.vendor?.email && (
                    <span className="text-muted-foreground"> ({item.vendor.email})</span>
                  )}
                </p>
                {item.status === "inactive" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Deactivated by {item.inactiveBy || "vendor"}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {item.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => setTarget({ item, action: "approve" })}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTarget({ item, action: "reject" })}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
                {item.status === "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTarget({ item, action: "deactivate" })}
                  >
                    <Power className="mr-1 h-4 w-4" /> Deactivate
                  </Button>
                )}
                {item.status === "inactive" && item.inactiveBy === "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTarget({ item, action: "activate" })}
                  >
                    <Power className="mr-1 h-4 w-4" /> Activate
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setTarget({ item, action: "delete" })}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && !saving && setTarget(null)}
        title={config?.title ?? ""}
        description={
          target ? `"${target.item.itemName}": ${config.description}` : ""
        }
        confirmLabel={config?.label}
        destructive={config?.destructive}
        loading={saving}
        onConfirm={confirmAction}
      />
    </div>
  );
} 