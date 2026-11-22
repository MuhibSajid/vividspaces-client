import Link from "next/link";
import { Suspense } from "react";

import { StudioCard } from "@/components/studios/studio-card";
import type { Studio } from "@/types/studio";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function StudioGrid() {
  let studios: Studio[];
  try {
    const res = await fetch(`${API_URL}/api/studios?limit=6&sort=rating`, {
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

  if (studios.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="font-medium">No studios listed yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Be the first host to list a space on VividSpaces.
        </p>
        <Link
          href="/add-studio"
          className="mt-5 inline-flex rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Add New Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-4/3 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export function FeaturedStudios() {
  return (
    <section id="featured" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
            Featured this week
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Studios creators keep rebooking
          </h2>
        </div>
        <Link
          href="/studios"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          View all studios
        </Link>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <StudioGrid />
      </Suspense>
    </section>
  );
}