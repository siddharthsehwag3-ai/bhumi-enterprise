import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Battery,
  Bike,
  Bus,
  Car,
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

export const dynamic = "force-dynamic";

export default async function BatteriesPage() {
  const categories = await getPublishedBatteryCategories();

  return (
    <main className="relative min-h-screen bg-[#f4f8f5]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={17} />
          Back to homepage
        </Link>

        <div className="mt-12 max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Battery size={29} />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Battery Catalogue
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            Choose your battery category
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
            Select a category to explore available Tata Green
            battery products. Vehicle matching will recommend only
            compatibility records confirmed by Bhumi Enterprise.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Battery
              size={40}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Battery catalogue is being updated
            </h2>

            <p className="mt-2 text-slate-600">
              Please contact Bhumi Enterprise for battery
              assistance.
            </p>
          </div>
        ) : (
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
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-xl"
                >
                  <div className="absolute left-0 top-0 h-1 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />

                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon size={25} />
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-emerald-700">
                    {category.title}
                  </h2>

                  <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all group-hover:gap-3">
                    Open category
                    <ArrowRight size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}