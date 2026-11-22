import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HardDrive,
  Headphones,
  ShieldCheck,
  Umbrella,
} from "lucide-react";

const ITEMS = [
  { icon: Umbrella, title: "Liability Protection", text: "Host liability coverage on every confirmed session." },
  { icon: BadgeCheck, title: "Verified Profiles", text: "Identity and portfolio checks for every guest." },
  { icon: HardDrive, title: "Equipment Safety", text: "Damage reimbursement for lights, rigs and audio gear." },
  { icon: Headphones, title: "24/7 Support", text: "Real humans on call whenever a session needs help." },
];

export function HostGuarantee() {
  return (
    <section id="guarantee" className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-zinc-900 p-8 text-white sm:p-14 dark:ring-1 dark:ring-zinc-800">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-500/15 px-3 py-1 text-xs font-medium text-coral-300 ring-1 ring-coral-500/30">
              <ShieldCheck className="h-3.5 w-3.5" /> VividSpaces Host Guarantee
            </span>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Open your doors. <em className="text-coral-300">We&apos;ve got the rest.</em>
            </h2>
            <p className="mt-4 text-white/70">
              Every booking is backed by liability protection, identity checks
              and a support team that never clocks out.
            </p>
            <Link
              href="/add-studio"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              Become a host <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ITEMS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex h-full flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <Icon className="h-6 w-6 text-coral-300" />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-white/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}