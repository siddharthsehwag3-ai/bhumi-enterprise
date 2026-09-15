"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Home,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Bhumi Enterprise page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f4f8f5] px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-700">
          <TriangleAlert
            size={38}
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-red-700">
          Something went wrong
        </p>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          This page could not be loaded
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
          A temporary problem occurred while loading this
          information. You can try again without losing your place
          or return to the homepage.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <RefreshCw size={18} />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600 hover:text-emerald-700"
          >
            <Home size={18} />
            Go to homepage
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-slate-400">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}