"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Store, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getPasswordError, isValidEmail } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import OrDivider from "@/components/auth/OrDivider";

const ROLES = [
  { value: "customer", label: "Customer", description: "Order delicious pizza", icon: User },
  { value: "vendor", label: "Vendor", description: "Restaurant owner", icon: Store },
];

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (includeCredentials = true) => {
    const next = {};
    if (includeCredentials) {
      if (form.name.trim().length < 2) next.name = "Please enter your full name";
      if (!isValidEmail(form.email.trim())) next.email = "Please enter a valid email address";
      const passwordError = getPasswordError(form.password);
      if (passwordError) next.password = passwordError;
    }
    if (form.role === "vendor" && form.businessName.trim().length < 2) {
      next.businessName = "Please enter your restaurant name";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      ...(form.role === "vendor" ? { businessName: form.businessName.trim() } : {}),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogle = async () => {
    if (!validate(false)) return;

    setGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      additionalData: {
        role: form.role,
        businessName: form.businessName.trim(),
      },
    });

    if (error) {
      toast.error(error.message || "Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join PizzaHub and start ordering or selling pizza"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, description, icon: Icon }) => {
              const active = form.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("role", value)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>

        {form.role === "vendor" && (
          <Field label="Restaurant Name" htmlFor="businessName" error={errors.businessName}>
            <Input
              id="businessName"
              placeholder="Your restaurant name"
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </Field>
        )}

        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput
            id="password"
            placeholder="Min 6 chars, upper and lower case"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <OrDivider />

      <GoogleButton
        onClick={handleGoogle}
        loading={googleLoading}
        label="Sign up with Google"
      />
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Google sign up uses the role you selected above.
      </p>
    </AuthShell>
  );
}