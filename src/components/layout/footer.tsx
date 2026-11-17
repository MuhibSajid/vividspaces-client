"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import { Aperture } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how" },
  { label: "Host Guarantee", href: "/#guarantee" },
  { label: "Add Your Studio", href: "/add-studio" },
];

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-4 w-4",
  "aria-hidden": true,
} as const;

const SOCIALS = [
  {
    label: "VividSpaces on X",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "VividSpaces on Instagram",
    icon: (
      <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "VividSpaces on YouTube",
    icon: (
      <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "VividSpaces on LinkedIn",
    icon: (
      <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export function Footer() {
  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    toast.success("You're subscribed! Watch your inbox every other Thursday.");
    form.reset();
  }

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-coral-400 dark:bg-white dark:text-coral-500">
              <Aperture className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Vivid<span className="text-coral-500">Spaces</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            We connect independent creators with the rooms, gear and hosts that
            turn ideas into finished work — one hour at a time.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 transition hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:hover:bg-white dark:hover:text-zinc-900"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold">Quick links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold">Studio categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {category}s
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold">The Studio Letter</h4>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            New spaces, host stories and booking deals — every other Thursday.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="mt-4 flex gap-2 rounded-full border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="you@studio.com"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:px-6">
          <p>&copy; 2026 VividSpaces, Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Terms</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}