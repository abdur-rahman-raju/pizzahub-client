"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function TemporaryDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  };

  if (isPending) return <p className="p-8 text-center">Loading...</p>;

  if (!session) {
    return (
      <div className="p-8 text-center">
        <Link href="/signin" className="text-primary underline">
          Please sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <p className="mt-2 text-muted-foreground">
        Role: <span className="font-semibold text-primary">{session.user.role}</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        (Temporary page, real dashboards come next)
      </p>
      <Button className="mt-6" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}