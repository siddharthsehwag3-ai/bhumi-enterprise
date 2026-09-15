import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  MessageCircle,
  Router,
  ShieldCheck,
  Wifi,
  Wrench,
} from "lucide-react";
import {
  createWhatsappUrl,
  getSiteSettings,
} from "@/lib/site-settings";
import { getPublishedWifiServices } from "@/lib/wifi-database";

const iconBySlug = {
  installation: Wifi,
  "router-configuration": Router,
  repair: Wrench,
  "coverage-assistance": Gauge,
  maintenance: ShieldCheck,
};

export default async function WifiServices() {
  const [services, settings] = await Promise.all([
    getPublishedWifiServices(),
    getSiteSettings(),
  ]);

  const whatsappUrl = createWhatsappUrl(
    settings,
    `Hello ${settings.businessName}, I need help with a WiFi service.`,
  );

  return (
    <section
      id="wifi-services"
      className="relative overflow-hidden bg-white/85 px-5 py-20 sm:px-6 sm:py-24"
    >
      <div className="relative z-30 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
            WiFi Services
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Select Your
            <span className="block text-sky-700">
              Connectivity Requirement
            </span>
          </h2>

          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            Choose a service and answer a few relevant questions so
            {` ${settings.businessName} `}can understand your
            requirement.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-xl items-center gap-4 rounded-2xl border border-sky-200 bg-sky-50/95 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white">
            <Wifi size={21} />
          </div>

          <div>
            <p className="text-sm font-medium text-sky-700">
              Supported ISP
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {settings.supportedIsp}
            </p>
          </div>

          <CheckCircle2
            size={22}
            className="ml-auto shrink-0 text-sky-700"
          />
        </div>

        {services.length === 0 ? (
          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Wifi
              size={40}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              WiFi services are being updated
            </h3>

            <p className="mt-2 text-slate-600">
              Contact {settings.businessName} directly for
              assistance.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon =
                iconBySlug[
                  service.slug as keyof typeof iconBySlug
                ] ?? Wifi;

              return (
                <Link
                  key={service.databaseId}
                  href={`/wifi-services/${service.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:border-sky-500 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-200"
                >
                  <div className="absolute left-0 top-0 h-1 w-0 bg-sky-600 transition-all duration-300 group-hover:w-full" />

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700">
                    {service.title}
                  </h3>

                  <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-sky-700 transition group-hover:gap-3">
                    Describe requirement
                    <ArrowRight size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-sky-100 bg-white px-7 py-8 text-center shadow-sm md:px-10">
          <p className="text-lg font-semibold text-slate-900">
            Have a different WiFi question?
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Contact {settings.businessName} directly on WhatsApp for
            general WiFi assistance.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1fbd5a] hover:shadow-lg"
          >
            <MessageCircle size={19} />
            Request Assistance on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}