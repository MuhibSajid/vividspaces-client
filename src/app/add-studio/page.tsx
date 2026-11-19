"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { AMENITIES, CATEGORIES } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type Errors = Record<string, string>;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-500/15 dark:border-zinc-700";
const readOnlyClass = `${inputClass} cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-900`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-red-600">{message}</span>;
}

export default function AddStudioPage() {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const category = String(form.get("category") ?? "");
    const hourlyRate = Number(form.get("hourlyRate"));
    const securityDeposit = Number(form.get("securityDeposit"));
    const maxCapacity = Number(form.get("maxCapacity"));
    const location = String(form.get("location") ?? "").trim();
    const image = String(form.get("image") ?? "").trim();
    const overview = String(form.get("overview") ?? "").trim();
    const amenities = form.getAll("amenities").map(String);

    const found: Errors = {};
    if (title.length < 3) found.title = "Please enter a studio title";
    if (!category) found.category = "Please choose a category";
    if (!(hourlyRate > 0)) found.hourlyRate = "Enter an hourly rate above 0";
    if (!(securityDeposit >= 0)) found.securityDeposit = "Enter a deposit of 0 or more";
    if (!(maxCapacity > 0)) found.maxCapacity = "Enter a capacity above 0";
    if (location.length < 3) found.location = "Please enter the location";
    try {
      new URL(image);
    } catch {
      found.image = "Please enter a valid image URL";
    }
    if (overview.length < 20) {
      found.overview = "Describe your studio in at least 20 characters";
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/studios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          hourlyRate,
          securityDeposit,
          maxCapacity,
          location,
          image,
          amenities,
          overview,
          ownerName: user.name,
          ownerEmail: user.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? "Could not add the studio");
        return;
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="h-96 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Log in to add a studio</h1>
        <p className="mt-2 text-sm text-zinc-500">
          You need an account to list your space on VividSpaces.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
        Host your space
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        Add New Studio
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        List your space and start earning from creators nearby.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 grid gap-6 rounded-3xl border border-zinc-200 p-6 sm:p-8 md:grid-cols-2 dark:border-zinc-800"
      >
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Studio title</span>
          <input name="title" placeholder="e.g. Halo Cyc Studio" className={inputClass} />
          <FieldError message={errors.title} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            name="category"
            defaultValue=""
            className={`${inputClass} dark:bg-zinc-950`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FieldError message={errors.category} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Location / address</span>
          <input name="location" placeholder="e.g. Bushwick, Brooklyn" className={inputClass} />
          <FieldError message={errors.location} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Hourly rate ($)</span>
          <input name="hourlyRate" type="number" min="1" step="1" placeholder="85" className={inputClass} />
          <FieldError message={errors.hourlyRate} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Security deposit ($)</span>
          <input name="securityDeposit" type="number" min="0" step="1" placeholder="150" className={inputClass} />
          <FieldError message={errors.securityDeposit} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Max capacity (people)</span>
          <input name="maxCapacity" type="number" min="1" step="1" placeholder="12" className={inputClass} />
          <FieldError message={errors.maxCapacity} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Image URL</span>
          <input name="image" placeholder="https://..." className={inputClass} />
          <FieldError message={errors.image} />
        </label>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium">Amenities</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <label
                key={a}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm has-checked:border-coral-500 has-checked:bg-coral-50 has-checked:text-coral-700 dark:border-zinc-700 dark:has-checked:bg-coral-500/10 dark:has-checked:text-coral-300"
              >
                <input type="checkbox" name="amenities" value={a} className="accent-coral-500" />
                {a}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Detailed overview</span>
          <textarea
            name="overview"
            rows={5}
            placeholder="Describe the space, the gear, and who it suits best."
            className={`${inputClass} resize-none`}
          />
          <FieldError message={errors.overview} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Host name</span>
          <input value={user.name} readOnly className={readOnlyClass} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Host email</span>
          <input value={user.email} readOnly className={readOnlyClass} />
        </label>

        <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-6 md:col-span-2 dark:border-zinc-800">
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
          >
            {loading ? "Adding studio..." : "Add Studio"}
          </button>
        </div>
      </form>
    </section>
  );
}