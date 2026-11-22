import Link from "next/link";
import { Pizza } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Page not found | PizzaHub" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Pizza className="h-14 w-14 text-primary" />
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="text-2xl font-bold">This slice is missing</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or was moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to Home
        </Link>
        <Link href="/menu" className={buttonVariants({ variant: "outline" })}>
          Browse Menu
        </Link>
      </div>
    </div>
  );
}