import { ListSkeleton, SkeletonBlock } from "@/components/shared/loading";

export default function Loading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SkeletonBlock className="h-3 w-24 rounded" />
      <SkeletonBlock className="mt-4 h-12 w-64 rounded-2xl" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ListSkeleton rows={3} className="mt-10" />
    </section>
  );
}
