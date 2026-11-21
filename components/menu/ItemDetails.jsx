"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Crown, MapPin, Store } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { apiRequest } from "@/lib/api-private";
import { formatPrice } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";
import OrderSection from "./OrderSection";

function DetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-24 w-full animate-pulse rounded bg-muted" />
        <div className="h-16 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function ItemDetails({ id }) {
  const { user, loading } = useRequireAuth();
  const userId = user?.id;

  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState({ message: "", code: 0 });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (loading || !userId) return;

    const controller = new AbortController();
    setStatus("loading");

    apiRequest(`/api/menu-items/${id}`, { signal: controller.signal })
      .then((data) => {
        setItem(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError({ message: err.message, code: err.status || 0 });
        setStatus("error");
      });

    return () => controller.abort();
  }, [id, loading, userId, attempt]);

  const vendorName = item?.vendor?.businessName || item?.vendor?.name || "Local vendor";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      {(loading || status === "loading") && <DetailsSkeleton />}

      {!loading && status === "error" && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          {error.code === 400 || error.code === 404 ? (
            <>
              <p className="font-semibold">Item not found</p>
              <p className="text-sm text-muted-foreground">
                This menu item does not exist or is no longer available.
              </p>
              <Link href="/menu" className={buttonVariants()}>
                Browse Menu
              </Link>
            </>
          ) : error.code === 403 ? (
            <>
              <p className="font-semibold">Access denied</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Could not load this item</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <Button onClick={() => setAttempt((prev) => prev + 1)}>Try Again</Button>
            </>
          )}
        </div>
      )}

      {!loading && status === "success" && item && (
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageGallery images={item.images} name={item.itemName} />

          <div className="space-y-5">
            {item.status !== "approved" && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This item is <strong className="capitalize">{item.status}</strong> and is
                not visible to customers.
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.category}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                {item.itemName}
              </h1>
            </div>

            <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>

            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {item.location}
            </p>

            <p className="leading-relaxed text-foreground/80">{item.description}</p>

            <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Sold by</p>
                <p className="truncate font-semibold">{vendorName}</p>
              </div>
              {item.isVendorPremium && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </div>

            <OrderSection item={item} user={user} />
          </div>
        </div>
      )}
    </div>
  );
}