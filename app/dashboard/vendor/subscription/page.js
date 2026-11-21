"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/PageHeader";
import { ErrorState } from "@/components/dashboard/States";
import { useApiData } from "@/lib/use-api-data";
import { apiRequest } from "@/lib/api-private";

const FREE_FEATURES = ["Up to 3 active menu items", "Receive and manage orders", "Vendor dashboard"];
const PREMIUM_FEATURES = ["Unlimited menu items", "Receive and manage orders", "Vendor dashboard", "Valid for 30 days"];

function FeatureList({ items }) {
  return (
    <ul className="mt-4 grid gap-2 text-sm">
      {items.map((text) => (
        <li key={text} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          {text}
        </li>
      ))}
    </ul>
  );
}

export default function VendorSubscriptionPage() {
  const { data, status, error, reload } = useApiData("/api/stats/vendor");
  const [paying, setPaying] = useState(false);

  async function handleUpgrade() {
    setPaying(true);
    try {
      const res = await apiRequest("/api/payments/checkout", { method: "POST" });
      window.location.href = res.url; // Stripe-এর পেমেন্ট পেজে যাবে
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (status === "error") return <ErrorState message={error} onRetry={reload} />;

  const isPremium = data.plan === "premium";

  return (
    <div>
      <PageHeader
        title="Subscription"
        description={`You are on the ${data.plan} plan`}
      />

      <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
        <section className={`rounded-2xl border bg-card p-6 shadow-sm ${!isPremium ? "ring-2 ring-primary" : ""}`}>
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-1 text-3xl font-bold">$0</p>
          <FeatureList items={FREE_FEATURES} />
          {!isPremium && <p className="mt-5 text-sm font-medium text-primary">Current plan</p>}
        </section>

        <section className={`rounded-2xl border bg-card p-6 shadow-sm ${isPremium ? "ring-2 ring-primary" : ""}`}>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Crown className="h-5 w-5 text-amber-600" /> Premium
          </h2>
          <p className="mt-1 text-3xl font-bold">
            $9.99 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span>
          </p>
          <FeatureList items={PREMIUM_FEATURES} />

          {isPremium ? (
            <p className="mt-5 text-sm font-medium text-primary">Current plan</p>
          ) : (
            <Button className="mt-5 w-full" onClick={handleUpgrade} disabled={paying}>
              {paying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upgrade to Premium
            </Button>
          )}
        </section>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Payments are processed securely by Stripe. Your plan is upgraded only after Stripe confirms the payment.
      </p>
    </div>
  );
}