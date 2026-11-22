import Link from "next/link";

type Action = {
  label: string;
  href: string;
};

/**
 * Shared 404 layout, so the global and route-level not-found pages stay
 * visually consistent with the rest of the site.
 */
export function NotFoundView({
  code = "404",
  title,
  description,
  primary,
  secondary,
}: {
  code?: string;
  title: string;
  description: string;
  primary: Action;
  secondary?: Action;
}) {
  return (
    <section className="mx-auto grid max-w-3xl place-items-center px-4 py-24 text-center sm:px-6">
      <p
        aria-hidden="true"
        className="font-display text-8xl leading-none text-zinc-200 sm:text-9xl dark:text-zinc-800"
      >
        {code}
      </p>

      <h1 className="mt-8 font-display text-4xl leading-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={primary.href}
          className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          {primary.label}
        </Link>
        {secondary && (
          <Link
            href={secondary.href}
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
