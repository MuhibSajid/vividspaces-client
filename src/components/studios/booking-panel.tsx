"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { API_URL } from "@/lib/api";

type Props = {
  studio: {
    _id: string;
    title: string;
    hourlyRate: number;
    securityDeposit: number;
    ownerEmail: string;
  };
};

const CREW_SIZES = ["1–5 people", "6–10 people", "11–25 people", "26+ people"];

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-500/15 dark:border-zinc-700 dark:[color-scheme:dark]";

export function BookingPanel({ studio }: Props) {
  const router = useRouter();
  const { user, isPending } = useAuth();

  const [open, setOpen] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("14:00");
  const [crew, setCrew] = useState(CREW_SIZES[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hours =
    start && end && toMinutes(end) > toMinutes(start)
      ? (toMinutes(end) - toMinutes(start)) / 60
      : 0;
  const total = hours * studio.hourlyRate;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading]);

  function openModal() {
    if (isPending) return;
    if (!user) {
      toast.info("Please log in to book a studio.");
      router.push("/signin");
      return;
    }
    if (user.email === studio.ownerEmail) {
      toast.error("You can't book your own studio.");
      return;
    }
    setMinDate(new Date().toISOString().slice(0, 10));
    setError("");
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    if (!date) return setError("Please choose a date.");
    if (hours <= 0) return setError("End time must be after the start time.");
    setError("");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime: start,
          endTime: end,
          crewSize: crew,
          userEmail: user.email,
          userName: user.name,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message ?? "Could not create the booking.");
        toast.error(data?.message ?? "Could not create the booking.");
        return;
      }

      toast.success("Booking request sent! It stays pending until the host confirms.");
      setOpen(false);
    } catch {
      toast.error("Can't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
        <p>
          <span className="text-3xl font-semibold">${studio.hourlyRate}</span>
          <span className="text-zinc-500"> / hr</span>
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Security deposit: ${studio.securityDeposit}
        </p>
        <button
          type="button"
          onClick={openModal}
          className="mt-5 w-full rounded-full bg-coral-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/25 hover:bg-coral-600"
        >
          Book Workspace Now
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500">
          Your request stays pending until the host confirms it.
        </p>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !loading && setOpen(false)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            noValidate
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 id="booking-title" className="pr-8 text-xl font-semibold">
              Book {studio.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose your date and shoot hours.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-medium">Date</span>
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Start</span>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">End</span>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium">Crew size</span>
              <select
                value={crew}
                onChange={(e) => setCrew(e.target.value)}
                className={`${fieldClass} dark:bg-zinc-900`}
              >
                {CREW_SIZES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </p>
            )}

            <dl className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
              <div className="flex justify-between">
                <dt className="text-zinc-600 dark:text-zinc-400">
                  ${studio.hourlyRate} × {hours} {hours === 1 ? "hour" : "hours"}
                </dt>
                <dd>${total.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-full border border-zinc-300 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-coral-500 py-2.5 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
              >
                {loading ? "Booking..." : "Confirm booking"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}