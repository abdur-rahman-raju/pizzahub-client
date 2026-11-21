"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import OrderForm from "./OrderForm";

function Notice({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border bg-muted/50 p-4 text-sm text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default function OrderSection({ item, user }) {
  const [showForm, setShowForm] = useState(false);
  const [placed, setPlaced] = useState(false);

  if (user.role === "admin") {
    return <Notice>Admins cannot place customer orders.</Notice>;
  }

  if (user.role === "vendor") {
    return item.vendorId === user.id ? (
      <Notice>This is your own menu item. Vendors cannot order their own items.</Notice>
    ) : (
      <Notice>
        Vendor accounts cannot place orders. Please sign in with a customer account to order.
      </Notice>
    );
  }

  if (item.status !== "approved") {
    return <Notice>This item is not available for ordering right now.</Notice>;
  }

  if (placed) {
    return (
      <div className="space-y-3 rounded-2xl border border-green-300 bg-green-50 p-5 text-green-900">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-5 w-5" /> Order placed successfully
        </p>
        <p className="text-sm">
          The vendor will review your order. You can track its status from your dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/customer/orders" className={buttonVariants({ size: "sm" })}>
            View My Orders
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPlaced(false);
              setShowForm(true);
            }}
          >
            Order for another date
          </Button>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <Button size="lg" className="w-full" onClick={() => setShowForm(true)}>
        Order Now
      </Button>
    );
  }

  return (
    <OrderForm
      item={item}
      onCancel={() => setShowForm(false)}
      onSuccess={() => {
        setShowForm(false);
        setPlaced(true);
      }}
    />
  );
}