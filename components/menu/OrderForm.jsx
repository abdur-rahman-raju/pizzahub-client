"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api-private";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const todayString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

export default function OrderForm({ item, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    deliveryDate: "",
    deliveryAddress: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.deliveryDate) {
      next.deliveryDate = "Please choose a delivery date";
    } else if (form.deliveryDate < todayString()) {
      next.deliveryDate = "Delivery date cannot be in the past";
    }
    if (form.deliveryAddress.trim().length < 5) {
      next.deliveryAddress = "Please enter a complete delivery address";
    }
    if (form.message.length > 300) {
      next.message = "Message must be 300 characters or less";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await apiRequest("/api/orders", {
        method: "POST",
        body: {
          itemId: item._id,
          deliveryDate: form.deliveryDate,
          deliveryAddress: form.deliveryAddress.trim(),
          message: form.message.trim(),
        },
      });
      toast.success("Order placed! The vendor will review it shortly.");
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Place your order</h2>
        <p className="text-sm text-muted-foreground">
          {item.itemName} · {formatPrice(item.price)}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="date"
          min={todayString()}
          value={form.deliveryDate}
          onChange={(e) => update("deliveryDate", e.target.value)}
        />
        {errors.deliveryDate && (
          <p className="text-xs text-destructive">{errors.deliveryDate}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Textarea
          id="deliveryAddress"
          rows={2}
          placeholder="House, road, area, city"
          value={form.deliveryAddress}
          onChange={(e) => update("deliveryAddress", e.target.value)}
        />
        {errors.deliveryAddress && (
          <p className="text-xs text-destructive">{errors.deliveryAddress}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Additional Message (optional)</Label>
        <Textarea
          id="message"
          rows={2}
          placeholder="Any special instructions for the vendor"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Confirm Order
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}