import { Suspense } from "react";
import MenuBrowser from "@/components/menu/MenuBrowser";
import CardSkeleton from "@/components/menu/CardSkeleton";

export const metadata = {
  title: "Browse Menu | PizzaHub",
  description:
    "Browse pizzas, sides and drinks from local pizza shops. Search, filter by category and location, and sort by price.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse Menu</h1>
        <p className="mt-3 text-muted-foreground">
          Find your favorite pizza from local shops. Search, filter and sort to
          get exactly what you crave.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MenuBrowser />
      </Suspense>
    </div>
  );
}