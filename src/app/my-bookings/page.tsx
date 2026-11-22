"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/use-auth";
import { ListSkeleton, PageLoader } from "@/components/shared/loading";
import type { Booking, BookingStatus } from "@/types/booking";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const STATUS_STYLES: Record<BookingStatus, { badge: string; dot: string }> = {
  Pending: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Confirmed: {
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  Completed: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    badge: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500",
  },
};

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

export default function MyBookingsPage() {
  const { user, isPending } = useAuth();
  const email = user?.email;

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [target, setTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!email) return;

    fetch(`${API_URL}/api/bookings?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data: Booking[]) => setBookings(data))
      .catch(() => setFailed(true));
  }, [email]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !cancelling) setTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, cancelling]);

  async function confirmCancel() {
    if (!target) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${target._id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? "Could not cancel the booking");
        return;
      }
      setBookings(
        (prev) =>
          prev?.map((b) =>
            b._id === target._id ? { ...b, status: "Cancelled" } : b,
          ) ?? null,
      );
      toast.success("Your booking was cancelled.");
      setTarget(null);
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  if (isPending) return <PageLoader label="Checking your account" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Log in to see your bookings</h1>
        <Link
          href="/signin"
          className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const visible =
    bookings?.filter((b) => filter === "All" || b.status === filter) ?? [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
        Your reservations
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        My Bookings
      </h1>

      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 font-medium transition ${
              filter === f
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {failed ? (
        <p className="mt-10 text-sm text-zinc-500">
          We couldn&apos;t load your bookings. Please try again.
        </p>
      ) : bookings === null ? (
        <ListSkeleton rows={3} className="mt-10" />
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="font-medium">
            {bookings.length === 0
              ? "You haven't booked a studio yet"
              : `No ${filter.toLowerCase()} bookings`}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Find a space that fits your next shoot.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {visible.map((b) => {
            const style = STATUS_STYLES[b.status];
            return (
              <li
                key={b._id}
                className="flex flex-col gap-5 rounded-3xl border border-zinc-200 p-4 sm:flex-row sm:items-center dark:border-zinc-800"
              >
                <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:w-44 dark:bg-zinc-900">
                  <Image
                    src={b.studioImage}
                    alt=""
                    fill
                    unoptimized={b.studioImage.startsWith("http")}
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="truncate text-lg font-semibold hover:underline"
                    >
                      {b.studioTitle}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="inline-flex items-center gap-1.5">
                      <CalendarCheck className="h-4 w-4" />
                      {b.date}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {b.startTime} – {b.endTime} ({b.hours}{" "}
                      {b.hours === 1 ? "hour" : "hours"}) · {b.crewSize}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {b.studioLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-xl font-semibold">
                    ${b.totalPrice.toFixed(2)}
                  </p>
                  {b.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setTarget(b)}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Cancel confirmation modal */}
      {target && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !cancelling && setTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            aria-describedby="cancel-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <TriangleAlert className="h-6 w-6" />
            </span>
            <h2 id="cancel-title" className="mt-5 text-xl font-semibold">
              Cancel this booking?
            </h2>
            <p
              id="cancel-desc"
              className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              Your request for {target.studioTitle} on {target.date} will be
              cancelled. This can&apos;t be undone.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget(null)}
                disabled={cancelling}
                className="rounded-full border border-zinc-300 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancelling}
                className="rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}