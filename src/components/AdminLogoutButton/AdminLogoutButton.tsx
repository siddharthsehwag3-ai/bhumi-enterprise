"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
    >
      {isLoggingOut ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        <LogOut size={17} />
      )}

      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}