import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome/SiteChrome";
import { getCachedSiteSettings } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),

  title: {
    default:
      "Bhumi Enterprise | Batteries & WiFi Services",
    template: "%s | Bhumi Enterprise",
  },

  description:
    "Bhumi Enterprise in Bahadurgarh provides Tata Green, Geon and Amaron batteries, free battery installation, free battery checkup and WiFi assistance.",

  keywords: [
    "Bhumi Enterprise",
    "battery dealer Bahadurgarh",
    "battery shop Bahadurgarh",
    "Tata Green batteries",
    "Tata Green battery dealer",
    "Amaron batteries",
    "Geon batteries",
    "car battery Bahadurgarh",
    "bike battery Bahadurgarh",
    "tractor battery Bahadurgarh",
    "inverter battery Bahadurgarh",
    "commercial vehicle battery",
    "free battery installation",
    "free battery checkup",
    "WiFi services Bahadurgarh",
    "Airtel WiFi assistance",
  ],

  authors: [
    {
      name: "Bhumi Enterprise",
    },
  ],

  creator: "Bhumi Enterprise",
  publisher: "Bhumi Enterprise",

  applicationName: "Bhumi Enterprise",

  category: "Business",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Bhumi Enterprise",
    title:
      "Bhumi Enterprise | Batteries & WiFi Services",
    description:
      "Tata Green, Geon and Amaron batteries with free battery installation and checkup, plus WiFi assistance in Bahadurgarh.",
    images: [
      {
        url: "/bhumi-logo.jpg",
        width: 800,
        height: 800,
        alt: "Bhumi Enterprise logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title:
      "Bhumi Enterprise | Batteries & WiFi Services",
    description:
      "Batteries, free installation, battery checkup and WiFi assistance in Bahadurgarh.",
    images: ["/bhumi-logo.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/bhumi-logo.jpg",
        type: "image/jpeg",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/bhumi-logo.jpg",
  },

  manifest: "/manifest.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
  colorScheme: "light",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSiteSettings();

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.businessName,
    description: settings.businessTagline,
    url: getSiteUrl(),
    image: `${getSiteUrl()}/bhumi-logo.jpg`,
    telephone: settings.phoneInternational,
    email: settings.publicEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Bahadurgarh",
      addressRegion: "Haryana",
      postalCode: "124507",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Bahadurgarh",
    },
    foundingDate: settings.establishedYear,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI",
    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={`${geist.variable} antialiased`}
    >
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              localBusinessData,
            ).replace(/</g, "\\u003c"),
          }}
        />

        <SiteChrome settings={settings}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}