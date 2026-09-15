"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Watermark from "@/components/Watermark/Watermark";
import type { SiteSettings } from "@/lib/site-settings";

type SiteChromeProps = {
  children: React.ReactNode;
  settings: SiteSettings;
};

export default function SiteChrome({
  children,
  settings,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <Watermark />

      <div className="relative z-20 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex-1">{children}</div>

        <Footer settings={settings} />
      </div>
    </>
  );
}