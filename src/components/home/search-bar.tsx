"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";

export function SearchBar() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const location = String(data.get("location") ?? "").trim();
    const category = String(data.get("category") ?? "");
    const date = String(data.get("date") ?? "");

    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (date) params.set("date", date);

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios");
  }

  const fieldClass =
    "rounded-full px-5 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800";
  const labelClass =
    "block text-[11px] font-semibold uppercase tracking-wider text-zinc-500";
  const inputClass =
    "w-full bg-transparent text-sm outline-none placeholder:text-zinc-400";

  return (
    <div className="relative z-20 mx-auto -mt-9 max-w-4xl px-2">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-1 rounded-3xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10 sm:grid-cols-[1fr_1fr_1fr_auto] sm:rounded-full dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className={fieldClass}>
          <span className={labelClass}>Where</span>
          <input
            name="location"
            placeholder="Brooklyn, NY"
            className={inputClass}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>Space type</span>
          <select
            name="category"
            defaultValue=""
            className={`${inputClass} dark:bg-zinc-900`}
          >
            <option value="">Any type</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>When</span>
          <input
            name="date"
            type="date"
            className={`${inputClass} dark:scheme-dark`}
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-coral-500 dark:hover:bg-coral-600"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </form>
    </div>
  );
}