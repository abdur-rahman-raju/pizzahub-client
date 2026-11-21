"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/categories";
import { apiRequest } from "@/lib/api-private";
import { uploadImage } from "@/lib/upload-image";

const MAX_IMAGES = 5;

// item দিলে Edit মোড, না দিলে Add মোড
export default function MenuItemForm({ item }) {
  const router = useRouter();
  const isEdit = !!item;

  const [form, setForm] = useState({
    itemName: item?.itemName ?? "",
    category: item?.category ?? CATEGORIES[0].name,
    description: item?.description ?? "",
    price: item?.price ?? "",
    location: item?.location ?? "",
  });
  const [images, setImages] = useState(item?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (name) => (e) =>
    setForm((prev) => ({ ...prev, [name]: e.target.value }));

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`সর্বোচ্চ ${MAX_IMAGES}টা ছবি দেওয়া যাবে`);
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const next = {};
    const name = form.itemName.trim();
    if (name.length < 2 || name.length > 80) next.itemName = "Name must be 2 to 80 characters";
    const desc = form.description.trim();
    if (desc.length < 10 || desc.length > 1000) next.description = "Description must be 10 to 1000 characters";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) next.price = "Enter a valid price";
    const loc = form.location.trim();
    if (loc.length < 2 || loc.length > 80) next.location = "Location must be 2 to 80 characters";
    if (images.length < 1) next.images = "Add at least one image";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const body = {
        itemName: form.itemName.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        location: form.location.trim(),
        images,
      };

      if (isEdit) {
        const res = await apiRequest(`/api/menu-items/${item._id}`, {
          method: "PATCH",
          body,
        });
        toast.success(res.message);
      } else {
        await apiRequest("/api/menu-items", { method: "POST", body });
        toast.success("Item submitted. It will go live after admin approval.");
      }
      router.push("/dashboard/vendor/menu-items");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const fieldError = (name) =>
    errors[name] && <p className="mt-1 text-sm text-destructive">{errors[name]}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-3xl gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
      noValidate
    >
      {isEdit && (item.status === "approved" || item.status === "rejected") && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Saving changes will send this item back to the admin for review.
        </p>
      )}

      <div>
        <Label htmlFor="itemName">Item name</Label>
        <Input id="itemName" value={form.itemName} onChange={setField("itemName")} placeholder="Margherita Classic" />
        {fieldError("itemName")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={setField("category")}
            className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={setField("price")} placeholder="12.99" />
          {fieldError("price")}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={form.location} onChange={setField("location")} placeholder="Gulshan, Dhaka" />
        {fieldError("location")}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} value={form.description} onChange={setField("description")} placeholder="Describe the toppings, size and taste" />
        {fieldError("description")}
      </div>

      <div>
        <Label>Images (max {MAX_IMAGES})</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Menu item" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label
              htmlFor="images"
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:bg-accent"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              {uploading ? "Uploading" : "Add image"}
            </label>
          )}
          <input id="images" type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
        </div>
        {fieldError("images")}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || uploading}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Submit for approval"}
        </Button>
      </div>
    </form>
  );
}