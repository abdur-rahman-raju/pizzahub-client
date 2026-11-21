import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Payment cancelled | PizzaHub" };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <XCircle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="text-muted-foreground">
        No money was charged. You can upgrade any time from your dashboard.
      </p>
      <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
        Back to Subscription
      </Link>
    </div>
  );
}