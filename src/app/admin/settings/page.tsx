import Link from "next/link";
import {
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Wifi,
} from "lucide-react";
import { getAdminSession } from "@/lib/session";
import {
  getSiteSettings,
  saveSiteSettings,
} from "@/lib/site-settings";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

function clean(
  value: FormDataEntryValue | null,
  maximumLength: number,
) {
  return String(value ?? "")
    .trim()
    .slice(0, maximumLength);
}

async function updateSettings(formData: FormData) {
  "use server";

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const businessName = clean(
    formData.get("businessName"),
    120,
  );
  const businessTagline = clean(
    formData.get("businessTagline"),
    300,
  );
  const phoneInternational = clean(
    formData.get("phoneInternational"),
    30,
  );
  const phoneDisplay = clean(
    formData.get("phoneDisplay"),
    30,
  );
  const whatsappNumber = clean(
    formData.get("whatsappNumber"),
    30,
  ).replace(/[^\d]/g, "");
  const publicEmail = clean(
    formData.get("publicEmail"),
    200,
  ).toLowerCase();
  const address = clean(formData.get("address"), 500);
  const mapsSearchQuery = clean(
    formData.get("mapsSearchQuery"),
    500,
  );
  const businessHours = clean(
    formData.get("businessHours"),
    200,
  );
  const supportedIsp = clean(
    formData.get("supportedIsp"),
    100,
  );
  const establishedYear = clean(
    formData.get("establishedYear"),
    10,
  );

  if (
    !businessName ||
    !businessTagline ||
    !phoneInternational ||
    !phoneDisplay ||
    whatsappNumber.length < 10 ||
    !publicEmail.includes("@") ||
    !address ||
    !mapsSearchQuery ||
    !businessHours ||
    !supportedIsp
  ) {
    return;
  }

  await saveSiteSettings({
    businessName,
    businessTagline,
    phoneInternational,
    phoneDisplay,
    whatsappNumber,
    publicEmail,
    address,
    mapsSearchQuery,
    businessHours,
    supportedIsp,
    establishedYear,
  });

  revalidateTag("site-settings", {
  expire: 0,
});

revalidatePath("/", "layout");
revalidatePath("/");
revalidatePath("/contact");
revalidatePath("/wifi-services");
revalidatePath("/wifi-services/[service]", "page");
revalidatePath("/admin/settings");
}

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Admin dashboard
        </Link>

        <div className="mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Bhumi Enterprise
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
            Website settings
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            These details will be used throughout the website,
            including the footer, Contact page, Google Maps, phone
            actions and WiFi WhatsApp requests.
          </p>
        </div>

        <form
          action={updateSettings}
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <section>
            <div className="flex items-center gap-3">
              <Building2
                size={23}
                className="text-emerald-700"
              />

              <h2 className="text-xl font-bold text-slate-950">
                Business identity
              </h2>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SettingInput
                name="businessName"
                label="Business name"
                defaultValue={settings.businessName}
                required
              />

              <SettingInput
                name="establishedYear"
                label="Established year"
                defaultValue={settings.establishedYear}
              />

              <label className="text-sm font-bold text-slate-700 md:col-span-2">
                Business tagline *
                <textarea
                  required
                  name="businessTagline"
                  rows={2}
                  defaultValue={settings.businessTagline}
                  className={textareaClass}
                />
              </label>
            </div>
          </section>

          <section className="mt-9 border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3">
              <Phone size={23} className="text-emerald-700" />

              <h2 className="text-xl font-bold text-slate-950">
                Phone and WhatsApp
              </h2>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SettingInput
                name="phoneInternational"
                label="Telephone number with country code"
                defaultValue={settings.phoneInternational}
                placeholder="+918130886600"
                required
              />

              <SettingInput
                name="phoneDisplay"
                label="Telephone number as displayed"
                defaultValue={settings.phoneDisplay}
                placeholder="81308 86600"
                required
              />

              <SettingInput
                name="whatsappNumber"
                label="WhatsApp number with country code"
                defaultValue={settings.whatsappNumber}
                placeholder="918130886600"
                required
                icon={MessageCircle}
              />

              <SettingInput
                name="publicEmail"
                label="Public business email"
                defaultValue={settings.publicEmail}
                type="email"
                required
                icon={Mail}
              />
            </div>
          </section>

          <section className="mt-9 border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3">
              <MapPin size={23} className="text-emerald-700" />

              <h2 className="text-xl font-bold text-slate-950">
                Shop address and Google Maps
              </h2>
            </div>

            <div className="mt-5 grid gap-5">
              <label className="text-sm font-bold text-slate-700">
                Displayed shop address *
                <textarea
                  required
                  name="address"
                  rows={3}
                  defaultValue={settings.address}
                  className={textareaClass}
                />
              </label>

              <label className="text-sm font-bold text-slate-700">
                Google Maps search location *
                <textarea
                  required
                  name="mapsSearchQuery"
                  rows={2}
                  defaultValue={settings.mapsSearchQuery}
                  className={textareaClass}
                />

                <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                  Enter the exact shop name/address that Google Maps
                  should search. This controls both Directions and
                  the embedded map.
                </span>
              </label>
            </div>
          </section>

          <section className="mt-9 border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3">
              <Clock3 size={23} className="text-emerald-700" />

              <h2 className="text-xl font-bold text-slate-950">
                Service information
              </h2>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SettingInput
                name="businessHours"
                label="Business hours"
                defaultValue={settings.businessHours}
                required
              />

              <SettingInput
                name="supportedIsp"
                label="Supported ISP"
                defaultValue={settings.supportedIsp}
                required
                icon={Wifi}
              />
            </div>
          </section>

          <div className="mt-9 border-t border-slate-200 pt-6">
            <button className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg">
              <Save size={18} />
              Save website settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

type SettingInputProps = {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

function SettingInput({
  name,
  label,
  defaultValue,
  required = false,
  placeholder,
  type = "text",
  icon: Icon,
}: SettingInputProps) {
  return (
    <label className="text-sm font-bold text-slate-700">
      <span className="flex items-center gap-2">
        {Icon && (
          <Icon size={16} className="text-emerald-700" />
        )}

        {label}
        {required ? " *" : ""}
      </span>

      <input
        required={required}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}