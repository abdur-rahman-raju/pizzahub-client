import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";

export default function Categories() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Explore Pizza Categories"
          subtitle="From classic favorites to gourmet creations, find what you crave"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ name, description, icon: Icon }, index) => (
            <Reveal key={name} delay={index * 0.06} className="h-full">
              <Link
                href={`/menu?category=${encodeURIComponent(name)}`}
                className="flex h-full items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-semibold">{name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}