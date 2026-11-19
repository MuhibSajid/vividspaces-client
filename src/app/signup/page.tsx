"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PasswordInput } from "@/components/auth/password-input";
import { authClient } from "@/lib/auth-client";

type Values = { name: string; email: string; image: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const errors: Errors = {};

  if (v.name.trim().length < 2) errors.name = "Please enter your name";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) {
    errors.email = "Please enter a valid email address";
  }
  try {
    new URL(v.image);
  } catch {
    errors.image = "Please enter a valid image URL";
  }

  if (v.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (!/[A-Z]/.test(v.password)) {
    errors.password = "Password must have an uppercase letter";
  } else if (!/[a-z]/.test(v.password)) {
    errors.password = "Password must have a lowercase letter";
  }

  return errors;
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-500/15 dark:border-zinc-700";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-red-600">{message}</span>;
}

export default function SignupPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleEmailSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user: Values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      image: String(formData.get("image") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const found = validate(user);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { error } = await authClient.signUp.email(user);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }

    toast.success("Account created! Please log in.");
    router.push("/signin");
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
        onSubmit={handleEmailSignUp}
        noValidate
        className="w-full rounded-3xl border border-zinc-200 p-8 dark:border-zinc-800"
      >
        <h1 className="font-display text-3xl">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Join creators booking and hosting spaces.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-medium">Name</span>
          <input name="name" autoComplete="name" placeholder="Your full name" className={inputClass} />
          <FieldError message={errors.name} />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@studio.com" className={inputClass} />
          <FieldError message={errors.email} />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Photo URL</span>
          <input name="image" placeholder="https://..." className={inputClass} />
          <FieldError message={errors.image} />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Password</span>
          <PasswordInput
            name="password"
            autoComplete="new-password"
            placeholder="Min 6 characters"
          />
          <FieldError message={errors.password} />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-coral-500 py-3 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
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
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-white">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}