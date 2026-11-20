import { Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";

const steps = [
  {
    icon: Search,
    title: "Browse the Menu",
    text: "Search by name, filter by category or location and sort by price.",
  },
  {
    icon: ShoppingBag,
    title: "Place Your Order",
    text: "Pick a delivery date, add your address and send your order to the vendor.",
  },
  {
    icon: UtensilsCrossed,
    title: "Enjoy Your Pizza",
    text: "The vendor accepts your order and your hot pizza arrives at your door.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How PizzaHub Works"
          subtitle="Three simple steps from craving to first bite"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.1} className="h-full">
              <div className="relative h-full rounded-2xl border bg-card p-6 text-center shadow-sm">
                <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}