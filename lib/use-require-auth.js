"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [fallbackUser, setFallbackUser] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (session) {
      setVerifying(false);
      return;
    }

    let cancelled = false;
    authClient
      .getSession({ query: { disableCookieCache: true } })
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setFallbackUser(data.user);
          setVerifying(false);
        } else {
          router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session, isPending, pathname, router]);

  const user = session?.user ?? fallbackUser;
  return { user, loading: isPending || (!user && verifying) };
}