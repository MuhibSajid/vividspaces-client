"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api-fetch";
import { useAuth } from "@/hooks/use-auth";
import { API_URL } from "@/lib/api";
import { PageLoader, SkeletonBlock } from "@/components/shared/loading";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Studio } from "@/types/studio";

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

type Action = { booking: Booking; status: "Confirmed" | "Completed" | "Cancelled" };

export default function DashboardPage() {
  const { user, isPending } = useAuth();
  const email = user?.email;

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [listingCount, setListingCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [declineTarget, setDeclineTarget] = useState<Booking | null>(null);

  useEffect(() => {
    if (!email) return;
    const q = encodeURIComponent(email);

    apiFetch("/api/bookings/host")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data: Booking[]) => setBookings(data))
      .catch(() => setFailed(true));

    fetch(`${API_URL}/api/studios?ownerEmail=${q}&limit=100`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Studio[]) => setListingCount(data.length))
      .catch(() => setListingCount(null));
  }, [email]);

  useEffect(() => {
    if (!declineTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busyId) setDeclineTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [declineTarget, busyId]);

  async function updateStatus({ booking, status }: Action) {
    setBusyId(booking._id);
    try {
      const res = await apiFetch(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? `Could not update the booking (error ${res.status})`);
        return;
      }

      setBookings(
        (prev) =>
          prev?.map((b) => (b._id === booking._id ? { ...b, status } : b)) ?? null,
      );
      const messages = {
        Confirmed: "Booking confirmed.",
        Completed: "Booking marked as completed.",
        Cancelled: "Booking declined.",
      };
      toast.success(messages[status]);
      setDeclineTarget(null);
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (isPending) return <PageLoader label="Checking your account" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Log in to see your dashboard</h1>
        <Link
          href="/signin"
          className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const earnings =
    bookings
      ?.filter((b) => b.status === "Completed")
      .reduce((sum, b) => sum + b.totalPrice, 0) ?? 0;
  const pendingCount = bookings?.filter((b) => b.status === "Pending").length ?? 0;
  const confirmedCount = bookings?.filter((b) => b.status === "Confirmed").length ?? 0;

  const stats = [
    { label: "Earnings (completed)", value: `$${earnings.toFixed(2)}` },
    { label: "Awaiting your reply", value: String(pendingCount) },
    { label: "Confirmed bookings", value: String(confirmedCount) },
    { label: "Active listings", value: listingCount === null ? "-" : String(listingCount) },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Welcome back, {user.name}</p>
          <h1 className="font-display text-4xl sm:text-5xl">Your studio dashboard</h1>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" /> Add New Studio
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Booking requests</h2>
        <Link href="/my-listings" className="text-sm font-medium text-coral-600 hover:underline dark:text-coral-400">
          Manage my listings
        </Link>
      </div>

      {failed ? (
        <p className="mt-6 text-sm text-zinc-500">
          We couldn&apos;t load your booking requests. Please try again.
        </p>
      ) : bookings === null ? (
        <SkeletonBlock className="mt-6 h-48 rounded-2xl" />
      ) : bookings.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="font-medium">No booking requests yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            When a creator books one of your studios, it will show up here.
          </p>
          <Link
            href="/add-studio"
            className="mt-5 inline-flex rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Add New Studio
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-205 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:bg-zinc-900/60">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Studio</th>
                <th scope="col" className="px-5 py-3 font-medium">Date &amp; time</th>
                <th scope="col" className="px-5 py-3 font-medium">Guest</th>
                <th scope="col" className="px-5 py-3 font-medium">Total</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {bookings.map((b) => {
                const style = STATUS_STYLES[b.status];
                const busy = busyId === b._id;
                return (
                  <tr key={b._id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                          <Image
                            src={b.studioImage}
                            alt=""
                            fill
                            unoptimized={b.studioImage.startsWith("http")}
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{b.studioTitle}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                      {b.date}
                      <br />
                      {b.startTime}–{b.endTime}
                    </td>
                    <td className="px-5 py-4">
                      {b.userName ?? "Guest"}
                      <span className="block text-xs text-zinc-500">{b.userEmail}</span>
                    </td>
                    <td className="px-5 py-4 font-medium">${b.totalPrice.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {b.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => updateStatus({ booking: b, status: "Confirmed" })}
                              className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
                            >
                              {busy ? "Saving..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setDeclineTarget(b)}
                              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {b.status === "Confirmed" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => updateStatus({ booking: b, status: "Completed" })}
                              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {busy ? "Saving..." : "Mark completed"}
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setDeclineTarget(b)}
                              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-red-500/10"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {(b.status === "Completed" || b.status === "Cancelled") && (
                          <span className="text-xs text-zinc-500">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Decline / cancel confirmation modal */}
      {declineTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !busyId && setDeclineTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="decline-title"
            aria-describedby="decline-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <TriangleAlert className="h-6 w-6" />
            </span>
            <h2 id="decline-title" className="mt-5 text-xl font-semibold">
              {declineTarget.status === "Pending" ? "Decline this request?" : "Cancel this booking?"}
            </h2>
            <p id="decline-desc" className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {declineTarget.userName ?? "The guest"}&apos;s booking for {declineTarget.studioTitle} on{" "}
              {declineTarget.date} will be cancelled. This can&apos;t be undone.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeclineTarget(null)}
                disabled={Boolean(busyId)}
                className="rounded-full border border-zinc-300 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={() => updateStatus({ booking: declineTarget, status: "Cancelled" })}
                disabled={Boolean(busyId)}
                className="rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busyId ? "Saving..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}