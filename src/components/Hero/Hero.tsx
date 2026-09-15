import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  Battery,
  CheckCircle2,
  ShieldCheck,
  Wifi,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[calc(100vh-78px)] overflow-hidden bg-[#e5ece7]"
    >
      <Image
        src="/bhumi-hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-center brightness-[0.82] saturate-[1.08]"
      />

      <div className="absolute inset-0 -z-20 bg-slate-950/10" />

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#edf2ee] via-[#edf2ee]/92 to-slate-900/15" />

      <div className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm backdrop-blur">
            <ShieldCheck size={17} />
            Established 2022
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800 sm:text-base">
            Welcome to Bhumi Enterprise
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Reliable power.
            <span className="mt-2 block text-emerald-700">
              Dependable connection.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-xl font-bold leading-8 text-slate-900">
            Authorised Tata Green Batteries Distributor
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            Geon &amp; Amaron Batteries Available
          </p>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
            Battery sales, free installation, free battery checkup and
            WiFi assistance for homes, businesses and vehicle owners.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/#batteries"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-800"
            >
              <Battery size={19} />
              Explore Batteries
              <ArrowDown size={17} />
            </Link>

            <Link
              href="/#wifi-services"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white/90 px-6 py-3.5 font-semibold text-sky-900 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-sky-600"
            >
              <Wifi size={19} />
              Explore WiFi Services
              <ArrowDown size={17} />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {[
              "Free battery installation",
              "Free battery checkup",
              "Airtel WiFi support",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur"
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-700"
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}