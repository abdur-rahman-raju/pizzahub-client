import { ClipboardCheck, ShieldCheck, Store, Truck } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";

const benefits = [
  {
    icon: Store,
    title: "Local Pizza Shops",
    text: "Order from real restaurants in your area and support local businesses.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed Menus",
    text: "Every menu item is reviewed and approved by our team before it goes live.",
  },
  {
    icon: Truck,
    title: "Hot & Fresh Delivery",
    text: "Choose your delivery date and address and get your pizza at your door.",
  },
  {
    icon: ClipboardCheck,
    title: "Easy Order Tracking",
    text: "Follow your order status from pending to accepted right from your dashboard.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Choose PizzaHub?"
          subtitle="Everything you need to enjoy great pizza without the hassle"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08} className="h-full">
              <div className="h-full rounded-2xl border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
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