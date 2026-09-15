import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Wifi,
} from "lucide-react";
import WifiRequestForm from "@/components/WifiRequestForm/WifiRequestForm";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedWifiService } from "@/lib/wifi-database";

type WifiServicePageProps = {
  params: Promise<{
    service: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: WifiServicePageProps): Promise<Metadata> {
  const { service: requestedService } = await params;

  const service =
    await getPublishedWifiService(requestedService);

  if (!service) {
    return {
      title: "WiFi Service",
    };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function WifiServicePage({
  params,
}: WifiServicePageProps) {
  const { service: requestedService } = await params;

  const [service, settings] = await Promise.all([
    getPublishedWifiService(requestedService),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f4f8fb]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-7xl">
        <Link
          href="/wifi-services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft size={17} />
          All WiFi services
        </Link>

        <section className="mt-12 grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Wifi size={28} />
            </div>

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-sky-700">
              {settings.businessName} WiFi
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {service.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {service.description}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex gap-3 rounded-2xl border border-sky-200 bg-white/90 p-4">
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-sky-700"
                />

                <div>
                  <p className="font-bold text-slate-900">
                    Supported ISP
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {settings.supportedIsp}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
                <MapPin
                  size={21}
                  className="mt-0.5 shrink-0 text-sky-700"
                />

                <div>
                  <p className="font-bold text-slate-900">
                    Service address required
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Share the complete location so service
                    availability can be confirmed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
                <Clock3
                  size={21}
                  className="mt-0.5 shrink-0 text-sky-700"
                />

                <div>
                  <p className="font-bold text-slate-900">
                    Timing confirmed personally
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Enter your preferred time in the request form.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <WifiRequestForm
            service={service}
            businessName={settings.businessName}
            whatsappNumber={settings.whatsappNumber}
            supportedIsp={settings.supportedIsp}
          />
        </section>
      </div>
    </main>
  );
}