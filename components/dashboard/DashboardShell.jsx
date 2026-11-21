"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu, X } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { getRoleHome } from "@/lib/roles";
import UserAvatar from "@/components/layout/UserAvatar";

export default function DashboardShell({ role, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useRequireAuth();
  const [open, setOpen] = useState(false);

  const wrongRole = !loading && !!user && user.role !== role;

  useEffect(() => {
    if (wrongRole) router.replace(getRoleHome(user.role));
  }, [wrongRole, user, router]);


  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user || wrongRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const links = DASHBOARD_NAV[role];
  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  const sidebar = (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
        <UserAvatar user={user} className="h-11 w-11" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
            {user.role}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">
   
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r bg-secondary/30 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:self-start">
        {sidebar}
      </aside>

  
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-background shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted-foreground"
              aria-label="Close dashboard menu"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pt-8">{sidebar}</div>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open dashboard menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold capitalize">{role} dashboard</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}