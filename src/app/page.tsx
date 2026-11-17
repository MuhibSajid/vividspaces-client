import { Suspense } from "react";

import { HeroSlider } from "@/components/home/hero-slider";
import { SearchBar } from "@/components/home/search-bar";

function HeroSkeleton() {
  return (
    <div
      className="mx-auto min-h-160 max-w-7xl animate-pulse rounded-[28px] bg-zinc-200 sm:min-h-170 lg:min-h-180 dark:bg-zinc-900"
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  return (
    <section id="home" aria-label="Hero" className="px-4 pt-6 sm:px-6">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider />
      </Suspense>
      <SearchBar />
    </section>
  );
}