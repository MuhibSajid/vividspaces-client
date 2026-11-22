import { Suspense } from "react";

import { SkeletonBlock } from "@/components/shared/loading";
import { HeroSlider } from "@/components/home/hero-slider";
import { SearchBar } from "@/components/home/search-bar";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Categories, CategoriesLoader } from "@/components/home/categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";

function HeroSkeleton() {
  return (
    <SkeletonBlock className="mx-auto min-h-160 max-w-7xl rounded-[28px] sm:min-h-170 lg:min-h-180" />
  );
}

export default function HomePage() {
  return (
    <>
      <section id="home" aria-label="Hero" className="px-4 pt-6 sm:px-6">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSlider />
        </Suspense>
        <SearchBar />
      </section>
      <FeaturedStudios />
      <Suspense fallback={<Categories counts={null} />}>
        <CategoriesLoader />
      </Suspense>
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}