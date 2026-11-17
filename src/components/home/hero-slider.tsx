"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowUpRight, House } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    src: "/img/hero-1.png",
    alt: "Photo studio with a white cyclorama wall and softbox lighting",
    label: "Photo Studios · 1,240 spaces live",
  },
  {
    src: "/img/hero-2.png",
    alt: "Recording studio control room with a mixing console",
    label: "Music Suites · 457 spaces live",
  },
  {
    src: "/img/hero-3.png",
    alt: "Sunlit loft art workshop with easels and canvases",
    label: "Art Workshops · 276 spaces live",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-zinc-900">
      {/* Slides */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={900}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="h-full"
        >
          {SLIDES.map((slide, i) => (
            <SwiperSlide key={slide.src}>
              <div className="grain absolute inset-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Readability gradient */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-160 flex-col justify-end p-6 pb-16 sm:min-h-170 sm:p-12 sm:pb-20 lg:min-h-180">
        <div className="mb-auto flex items-center justify-between gap-3 pb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
            {SLIDES[active].label}
          </span>
          <span className="font-mono text-xs text-white/70">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-display text-4xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Book the room
            <br className="hidden sm:block" /> where your{" "}
            <em className="text-coral-300">best work</em> happens.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Hourly access to photo studios, sound stages, podcast rooms and art
            workshops — vetted by creators, ready the moment you arrive.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 hover:bg-coral-600"
            >
              Explore Studios <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
            >
              <House className="h-4 w-4" /> Host Your Space
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div
          className="mt-10 flex items-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => swiper?.slideToLoop(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-10 bg-white" : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}