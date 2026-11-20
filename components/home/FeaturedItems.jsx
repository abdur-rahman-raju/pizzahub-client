"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Pizza } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";
import MenuItemCard from "@/components/menu/MenuItemCard";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function FeaturedItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    apiGet("/api/menu-items/featured?limit=6", { signal: controller.signal })
      .then((data) => {
        setItems(data);
        setStatus("success");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Menu Items"
          subtitle="Fresh picks from our local pizza shops, ready to order"
        />

        {status === "loading" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-semibold">Could not load menu items</p>
            <p className="text-sm text-muted-foreground">
              Please check your connection and try again.
            </p>
            <Button onClick={() => setAttempt((prev) => prev + 1)}>Try Again</Button>
          </div>
        )}

        {status === "success" && items.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
            <Pizza className="h-10 w-10 text-primary" />
            <p className="font-semibold">No menu items yet</p>
            <p className="text-sm text-muted-foreground">
              Our vendors are preparing their menus. Please check back soon.
            </p>
          </div>
        )}

        {status === "success" && items.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <Reveal key={item._id} delay={index * 0.06} className="h-full">
                  <MenuItemCard item={item} />
                </Reveal>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/menu" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View All Menu Items
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}