import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="fixed inset-0 z-100 flex min-h-screen items-center justify-center bg-[#f4f8f5] px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
          <SearchX size={38} strokeWidth={1.8} />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
          The page you requested is unavailable or is still being prepared.
          Return to the Bhumi Enterprise homepage to continue.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
          >
            <Home size={18} />
            Go to homepage
          </Link>

          <Link
            href="/batteries"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={18} />
            View batteries
          </Link>
        </div>
      </div>
    </main>
  );
}