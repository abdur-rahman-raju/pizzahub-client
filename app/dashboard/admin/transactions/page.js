"use client";

import { Loader2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { EmptyState, ErrorState } from "@/components/dashboard/States";
import { useApiData } from "@/lib/use-api-data";
import { formatDate, formatPrice } from "@/lib/format";

export default function AdminTransactionsPage() {
  const { data: transactions, status, error, reload } = useApiData(
    "/api/admin/transactions"
  );

  const total =
    status === "success"
      ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      : 0;

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Premium subscription payments from vendors"
      />

      {status === "loading" && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && transactions.length === 0 && (
        <EmptyState
          title="No transactions yet"
          description="Payments will appear here after a vendor buys Premium."
        />
      )}

      {status === "success" && transactions.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {transactions.length} payment{transactions.length > 1 ? "s" : ""} · Total{" "}
            <span className="font-semibold text-foreground">{formatPrice(total)}</span>
          </p>

          <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b bg-secondary/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.vendorName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{t.vendorEmail}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">{t.plan}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(t.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-green-800">
                        {t.status}
                      </span>
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                      {t.paymentIntentId || t.sessionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}