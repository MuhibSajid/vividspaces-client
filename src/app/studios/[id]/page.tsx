import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, Star, UserRound } from "lucide-react";

import { API_URL } from "@/lib/api";
import { StudioDetailsSkeleton } from "@/components/shared/loading";
import { BookingPanel } from "@/components/studios/booking-panel";
import type { Studio } from "@/types/studio";

async function getStudio(id: string): Promise<Studio | null> {
  const res = await fetch(`${API_URL}/api/studios/${id}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error("Failed to load studio");
  return res.json();
}

async function StudioDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const studio = await getStudio(id);
  if (!studio) notFound();

  const hasReviews = (studio.reviewCount ?? 0) > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/studios" className="hover:underline">Explore</Link></li>
          <li aria-hidden="true">/</li>
          <li>{studio.category}</li>
          <li aria-hidden="true">/</li>
          <li className="text-zinc-900 dark:text-zinc-100">{studio.title}</li>
        </ol>
      </nav>

      <div className="mt-4">
        <h1 className="font-display text-4xl sm:text-5xl">{studio.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {hasReviews ? (
              <>
                <b className="text-zinc-900 dark:text-white">{studio.rating.toFixed(2)}</b>
                ({studio.reviewCount} reviews)
              </>
            ) : (
              "New listing"
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {studio.location}
          </span>
        </div>
      </div>

      <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={studio.image}
          alt={`${studio.title} interior`}
          fill
          priority
          unoptimized={studio.image.startsWith("http")}
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur">
          {studio.category}
        </span>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Capacity</p>
              <p className="mt-1 font-semibold">Up to {studio.maxCapacity ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Hourly rate</p>
              <p className="mt-1 font-semibold">${studio.hourlyRate} / hr</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Security deposit</p>
              <p className="mt-1 font-semibold">${studio.securityDeposit ?? 0}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">About this space</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
              {studio.overview}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Amenities</h2>
            {studio.amenities && studio.amenities.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {studio.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900"
                  >
                    <Check className="h-4 w-4 text-coral-500" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                The host hasn&apos;t listed any amenities.
              </p>
            )}
          </div>

          <div className="flex items-center gap-5 rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
              <UserRound className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Hosted by
              </p>
              <h3 className="truncate text-lg font-semibold">{studio.ownerName}</h3>
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {studio.ownerEmail}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p className="mt-3 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
              No reviews yet. Be the first to book and share your experience.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel
            studio={{
              _id: studio._id,
              title: studio.title,
              hourlyRate: studio.hourlyRate,
              securityDeposit: studio.securityDeposit ?? 0,
              ownerEmail: studio.ownerEmail ?? "",
            }}
          />
        </aside>
      </div>
    </section>
  );
}

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<StudioDetailsSkeleton />}>
      <StudioDetails params={params} />
    </Suspense>
  );
}
