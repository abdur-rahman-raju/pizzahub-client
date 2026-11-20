"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { getRoleHome } from "@/lib/roles";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;

    async function redirect() {
      let current = session;
      if (!current) {

        const { data } = await authClient.getSession({
          query: { disableCookieCache: true },
        });
        current = data;
      }
      if (cancelled) return;
      router.replace(current ? getRoleHome(current.user.role) : "/signin");
    }

    redirect();
    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}