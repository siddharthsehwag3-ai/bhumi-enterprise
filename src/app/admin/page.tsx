import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Battery,
  CarFront,
  FileText,
  MessageSquare,
  Settings,
  Wifi,
} from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton/AdminLogoutButton";
import { getAdminSession } from "@/lib/session";

const modules = [
  {
    title: "Battery catalogue",
    description:
      "Add, edit, publish, hide and remove battery products and categories.",
    href: "/admin/batteries",
    icon: Battery,
    colour: "emerald",
  },
  {
    title: "Vehicle compatibility",
    description:
      "Add vehicle manufacturers and models, then connect each vehicle to its exact compatible batteries.",
    href: "/admin/batteries/compatibility",
    icon: CarFront,
    colour: "blue",
  },
  {
    title: "WiFi services",
    description:
      "Edit services, enquiry questions, supported ISPs and WiFi information.",
    href: "/admin/wifi",
    icon: Wifi,
    colour: "sky",
  },
  {
    title: "Reviews",
    description:
      "Approve, reject, hide and manage customer reviews.",
    href: "/admin/reviews",
    icon: MessageSquare,
    colour: "amber",
  },
  {
    title: "Enquiries",
    description:
      "Manage battery, contact and WiFi customer enquiries.",
    href: "/admin/enquiries",
    icon: FileText,
    colour: "violet",
  },
  {
    title: "Website content",
    description:
      "Edit the shop address, phone, WhatsApp, email, map, opening hours and other business information.",
    href: "/admin/settings",
    icon: Settings,
    colour: "slate",
  },
];

const colours: Record<
  string,
  {
    icon: string;
    hover: string;
  }
> = {
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    hover: "hover:border-emerald-400",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    hover: "hover:border-blue-400",
  },
  sky: {
    icon: "bg-sky-100 text-sky-700",
    hover: "hover:border-sky-400",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    hover: "hover:border-amber-400",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    hover: "hover:border-violet-400",
  },
  slate: {
    icon: "bg-slate-200 text-slate-700",
    hover: "hover:border-slate-400",
  },
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              Bhumi Enterprise
            </p>

            <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
              Admin dashboard
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Signed in as {session.email}
            </p>
          </div>

          <AdminLogoutButton />
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            Only add vehicle-to-battery matches after you or the
            owner has confirmed them. Customers will see these
            matches directly in the public battery finder.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const moduleColours = colours[module.colour];

            return (
              <Link
                key={module.href}
                href={module.href}
                className={`group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${moduleColours.hover}`}
              >
                <div
                  className={`flex h-13 w-13 items-center justify-center rounded-2xl ${moduleColours.icon}`}
                >
                  <Icon size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {module.title}
                </h2>

                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                  {module.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition group-hover:gap-3">
                  Open module
                  <ArrowRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}