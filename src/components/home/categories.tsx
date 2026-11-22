import Image from "next/image";
import Link from "next/link";
import { Camera, Clapperboard, Mic, Music4, Palette } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const ITEMS = [
  { category: "Photo Studio", title: "Photo Studios", note: "Cycs, daylight lofts", image: "/img/daylight.png", icon: Camera },
  { category: "Sound Stage", title: "Sound Stages", note: "Full production lots", image: "/img/soundstage.png", icon: Clapperboard },
  { category: "Podcast Room", title: "Podcast Rooms", note: "Treated, camera-ready", image: "/img/podcast.png", icon: Mic },
  { category: "Music Suite", title: "Music Suites", note: "Record, mix, rehearse", image: "/img/hero-2.png", icon: Music4 },
  { category: "Art Workshop", title: "Art Workshops", note: "Sunlit creative lofts", image: "/img/hero-3.png", icon: Palette },
];

type Counts = Record<string, number> | null;

export function Categories({ counts }: { counts: Counts }) {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
            Browse by category
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            A space for every medium
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {ITEMS.map(({ category, title, note, image, icon: Icon }, i) => {
            const count = counts?.[category] ?? 0;
            return (
              <Link
                key={category}
                href={`/studios?category=${encodeURIComponent(category)}`}
                className={`group relative aspect-4/5 overflow-hidden rounded-3xl ${
                  i === 0 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <Icon className="mb-3 h-5 w-5 text-coral-300" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-white/70">
                    {counts ? `${count} ${count === 1 ? "space" : "spaces"}` : note}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function CategoriesLoader() {
  let counts: Counts = null;
  try {
    const res = await fetch(`${API_URL}/api/categories/counts`, {
      cache: "no-store",
    });
    if (res.ok) counts = await res.json();
  } catch {
    counts = null;
  }
  return <Categories counts={counts} />;
}