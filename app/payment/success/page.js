"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/use-require-auth";
import { apiRequest } from "@/lib/api-private";

export default function PaymentSuccessPage() {
  const { user, loading } = useRequireAuth();
  const [state, setState] = useState("checking"); // checking | active | slow

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function poll() {
      for (let i = 0; i < 10; i++) {
        try {
          const stats = await apiRequest("/api/stats/vendor");
          if (stats.plan === "premium") {
            if (!cancelled) setState("active");
            return;
          }
        } catch {
          // পরের চেষ্টায় আবার দেখব
        }
        await new Promise((r) => setTimeout(r, 2000));
        if (cancelled) return;
      }
      if (!cancelled) setState("slow");
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      {state === "checking" ? (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h1 className="text-2xl font-bold">Confirming your payment</h1>
          <p className="text-muted-foreground">This usually takes a few seconds.</p>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h1 className="text-2xl font-bold">
            {state === "active" ? "You are now Premium" : "Payment received"}
          </h1>
          <p className="text-muted-foreground">
            {state === "active"
              ? "You can now add unlimited menu items."
              : "Your plan will update as soon as Stripe confirms the payment. Check your dashboard in a minute."}
          </p>
        </>
      )}
      <Link href="/dashboard/vendor" className={buttonVariants()}>
        Go to Dashboard
      </Link>
    </div>
  );
}