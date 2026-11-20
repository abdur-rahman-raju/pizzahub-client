"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, MapPin, Pizza, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default function MenuItemCard({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const vendorName = item.vendor?.businessName || item.vendor?.name || "Local vendor";
  const image = item.images?.[0];

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={item.itemName}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Pizza className="h-12 w-12" />
          </div>
        )}

        {item.isVendorPremium && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
            <Crown className="h-3 w-3" /> Premium
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {item.category}
          </p>
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold">{item.itemName}</h3>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Store className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{vendorName}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold">{formatPrice(item.price)}</span>
          <Link href={`/menu/${item._id}`} className={buttonVariants({ size: "sm" })}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}