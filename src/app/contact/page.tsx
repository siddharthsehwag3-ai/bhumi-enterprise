import type { Metadata } from "next";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import ContactForm from "@/components/ContactForm/ContactForm";
import EmailActions from "@/components/EmailActions/EmailActions";
import PhoneActions from "@/components/PhoneActions/PhoneActions";
import {
  createMapsDirectionsUrl,
  createMapsEmbedUrl,
  createWhatsappUrl,
} from "@/lib/site-settings";
import { getCachedSiteSettings } from "@/lib/public-data-cache";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bhumi Enterprise for batteries, installation, battery checkups and WiFi assistance in Bahadurgarh.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getCachedSiteSettings();

  const whatsappUrl = createWhatsappUrl(
    settings,
    `Hello ${settings.businessName}, I have an enquiry.`,
  );

  const mapsUrl = createMapsDirectionsUrl(settings);
  const mapsEmbedUrl = createMapsEmbedUrl(settings);

  return (
    <main className="relative min-h-screen bg-[#f4f8f5]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
            Contact {settings.businessName}
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
            How would you like to contact us?
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Choose WhatsApp, telephone, Gmail, directions or the
            private enquiry form.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
          >
            <MessageCircle
              size={28}
              className="text-emerald-600"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              WhatsApp
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Start a WhatsApp conversation with the owner.
            </p>
          </a>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Phone size={28} className="text-emerald-600" />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Telephone
            </h2>

            <p className="mb-4 mt-2 text-sm text-slate-600">
              Copy the number or call from a mobile device.
            </p>

            <PhoneActions
              phoneNumber={settings.phoneInternational}
              displayNumber={settings.phoneDisplay}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg">
            <EmailActions
              emailAddress={settings.publicEmail}
            />
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
          >
            <MapPin size={28} className="text-emerald-600" />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Directions
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {settings.address}
            </p>
          </a>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Clock3 size={28} className="text-emerald-600" />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Business hours
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {settings.businessHours}
            </p>
          </div>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Mail size={32} className="text-emerald-600" />

            <h2 className="mt-5 text-3xl font-extrabold text-slate-950">
              Send a private enquiry
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Your message is saved privately in the admin panel and
              delivered to the configured private notification
              email. Recipient addresses are never shown here.
            </p>
          </div>

          <ContactForm />
        </section>

        <section className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <iframe
            title={`${settings.businessName} location`}
            src={mapsEmbedUrl}
            width="100%"
            height="430"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block border-0"
          />
        </section>
      </div>
    </main>
  );
}