"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/layout/UserAvatar";

function ProfileFormInner({ user }) {
  const [name, setName] = useState(user.name || "");
  const [businessName, setBusinessName] = useState(user.businessName || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isVendor = user.role === "vendor";

  const validate = () => {
    const next = {};
    if (name.trim().length < 2 || name.trim().length > 60) {
      next.name = "Name must be between 2 and 60 characters";
    }
    if (isVendor && (businessName.trim().length < 2 || businessName.trim().length > 80)) {
      next.businessName = "Restaurant name must be between 2 and 80 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = { name: name.trim() };
    if (isVendor) payload.businessName = businessName.trim();

    const { error } = await authClient.updateUser(payload);
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to update profile");
      return;
    }
    toast.success("Profile updated successfully");
  };

  return (
    <div className="max-w-2xl rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <UserAvatar user={user} className="h-16 w-16 text-xl" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.name}</p>
          <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
            {user.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
          <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
        </div>

        {isVendor && (
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Restaurant Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                setErrors((prev) => ({ ...prev, businessName: "" }));
              }}
            />
            {errors.businessName && (
              <p className="text-xs text-destructive">{errors.businessName}</p>
            )}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default function ProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return <div className="h-64 max-w-2xl animate-pulse rounded-2xl bg-muted" />;
  }

  return <ProfileFormInner key={user.id} user={user} />;
}