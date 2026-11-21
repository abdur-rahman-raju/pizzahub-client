"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatDeliveryDate, formatPrice } from "@/lib/format";
import StatusBadge from "./StatusBadge";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 break-words font-medium">{children}</dd>
    </div>
  );
}

export default function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  perspective = "customer",
}) {
  if (!order) return null;

  const item = order.item?.itemName ? order.item : null;
  const image = item?.images?.[0];
  const vendorName = order.vendor?.businessName || order.vendor?.name || "Unknown vendor";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription>Order #{order._id.slice(-6).toUpperCase()}</DialogDescription>
        </DialogHeader>

        {image && (
          <img
            src={image}
            alt={item.itemName}
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
        )}

        <dl className="space-y-3">
          <Row label="Item">{item ? item.itemName : "Item no longer available"}</Row>
          {item && <Row label="Price">{formatPrice(item.price)}</Row>}

          {perspective === "vendor" ? (
            <>
              <Row label="Customer">{order.customer?.name || "Unknown"}</Row>
              <Row label="Email">{order.customer?.email || "Unknown"}</Row>
            </>
          ) : (
            <Row label="Vendor">{vendorName}</Row>
          )}

          <Row label="Delivery date">{formatDeliveryDate(order.deliveryDate)}</Row>
          <Row label="Address">{order.deliveryAddress}</Row>
          <Row label="Message">{order.message || "No message"}</Row>
          <Row label="Status">
            <StatusBadge status={order.status} />
          </Row>
          <Row label="Requested on">{formatDate(order.createdAt)}</Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}