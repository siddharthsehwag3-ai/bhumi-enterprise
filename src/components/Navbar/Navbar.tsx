"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo/Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Batteries", href: "/batteries" },
  { label: "WiFi Services", href: "/wifi-services" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-80 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="flex h-78px items-center justify-between">
          <Link
            href="/"
            aria-label="Bhumi Enterprise homepage"
            onClick={() => setMenuIsOpen(false)}
          >
            <Logo />
          </Link>

          <ul className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-3 transition-colors ${
                      active
                        ? "text-emerald-700"
                        : "hover:text-emerald-700"
                    }`}
                  >
                    {item.label}

                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-emerald-600 transition-transform ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setMenuIsOpen((current) => !current)}
            aria-label={
              menuIsOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuIsOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 md:hidden"
          >
            {menuIsOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`grid transition-all duration-300 md:hidden ${
            menuIsOpen
              ? "grid-rows-[1fr] border-t border-slate-100"
              : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 py-4">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuIsOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 font-semibold transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}