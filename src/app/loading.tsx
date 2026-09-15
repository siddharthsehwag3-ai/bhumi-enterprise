import { BatteryCharging } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-[#f4f8f5]/90 px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
          <span className="absolute inset-0 animate-ping rounded-3xl bg-emerald-200/70" />

          <BatteryCharging
            size={38}
            className="relative animate-pulse"
            strokeWidth={1.9}
          />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
          Bhumi Enterprise
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-slate-950">
          Loading information
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Please wait a moment.
        </p>

        <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-1/2 animate-[loadingBar_1.2s_ease-in-out_infinite] rounded-full bg-emerald-600" />
        </div>
      </div>
    </main>
  );
}