import { SkeletonBlock, StudioGridSkeleton } from "@/components/shared/loading";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SkeletonBlock className="h-12 w-72 rounded-2xl" />
        <SkeletonBlock className="h-10 w-36 rounded-full" />
      </div>
      <StudioGridSkeleton count={3} className="mt-12" />
    </section>
  );
}
