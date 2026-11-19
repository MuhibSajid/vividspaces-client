"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PasswordInput } from "@/components/auth/password-input";
import { authClient } from "@/lib/auth-client";

type Errors = { email?: string; password?: string };

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-500/15 dark:border-zinc-700";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-red-600">{message}</span>;
}

export default function SigninPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const found: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      found.email = "Please enter a valid email address";
    }
    if (!password) found.password = "Password is required";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Invalid email or password");
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) toast.error(error.message ?? "Google sign-in failed");
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-16">
      <form
        onSubmit={handleEmailSignIn}
        noValidate
        className="w-full rounded-3xl border border-zinc-200 p-8 dark:border-zinc-800"
      >
        <h1 className="font-display text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Log in to manage bookings and listings.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            className={inputClass}
          />
          <FieldError message={errors.email} />
        </label>

       <label className="mt-4 block">
          <span className="flex justify-between text-sm font-medium">
            Password
            <button
              type="button"
              onClick={() => toast.info("Password reset isn't available yet.")}
              className="font-normal text-coral-600 hover:underline dark:text-coral-400"
            >
              Forgot password?
            </button>
          </span>
          <PasswordInput
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
          />
          <FieldError message={errors.password} />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          or
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4.01-3.1z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-zinc-500">
          New to VividSpaces?{" "}
          <Link
            href="/signup"
            className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-white"
          >
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
}