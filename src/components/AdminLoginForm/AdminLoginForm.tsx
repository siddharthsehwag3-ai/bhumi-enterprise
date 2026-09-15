"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

type AdminLoginFormProps = {
  passwordReset?: boolean;
};

export default function AdminLoginForm({
  passwordReset = false,
}: AdminLoginFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const login = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Login failed. Check your email and password.",
        );
      }

      router.replace(result.redirectTo || "/admin");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={login}
      className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <LockKeyhole size={27} />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-slate-950">
        Admin login
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Authorised Bhumi Enterprise administrators only.
      </p>

      {passwordReset && (
        <div
          role="status"
          className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-800"
        >
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>
            Your password was changed successfully. Sign in with
            your new password.
          </span>
        </div>
      )}

      <label className="mt-7 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Admin email
        </span>

        <div className="relative">
          <Mail
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            required
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Enter your administrator email"
            className="h-13 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </label>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </span>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            required
            minLength={10}
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-13 w-full rounded-xl border border-slate-300 pl-11 pr-12 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (currentValue) => !currentValue,
              )
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </label>

      <div className="mt-4 flex justify-end">
        <Link
          href="/admin/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
        >
          <KeyRound size={16} />
          Forgot password?
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <LoaderCircle
            size={19}
            className="animate-spin"
          />
        ) : (
          <LogIn size={19} />
        )}

        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}