import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CircleCheck,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { getDatabase } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

type EnquiryStatus =
  | "new"
  | "contacted"
  | "in-progress"
  | "resolved"
  | "closed"
  | "spam";

type Enquiry = {
  id: string;
  enquiry_type: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  subject: string;
  message: string;
  address: string;
  status: EnquiryStatus;
  created_at: Date;
};

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-sky-100 text-sky-800",
  contacted: "bg-violet-100 text-violet-800",
  "in-progress": "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
  spam: "bg-red-100 text-red-800",
};

async function updateEnquiryStatus(formData: FormData) {
  "use server";

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  const allowedStatuses: EnquiryStatus[] = [
    "new",
    "contacted",
    "in-progress",
    "resolved",
    "closed",
    "spam",
  ];

  if (!id || !allowedStatuses.includes(status as EnquiryStatus)) {
    return;
  }

  const sql = getDatabase();

  await sql`
    UPDATE enquiries
    SET
      status = ${status},
      updated_at = NOW()
    WHERE id = ${id}::uuid
  `;

  revalidatePath("/admin/enquiries");
}

export default async function AdminEnquiriesPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const sql = getDatabase();

  const enquiries = await sql<Enquiry[]>`
    SELECT
      id,
      enquiry_type,
      customer_name,
      customer_email,
      customer_phone,
      subject,
      message,
      address,
      status,
      created_at
    FROM enquiries
    ORDER BY
      CASE WHEN status = 'new' THEN 0 ELSE 1 END,
      created_at DESC
  `;

  const newCount = enquiries.filter(
    (enquiry) => enquiry.status === "new",
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Admin dashboard
        </Link>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
              Bhumi Enterprise
            </p>

            <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
              Customer enquiries
            </h1>

            <p className="mt-3 text-slate-600">
              Track contact, battery and WiFi enquiries.
            </p>
          </div>

          <div className="rounded-2xl bg-sky-100 px-5 py-3 font-bold text-sky-900">
            {newCount} new
          </div>
        </div>

        {enquiries.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageSquare
              className="mx-auto text-slate-400"
              size={42}
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No enquiries yet
            </h2>

            <p className="mt-2 text-slate-600">
              New contact-form submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6">
            {enquiries.map((enquiry) => (
              <article
                key={enquiry.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {enquiry.enquiry_type}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {enquiry.subject || "General enquiry"}
                    </h2>

                    <p className="mt-1 text-slate-700">
                      {enquiry.customer_name}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyles[enquiry.status]}`}
                  >
                    {enquiry.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  {enquiry.customer_email && (
                    <a
                      href={`mailto:${enquiry.customer_email}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
                    >
                      <Mail size={16} />
                      {enquiry.customer_email}
                    </a>
                  )}

                  {enquiry.customer_phone && (
                    <a
                      href={`tel:${enquiry.customer_phone}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
                    >
                      <Phone size={16} />
                      {enquiry.customer_phone}
                    </a>
                  )}
                </div>

                <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-700">
                  {enquiry.message}
                </p>

                {enquiry.address && (
                  <p className="mt-3 text-sm text-slate-600">
                    <strong>Address:</strong> {enquiry.address}
                  </p>
                )}

                <p className="mt-4 text-xs text-slate-500">
                  Received{" "}
                  {new Date(enquiry.created_at).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    },
                  )}
                </p>

                <form
                  action={updateEnquiryStatus}
                  className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5"
                >
                  <input type="hidden" name="id" value={enquiry.id} />

                  <label
                    htmlFor={`status-${enquiry.id}`}
                    className="font-bold text-slate-800"
                  >
                    Status
                  </label>

                  <select
                    id={`status-${enquiry.id}`}
                    name="status"
                    defaultValue={enquiry.status}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-600"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in-progress">
                      In progress
                    </option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="spam">Spam</option>
                  </select>

                  <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-bold text-white hover:bg-emerald-700">
                    <CircleCheck size={17} />
                    Save status
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}