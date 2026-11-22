"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { API_URL } from "@/lib/api";
import { PageLoader, StudioGridSkeleton } from "@/components/shared/loading";
import { StudioCard } from "@/components/studios/studio-card";
import type { Studio } from "@/types/studio";

export default function MyListingsPage() {
  const { user, isPending } = useAuth();
  const email = user?.email;

  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!email) return;

    fetch(`${API_URL}/api/studios?ownerEmail=${encodeURIComponent(email)}&limit=100`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data: Studio[]) => setStudios(data))
      .catch(() => setFailed(true));
  }, [email]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) setTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, deleting]);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/studios/${target._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? "Could not delete the studio");
        return;
      }
      setStudios((prev) => prev?.filter((s) => s._id !== target._id) ?? null);
      toast.success(`"${target.title}" was deleted.`);
      setTarget(null);
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (isPending) return <PageLoader label="Checking your account" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Log in to see your listings</h1>
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl">My Studio Listings</h1>
        <Link
          href="/add-studio"
          className="rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Add New Studio
        </Link>
      </div>

      {failed ? (
        <p className="mt-12 text-sm text-zinc-500">
          We couldn&apos;t load your listings. Please try again.
        </p>
      ) : studios === null ? (
        <StudioGridSkeleton count={3} className="mt-12" />
      ) : studios.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="font-medium">You haven&apos;t listed a studio yet</p>
          <Link
            href="/add-studio"
            className="mt-5 inline-flex rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Add your first studio
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((s) => (
            <div key={s._id} className="flex h-full flex-col">
              <div className="flex-1">
                <StudioCard studio={s} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/studios/edit/${s._id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <Pencil className="h-4 w-4" /> Update
                </Link>
                <button
                  type="button"
                  onClick={() => setTarget(s)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {target && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <TriangleAlert className="h-6 w-6" />
            </span>
            <h2 id="delete-title" className="mt-5 text-xl font-semibold">
              Delete &ldquo;{target.title}&rdquo;?
            </h2>
            <p id="delete-desc" className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              This permanently removes the listing. This action can&apos;t be undone.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget(null)}
                disabled={deleting}
                className="rounded-full border border-zinc-300 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Keep listing
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}