"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api-fetch";
import { useAuth } from "@/hooks/use-auth";
import { API_URL } from "@/lib/api";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading";
import type { Studio } from "@/types/studio";

type Props = {
  id: string;
};

type Errors = Record<string, string>;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-500/15 dark:border-zinc-700";
const readOnlyClass = `${inputClass} cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-900`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-red-600">{message}</span>;
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">{text}</p>
      <Link
        href="/my-listings"
        className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
      >
        Back to my listings
      </Link>
    </div>
  );
}

export function EditStudioForm({ id }: Props) {
  const router = useRouter();
  const { user, isPending } = useAuth();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "failed">("loading");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/studios/${id}`)
      .then(async (res) => {
        if (res.status === 404 || res.status === 400) {
          setStatus("missing");
          return;
        }
        if (!res.ok) throw new Error("Request failed");
        setStudio(await res.json());
        setStatus("ready");
      })
      .catch(() => setStatus("failed"));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    setSaving(true);
    try {
      const res = await apiFetch(`/api/studios/${id}`, {
        method: "PUT",
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
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? `Could not update the studio (error ${res.status})`);
        return;
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || status === "loading") {
    return <FormSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Log in to edit a studio</h1>
        <Link
          href="/signin"
          className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (status === "missing") {
    return <Notice title="Studio not found" text="This listing may have been deleted." />;
  }
  if (status === "failed" || !studio) {
    return <Notice title="Something went wrong" text="We couldn't load this studio. Please try again." />;
  }
  if (studio.ownerEmail !== user.email) {
    return <Notice title="This isn't your studio" text="You can only edit studios that you listed." />;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
        Manage listing
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        Update Studio
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 grid gap-6 rounded-3xl border border-zinc-200 p-6 sm:p-8 md:grid-cols-2 dark:border-zinc-800"
      >
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Studio title</span>
          <input name="title" defaultValue={studio.title} className={inputClass} />
          <FieldError message={errors.title} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            name="category"
            defaultValue={studio.category}
            className={`${inputClass} dark:bg-zinc-950`}
          >
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
          <input name="location" defaultValue={studio.location} className={inputClass} />
          <FieldError message={errors.location} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Hourly rate ($)</span>
          <input name="hourlyRate" type="number" min="1" step="1" defaultValue={studio.hourlyRate} className={inputClass} />
          <FieldError message={errors.hourlyRate} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Security deposit ($)</span>
          <input name="securityDeposit" type="number" min="0" step="1" defaultValue={studio.securityDeposit ?? 0} className={inputClass} />
          <FieldError message={errors.securityDeposit} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Max capacity (people)</span>
          <input name="maxCapacity" type="number" min="1" step="1" defaultValue={studio.maxCapacity} className={inputClass} />
          <FieldError message={errors.maxCapacity} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Image URL</span>
          <input name="image" defaultValue={studio.image} className={inputClass} />
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
                <input
                  type="checkbox"
                  name="amenities"
                  value={a}
                  defaultChecked={studio.amenities?.includes(a)}
                  className="accent-coral-500"
                />
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
            defaultValue={studio.overview}
            className={`${inputClass} resize-none`}
          />
          <FieldError message={errors.overview} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Host name</span>
          <input value={studio.ownerName ?? user.name} readOnly className={readOnlyClass} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Host email</span>
          <input value={studio.ownerEmail ?? user.email} readOnly className={readOnlyClass} />
        </label>

        <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-6 md:col-span-2 dark:border-zinc-800">
          <Link
            href="/my-listings"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
