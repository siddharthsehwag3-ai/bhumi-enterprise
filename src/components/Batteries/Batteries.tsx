import Link from "next/link";
import {
  ArrowRight,
  Battery,
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Factory,
  Home,
  Power,
  Tractor,
  Truck,
  Zap,
} from "lucide-react";
import { getPublishedBatteryCategories } from "@/lib/battery-database";

const categoryIcons = {
  "two-wheeler": Bike,
  "car-muv-suv": Car,
  tractor: Tractor,
  "commercial-vehicle": Truck,
  "e-rickshaw": Bus,
  inverter: Home,
  genset: Power,
  industrial: Factory,
  "inverter-ups": Zap,
};

export default async function Batteries() {
  const categories = await getPublishedBatteryCategories();

  return (
    <section
      id="batteries"
      className="relative overflow-hidden bg-[#f7faf8]/90 px-5 py-20 sm:px-6 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative z-20 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Battery Solutions
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Find Power for
            <span className="block text-emerald-700">
              Every Requirement
            </span>
          </h2>

          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            Select a battery category and explore available Tata
            Green battery options from Bhumi Enterprise.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5">
            <CheckCircle2
              size={25}
              className="shrink-0 text-emerald-700"
            />

            <div>
              <h3 className="font-bold text-slate-900">
                Free Battery Installation
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Free installation assistance from Bhumi Enterprise.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5">
            <CheckCircle2
              size={25}
              className="shrink-0 text-emerald-700"
            />

            <div>
              <h3 className="font-bold text-slate-900">
                Free Battery Checkup
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Battery health checkup without an additional charge.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon =
              categoryIcons[
                category.slug as keyof typeof categoryIcons
              ] ?? Battery;

            return (
              <Link
                key={category.databaseId}
                href={`/batteries/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                <div className="absolute left-0 top-0 h-1 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                  {category.title}
                </h3>

                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 group-hover:gap-3">
                  Explore category
                  <ArrowRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-emerald-100 bg-white/90 px-7 py-8 text-center shadow-sm md:px-10">
          <p className="text-lg font-semibold text-slate-900">
            Don&apos;t know which battery fits your vehicle?
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Open the battery catalogue or contact Bhumi Enterprise
            before purchasing. Exact vehicle recommendations will be
            shown only after compatibility is confirmed.
          </p>

          <Link
            href="/batteries"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
          >
            Open Battery Finder
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}