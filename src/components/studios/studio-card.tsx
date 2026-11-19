import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import type { Studio } from "@/types/studio";

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={studio.image}
          alt={`${studio.title} interior`}
          fill
          unoptimized={studio.image.startsWith("http")}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur">
          {studio.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold">{studio.title}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <b>{studio.rating.toFixed(2)}</b>
            {studio.reviewCount ? (
              <span className="text-zinc-500">({studio.reviewCount})</span>
            ) : null}
          </span>
        </div>

        <p className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-500">
          <MapPin className="h-3.5 w-3.5" />
          {studio.location}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p>
            <span className="text-xl font-semibold">${studio.hourlyRate}</span>
            <span className="text-sm text-zinc-500"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-900"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}