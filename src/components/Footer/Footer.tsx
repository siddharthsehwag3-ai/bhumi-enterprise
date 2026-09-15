"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Battery,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Wifi,
} from "lucide-react";
import PhoneActions from "@/components/PhoneActions/PhoneActions";
import type { SiteSettings } from "@/lib/site-settings";

type FooterProps = {
  settings: SiteSettings;
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterSectionProps = {
  id: string;
  title: string;
  links: FooterLink[];
  colour: "emerald" | "sky";
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  children?: React.ReactNode;
};

const batteryLinks: FooterLink[] = [
  {
    label: "Two-Wheeler Batteries",
    href: "/batteries/two-wheeler",
  },
  {
    label: "Car / MUV / SUV Batteries",
    href: "/batteries/car-muv-suv",
  },
  {
    label: "Tractor Batteries",
    href: "/batteries/tractor",
  },
  {
    label: "Commercial Vehicle Batteries",
    href: "/batteries/commercial-vehicle",
  },
  {
    label: "E-Rickshaw Batteries",
    href: "/batteries/e-rickshaw",
  },
  {
    label: "Inverter Batteries",
    href: "/batteries/inverter",
  },
  {
    label: "Genset Batteries",
    href: "/batteries/genset",
  },
  {
    label: "Industrial Batteries",
    href: "/batteries/industrial",
  },
  {
    label: "Inverter / UPS Systems",
    href: "/batteries/inverter-ups",
  },
];

const wifiLinks: FooterLink[] = [
  {
    label: "WiFi Installation",
    href: "/wifi-services/installation",
  },
  {
    label: "Router Configuration",
    href: "/wifi-services/router-configuration",
  },
  {
    label: "WiFi Repair",
    href: "/wifi-services/repair",
  },
  {
    label: "Coverage Assistance",
    href: "/wifi-services/coverage-assistance",
  },
  {
    label: "Maintenance Support",
    href: "/wifi-services/maintenance",
  },
];

const websiteLinks: FooterLink[] = [
  {
    label: "Homepage",
    href: "/",
  },
  {
    label: "All Batteries",
    href: "/batteries",
  },
  {
    label: "All WiFi Services",
    href: "/wifi-services",
  },
  {
    label: "Customer Reviews",
    href: "/reviews",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export default function Footer({
  settings,
}: FooterProps) {
  const mapsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      settings.mapsSearchQuery,
    )}`;

  return (
    <footer className="relative z-40 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:px-8 lg:py-16">
        <section>
          <h2 className="text-2xl font-extrabold text-white">
            {settings.businessName}
          </h2>

          <p className="mt-3 text-sm font-semibold text-emerald-400">
            {settings.businessTagline}
          </p>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            Battery sales and services together with WiFi assistance
            for homes, businesses and vehicle owners.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 transition hover:text-white"
            >
              <MapPin
                size={19}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <span>{settings.address}</span>

              <ExternalLink
                size={14}
                className="mt-1 shrink-0 text-slate-500"
              />
            </a>

            <div className="flex items-center gap-3">
              <Clock3
                size={19}
                className="shrink-0 text-emerald-400"
              />

              <span>{settings.businessHours}</span>
            </div>

            <PhoneActions
              phoneNumber={settings.phoneInternational}
              displayNumber={settings.phoneDisplay}
            />

            <a
              href={`mailto:${settings.publicEmail}`}
              className="flex items-center gap-3 break-all transition hover:text-white"
            >
              <Mail
                size={19}
                className="shrink-0 text-emerald-400"
              />

              <span>{settings.publicEmail}</span>
            </a>
          </div>
        </section>

        <FooterSection
          id="footer-battery-links"
          title="Battery Categories"
          links={batteryLinks}
          colour="emerald"
          icon={Battery}
        />

        <FooterSection
          id="footer-wifi-links"
          title="WiFi Services"
          links={wifiLinks}
          colour="sky"
          icon={Wifi}
        >
          <div className="mt-7 rounded-2xl border border-sky-900 bg-sky-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
              Supported ISP
            </p>

            <p className="mt-2 font-bold text-white">
              {settings.supportedIsp}
            </p>
          </div>
        </FooterSection>

        <FooterSection
          id="footer-useful-links"
          title="Useful Links"
          links={websiteLinks}
          colour="emerald"
        >
          <div className="mt-8 rounded-2xl bg-white/5 p-5">
            <p className="font-semibold text-white">
              Complimentary battery support
            </p>

            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Free battery installation</li>
              <li>Free battery checkup</li>
            </ul>
          </div>
        </FooterSection>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings.businessName}. All rights reserved.
          </p>

          <p>
            Established {settings.establishedYear} · Bahadurgarh
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({
  id,
  title,
  links,
  colour,
  icon: Icon,
  children,
}: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const linkColour =
    colour === "sky"
      ? "hover:text-sky-400"
      : "hover:text-emerald-400";

  const iconColour =
    colour === "sky"
      ? "text-sky-400"
      : "text-emerald-400";

  return (
    <section className="border-t border-white/10 pt-5 md:border-0 md:pt-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon size={20} className={iconColour} />
          )}

          <h2 className="font-bold text-white">{title}</h2>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsOpen((currentValue) => !currentValue)
          }
          aria-expanded={isOpen}
          aria-controls={id}
          aria-label={`${isOpen ? "Close" : "Open"} ${title}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-white/30 hover:bg-white/10 md:hidden"
        >
          <span
            aria-hidden="true"
            className="text-2xl font-light leading-none"
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </div>

      <div
        id={id}
        className={`${isOpen ? "block" : "hidden"} md:block`}
      >
        <ul className="mt-5 space-y-3 text-sm">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition ${linkColour}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {children}
      </div>
    </section>
  );
}