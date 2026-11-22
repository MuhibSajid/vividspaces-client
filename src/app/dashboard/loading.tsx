import { SkeletonBlock } from "@/components/shared/loading";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SkeletonBlock className="h-12 w-64 rounded-2xl" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <SkeletonBlock className="mt-12 h-6 w-48 rounded" />
      <SkeletonBlock className="mt-6 h-48 rounded-2xl" />
    </section>
  );
}
