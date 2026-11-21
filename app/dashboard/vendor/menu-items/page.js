"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useApiData } from "@/lib/use-api-data";
import { apiRequest } from "@/lib/api-private";
import { formatPrice } from "@/lib/format";

const TABS = ["all", "pending", "approved", "rejected", "inactive"];

export default function VendorMenuItemsPage() {
  const [tab, setTab] = useState("all");
  const path =
    tab === "all" ? "/api/menu-items/mine" : `/api/menu-items/mine?status=${tab}`;
  const { data: items, status, error, reload } = useApiData(path);

  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function toggleAvailability(item) {
    setBusyId(item._id);
    try {
      const res = await apiRequest(`/api/menu-items/${item._id}/availability`, {
        method: "PATCH",
        body: { isActive: item.status === "inactive" },
      });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await apiRequest(`/api/menu-items/${deleteTarget._id}`, {
        method: "DELETE",
      });
      toast.success(res.message);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="My Menu Items"
        description="Manage the items you sell"
        action={
          <Link href="/dashboard/vendor/add-menu-item" className={buttonVariants()}>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Link>
        }
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
          description={
            tab === "all"
              ? "Add your first pizza to start selling."
              : `You have no ${tab} items.`
          }
        />
      )}

      {status === "success" && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => {
            const vendorCanToggle =
              item.status === "approved" ||
              (item.status === "inactive" && item.inactiveBy === "vendor");

            return (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images?.[0]}
                  alt={item.itemName}
                  className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{item.itemName}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.category} · {item.location}
                  </p>
                  <p className="mt-1 font-semibold text-primary">
                    {formatPrice(item.price)}
                  </p>
                  {item.status === "inactive" && item.inactiveBy === "admin" && (
                    <p className="mt-1 text-xs text-destructive">
                      Deactivated by an admin
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/vendor/menu-items/${item._id}/edit`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                  </Link>

                  {vendorCanToggle && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === item._id}
                      onClick={() => toggleAvailability(item)}
                    >
                      {busyId === item._id ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="mr-1 h-4 w-4" />
                      )}
                      {item.status === "inactive" ? "Make Available" : "Make Unavailable"}
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
        title="Delete this item?"
        description={`"${deleteTarget?.itemName}" will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}