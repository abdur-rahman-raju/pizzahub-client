import Hero from "@/components/home/Hero";
import FeaturedItems from "@/components/home/FeaturedItems";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedItems />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}