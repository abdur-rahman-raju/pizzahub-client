"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      pathname === href ? "text-primary" : "text-foreground/80"
    }`;

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
          <Link href="/signin" className={buttonVariants({ variant: "ghost" })}>
            Sign In
          </Link>
          <Link href="/signup" className={buttonVariants()}>
            Sign Up
          </Link>
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
          </div>
        </div>
      )}
    </header>
  );
}