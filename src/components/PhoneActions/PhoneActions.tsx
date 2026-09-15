"use client";

import { Check, Copy, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PhoneActionsProps = {
  phoneNumber: string;
  displayNumber: string;
};

export default function PhoneActions({
  phoneNumber,
  displayNumber,
}: PhoneActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  const callNumber = () => {
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex items-center gap-3 text-left transition hover:text-white"
      >
        <Phone
          size={19}
          className="shrink-0 text-emerald-400"
        />

        <span>{displayNumber}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-70 mb-3 w-52 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Phone options
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close phone options"
              className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={copyNumber}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 transition hover:bg-white/10"
          >
            {copied ? (
              <Check size={17} className="text-emerald-400" />
            ) : (
              <Copy size={17} className="text-emerald-400" />
            )}

            {copied ? "Number copied" : "Copy number"}
          </button>

          <button
            type="button"
            onClick={callNumber}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <Phone size={17} className="text-emerald-400" />
            Call on mobile
          </button>

          <p className="px-3 pb-2 pt-1 text-xs leading-5 text-slate-500">
            Calling is available on mobile devices.
          </p>
        </div>
      )}
    </div>
  );
}