import { cn } from "@/lib/utils";

/**
 * Shared loading UI for every API-backed view.
 *
 * Keep every pending state in the app built from these pieces so the whole
 * product shows the same shapes, radius, colors and motion while data loads.
 */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-coral-500 dark:border-zinc-800 dark:border-t-coral-400",
        className
      )}
    />
  );
}

/** Centered spinner + label, for a page or panel that is waiting on data. */
export function PageLoader({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("grid place-items-center gap-3 py-24 text-center", className)}
    >
      <Spinner className="h-8 w-8" />
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800",
        className
      )}
    />
  );
}

export function StudioCardSkeleton() {
  return (
    <div aria-hidden="true">
      <SkeletonBlock className="aspect-4/3 rounded-3xl" />
      <SkeletonBlock className="mt-4 h-5 w-2/3 rounded" />
      <SkeletonBlock className="mt-2 h-4 w-1/3 rounded" />
    </div>
  );
}

export function StudioGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StudioDetailsSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("mx-auto max-w-7xl px-4 py-10 sm:px-6", className)}
    >
      <SkeletonBlock className="h-4 w-40 rounded" />
      <SkeletonBlock className="mt-4 h-10 w-1/2 rounded" />
      <SkeletonBlock className="mt-3 h-4 w-64 rounded" />
      <SkeletonBlock className="mt-6 aspect-video rounded-3xl" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <SkeletonBlock className="h-5 w-32 rounded" />
          <SkeletonBlock className="h-24 rounded-2xl" />
          <SkeletonBlock className="h-32 rounded-2xl" />
        </div>
        <SkeletonBlock className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}

/** Stacked row placeholders, for lists such as bookings. */
export function ListSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} className="h-32 rounded-3xl" />
      ))}
    </div>
  );
}

/** Placeholder for a form page whose studio/auth data is still loading. */
export function FormSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("mx-auto max-w-3xl px-4 py-16 sm:px-6", className)}
    >
      <SkeletonBlock className="h-96 rounded-3xl" />
    </div>
  );
}
