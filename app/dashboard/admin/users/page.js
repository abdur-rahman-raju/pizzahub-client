"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/dashboard/PageHeader";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import UserAvatar from "@/components/layout/UserAvatar";
import { useApiData } from "@/lib/use-api-data";
import { apiRequest } from "@/lib/api-private";
import { formatDate } from "@/lib/format";

const TABS = ["all", "customer", "vendor", "admin"];

const ROLE_STYLES = {
  customer: "bg-blue-100 text-blue-800",
  vendor: "bg-amber-100 text-amber-800",
  admin: "bg-purple-100 text-purple-800",
};

export default function AdminUsersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const path = tab === "all" ? "/api/admin/users" : `/api/admin/users?role=${tab}`;
  const { data: users, status, error, reload } = useApiData(path);

  const [target, setTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  async function confirmToggle() {
    setSaving(true);
    try {
      const res = await apiRequest(`/api/admin/users/${target._id}/block`, {
        method: "PATCH",
        body: { isBlocked: !target.isBlocked },
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

  const blocking = target && !target.isBlocked;

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Block or unblock customers and vendors"
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          aria-label="Search users"
          className="w-full sm:w-64"
        />
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && filtered.length === 0 && (
        <EmptyState title="No users found" description="Try another filter or search." />
      )}

      {status === "success" && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={u} className="h-9 w-9" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        ROLE_STYLES[u.role] || ""
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {u.role === "vendor" ? u.subscriptionPlan || "free" : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {u.createdAt ? formatDate(u.createdAt) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {u.isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <Ban className="h-4 w-4" /> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="h-4 w-4" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role === "admin" ? (
                      <span className="text-xs text-muted-foreground">-</span>
                    ) : (
                      <Button
                        size="sm"
                        variant={u.isBlocked ? "outline" : "destructive"}
                        onClick={() => setTarget(u)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && !saving && setTarget(null)}
        title={blocking ? "Block this user?" : "Unblock this user?"}
        description={
          blocking
            ? `${target?.name} will not be able to use the platform until you unblock them.`
            : `${target?.name} will be able to use the platform again.`
        }
        confirmLabel={blocking ? "Block" : "Unblock"}
        destructive={blocking}
        loading={saving}
        onConfirm={confirmToggle}
      />
    </div>
  );
}