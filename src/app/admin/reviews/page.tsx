import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Check,
  EyeOff,
  Mail,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import { getDatabase } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "hidden";

type Review = {
  id: string;
  customer_name: string;
  customer_email: string;
  service_used: string;
  rating: number;
  review_text: string;
  status: ReviewStatus;
  admin_notes: string;
  submitted_at: Date;
};

const statusStyles: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  hidden: "bg-slate-200 text-slate-700",
};

async function updateReviewStatus(formData: FormData) {
  "use server";

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNotes = String(formData.get("adminNotes") ?? "")
    .trim()
    .slice(0, 1000);

  const allowedStatuses: ReviewStatus[] = [
    "pending",
    "approved",
    "rejected",
    "hidden",
  ];

  if (!id || !allowedStatuses.includes(status as ReviewStatus)) {
    return;
  }

  const sql = getDatabase();

  await sql`
    UPDATE reviews
    SET
      status = ${status},
      admin_notes = ${adminNotes},
      reviewed_at = NOW(),
      published_at = CASE
        WHEN ${status} = 'approved'
          THEN COALESCE(published_at, NOW())
        ELSE NULL
      END
    WHERE id = ${id}::uuid
  `;

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export default async function AdminReviewsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const sql = getDatabase();

  const reviews = await sql<Review[]>`
    SELECT
      id,
      customer_name,
      customer_email,
      service_used,
      rating,
      review_text,
      status,
      admin_notes,
      submitted_at
    FROM reviews
    ORDER BY
      CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
      submitted_at DESC
  `;

  const pendingCount = reviews.filter(
    (review) => review.status === "pending",
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
              Customer reviews
            </h1>

            <p className="mt-3 text-slate-600">
              Approve reviews before they become eligible to appear
              publicly.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-100 px-5 py-3 font-bold text-amber-900">
            {pendingCount} pending
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageSquare
              className="mx-auto text-slate-400"
              size={42}
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No customer reviews yet
            </h2>

            <p className="mt-2 text-slate-600">
              New review-form submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      {review.customer_name}
                    </h2>

                    <a
                      href={`mailto:${review.customer_email}`}
                      className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700"
                    >
                      <Mail size={16} />
                      {review.customer_email}
                    </a>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyles[review.status]}`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={20}
                      fill={
                        index < review.rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {review.service_used}
                </p>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
                  {review.review_text}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  Submitted{" "}
                  {new Date(review.submitted_at).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    },
                  )}
                </p>

                <form
                  action={updateReviewStatus}
                  className="mt-6 border-t border-slate-200 pt-5"
                >
                  <input type="hidden" name="id" value={review.id} />

                  <label className="block text-sm font-bold text-slate-800">
                    Private administrator note
                  </label>

                  <textarea
                    name="adminNotes"
                    defaultValue={review.admin_notes}
                    rows={2}
                    maxLength={1000}
                    placeholder="Optional internal note—not shown to customers"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      name="status"
                      value="approved"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-700"
                    >
                      <Check size={17} />
                      Approve
                    </button>

                    <button
                      name="status"
                      value="rejected"
                      className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2.5 font-bold text-red-700 hover:bg-red-200"
                    >
                      <X size={17} />
                      Reject
                    </button>

                    <button
                      name="status"
                      value="hidden"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-300"
                    >
                      <EyeOff size={17} />
                      Hide
                    </button>
                  </div>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}