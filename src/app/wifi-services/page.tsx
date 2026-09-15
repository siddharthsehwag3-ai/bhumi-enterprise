import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Wifi,
} from "lucide-react";
import { createWhatsappUrl } from "@/lib/site-settings";
import {
  getCachedSiteSettings,
  getCachedWifiServices,
} from "@/lib/public-data-cache";

export const dynamic = "force-dynamic";

export default async function WifiServicesPage() {
  const [services, settings] = await Promise.all([
    getCachedWifiServices(),
    getCachedSiteSettings(),
  ]);

  const generalWhatsappUrl = createWhatsappUrl(
    settings,
    `Hello ${settings.businessName}, I need help choosing the correct WiFi service.`,
  );

  return (
    <main className="relative min-h-screen bg-[#f4f8fb]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft size={17} />
          Back to homepage
        </Link>

        <div className="mt-12 max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <Wifi size={29} />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
            {settings.businessName} WiFi Services
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            Choose a connectivity service
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
            Select your requirement and answer a few relevant
            questions. Your completed information will be prepared
            in WhatsApp for {settings.businessName}.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3">
            <Wifi size={19} className="text-sky-700" />

            <p className="text-sm font-semibold text-sky-900">
              Supported ISP: {settings.supportedIsp}
            </p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Wifi
              size={40}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Services are being updated
            </h2>

            <p className="mt-2 text-slate-600">
              Contact {settings.businessName} directly for WiFi
              assistance.
            </p>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white hover:bg-[#1fbd5a]"
            >
              <MessageCircle size={18} />
              Contact on WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.databaseId}
                href={`/wifi-services/${service.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-500 hover:shadow-xl"
              >
                <div className="absolute left-0 top-0 h-1 w-0 bg-sky-600 transition-all duration-300 group-hover:w-full" />

                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white">
                  <Wifi size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-sky-700">
                  {service.title}
                </h2>

                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-sky-700">
                  Supported ISP: {settings.supportedIsp}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all group-hover:gap-3">
                  Open service
                  <ArrowRight size={17} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {services.length > 0 && (
          <section className="mt-14 rounded-3xl border border-sky-100 bg-white p-7 text-center shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-slate-950">
              Not sure which service to choose?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              Describe your connection problem directly to{" "}
              {settings.businessName} on WhatsApp.
            </p>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1fbd5a] hover:shadow-lg"
            >
              <MessageCircle size={19} />
              Ask on WhatsApp
            </a>
          </section>
        )}
      </div>
    </main>
  );
}