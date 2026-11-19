"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";

const SORTS = [
  { value: "", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const fieldClass =
  "mt-1 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400";
const boxClass =
  "rounded-2xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-800";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters = ["search", "location", "category", "sort"].some((k) =>
    searchParams.get(k),
  );

  function apply(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();

    for (const key of ["search", "location", "category", "sort"]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios");
  }

  return (
    <form
      key={searchParams.toString()}
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
      }}
      className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
    >
      <label className={boxClass}>
        <span className={labelClass}>Search</span>
        <input
          name="search"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Studio name"
          className={fieldClass}
        />
      </label>

      <label className={boxClass}>
        <span className={labelClass}>Location</span>
        <input
          name="location"
          defaultValue={searchParams.get("location") ?? ""}
          placeholder="e.g. Dhaka"
          className={fieldClass}
        />
      </label>

      <label className={boxClass}>
        <span className={labelClass}>Category</span>
        <select
          name="category"
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) => e.currentTarget.form && apply(e.currentTarget.form)}
          className={`${fieldClass} dark:bg-zinc-950`}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className={boxClass}>
        <span className={labelClass}>Sort by</span>
        <select
          name="sort"
          defaultValue={searchParams.get("sort") ?? ""}
          onChange={(e) => e.currentTarget.form && apply(e.currentTarget.form)}
          className={`${fieldClass} dark:bg-zinc-950`}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-stretch gap-2">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          <Search className="h-4 w-4" /> Search
        </button>
        {hasFilters && (
          <Link
            href="/studios"
            className="inline-flex items-center rounded-full border border-zinc-300 px-4 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}