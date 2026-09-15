"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  X,
} from "lucide-react";

type EmailActionsProps = {
  emailAddress: string;
};

export default function EmailActions({
  emailAddress,
}: EmailActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener(
        "keydown",
        closeWithEscape,
      );
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1400);
    } catch {
      setCopied(false);
    }
  };

  const openGmail = () => {
    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        emailAddress,
      )}`;

    window.open(
      gmailUrl,
      "_blank",
      "noopener,noreferrer",
    );

    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() =>
          setIsOpen((currentValue) => !currentValue)
        }
        aria-expanded={isOpen}
        className="w-full text-left"
      >
        <Mail size={28} className="text-emerald-600" />

        <span className="mt-5 block text-xl font-bold text-slate-900">
          Email
        </span>

        <span className="mt-2 block break-all text-sm leading-6 text-slate-600">
          {emailAddress}
        </span>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
          Email options
          <ExternalLink size={15} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-full min-w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Choose an action
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close email options"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={openGmail}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <ExternalLink
              size={17}
              className="text-emerald-600"
            />

            Open Gmail
          </button>

          <button
            type="button"
            onClick={copyEmail}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            {copied ? (
              <Check
                size={17}
                className="text-emerald-600"
              />
            ) : (
              <Copy
                size={17}
                className="text-emerald-600"
              />
            )}

            {copied ? "Email copied" : "Copy email"}
          </button>
        </div>
      )}
    </div>
  );
}