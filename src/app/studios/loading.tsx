import { SkeletonBlock, StudioGridSkeleton } from "@/components/shared/loading";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SkeletonBlock className="h-3 w-24 rounded" />
      <SkeletonBlock className="mt-4 h-12 w-2/3 rounded-2xl" />
      <SkeletonBlock className="mt-8 h-16 rounded-2xl" />
      <StudioGridSkeleton className="mt-14" />
    </section>
  );
}
