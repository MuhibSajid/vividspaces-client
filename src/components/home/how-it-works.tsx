import { Clock4, Compass, Sparkles, Zap } from "lucide-react";

const STEPS = [
  { icon: Compass, title: "Discover Spaces", text: "Filter by medium, gear and neighborhood to find a room that fits the brief." },
  { icon: Clock4, title: "Select Shoot Hours", text: "Pick a date and block of hours and send your request in seconds." },
  { icon: Zap, title: "Book Instantly", text: "Confirm your request and track it from My Bookings." },
  { icon: Sparkles, title: "Create & Produce", text: "Walk in, plug in, and make the thing. Wrap up with the host when you finish." },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-coral-600 dark:text-coral-400">
          How booking works
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          From idea to set in four steps
        </h2>
      </div>

      <ol className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div
          className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-linear-to-r from-coral-400 via-zinc-300 to-coral-400 md:block dark:via-zinc-700"
          aria-hidden="true"
        />
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative flex h-full flex-col items-center text-center">
            <span
              className={`relative z-10 grid h-14 w-14 place-items-center rounded-2xl ${
                i === 0
                  ? "bg-coral-500 text-white shadow-lg shadow-coral-500/30"
                  : "border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              }`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="mt-6 font-mono text-xs text-zinc-500">
              STEP {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 text-lg font-semibold">{title}</h3>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}