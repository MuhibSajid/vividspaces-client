import { Suspense } from "react";
import Link from "next/link";

import { SkeletonBlock, StudioGridSkeleton } from "@/components/shared/loading";
import { ExploreFilters } from "@/components/studios/explore-filters";
import { StudioCard } from "@/components/studios/studio-card";
import type { Studio } from "@/types/studio";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const search = first(sp.search);
  const location = first(sp.location);
  const category = first(sp.category);
  const sort = first(sp.sort);

  const params = new URLSearchParams({ limit: "100" });
  if (search) params.set("search", search);
  if (location) params.set("location", location);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);

  let studios: Studio[];
  try {
    const res = await fetch(`${API_URL}/api/studios?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Request failed");
    studios = await res.json();
  } catch {
    return (
      <p className="mt-12 rounded-3xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
        We couldn&apos;t load studios right now. Please try again in a moment.
      </p>
    );
  }

  const filtered = Boolean(search || location || category);

  if (studios.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="font-medium">
          {filtered ? "No studios match your search" : "No studios listed yet"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {filtered
            ? "Try a different keyword, location or category."
            : "Be the first host to list a space on VividSpaces."}
        </p>
        <Link
          href={filtered ? "/studios" : "/add-studio"}
          className="mt-5 inline-flex rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
        >
          {filtered ? "Clear filters" : "Add New Studio"}
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm text-zinc-500">
        {studios.length} {studios.length === 1 ? "studio" : "studios"} found
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio._id} studio={studio} />
        ))}
      </div>
    </>
  );
}

export default function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
        Explore
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        Find the room for your next shoot
      </h1>

      <Suspense
        fallback={<SkeletonBlock className="mt-8 h-16 rounded-2xl" />}
      >
        <ExploreFilters />
      </Suspense>

      <Suspense fallback={<StudioGridSkeleton className="mt-14" />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </section>
  );
}