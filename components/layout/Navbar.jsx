"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { getRoleHome } from "@/lib/roles";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const blockedHandled = useRef(false);

  const home = user ? getRoleHome(user.role) : null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    ...(user ? [{ href: home, label: "Dashboard" }] : []),
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive(href) ? "text-primary" : "text-foreground/80"
    }`;

  const handleLogout = async () => {
    setOpen(false);
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };


  useEffect(() => {
    if (user?.isBlocked && !blockedHandled.current) {
      blockedHandled.current = true;
      toast.error("Your account has been blocked. Please contact support.");
      authClient.signOut().then(() => {
        router.push("/");
        router.refresh();
      });
    }
    if (!user) blockedHandled.current = false;
  }, [user, router]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />


        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>


        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link href="/signin" className={buttonVariants({ variant: "ghost" })}>
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>


        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {isPending ? null : user ? (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href={`${home}/profile`}
                  onClick={() => setOpen(false)}
                  className={linkClass(`${home}/profile`)}
                >
                  Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block text-left text-sm font-medium text-destructive"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonVariants()}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}