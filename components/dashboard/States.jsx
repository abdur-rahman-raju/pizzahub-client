"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm text-muted-foreground">
        {message || "Please check your connection and try again."}
      </p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
      <Inbox className="h-10 w-10 text-primary" />
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}