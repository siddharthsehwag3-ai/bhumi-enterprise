import type { Metadata } from "next";
import {
  MessageSquareQuote,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import ReviewForm from "@/components/ReviewForm/ReviewForm";
import { getDatabase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Read customer feedback and share your experience with Bhumi Enterprise battery and WiFi services.",
};

export const dynamic = "force-dynamic";

type ApprovedReview = {
  id: string;
  customer_name: string;
  service_used: string;
  rating: number;
  review_text: string;
  published_at: Date | null;
  submitted_at: Date;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default async function ReviewsPage() {
  const sql = getDatabase();

  const approvedReviews = await sql<ApprovedReview[]>`
    SELECT
      id,
      customer_name,
      service_used,
      rating,
      review_text,
      published_at,
      submitted_at
    FROM reviews
    WHERE status = 'approved'
    ORDER BY COALESCE(published_at, submitted_at) DESC
    LIMIT 30
  `;

  return (
    <main className="relative min-h-screen bg-[#f4f8f5]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <MessageSquareQuote size={28} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
            Customer feedback
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
            Customer experiences
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Read feedback from customers or share your experience
            with a Bhumi Enterprise battery product, installation,
            checkup or WiFi service.
          </p>
        </div>

        <section
          aria-labelledby="approved-reviews-heading"
          className="mt-14"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
                Verified by our administrators
              </p>

              <h2
                id="approved-reviews-heading"
                className="mt-2 text-3xl font-extrabold text-slate-950"
              >
                Approved customer reviews
              </h2>
            </div>

            {approvedReviews.length > 0 && (
              <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                {approvedReviews.length}{" "}
                {approvedReviews.length === 1
                  ? "review"
                  : "reviews"}
              </p>
            )}
          </div>

          {approvedReviews.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-white/90 px-6 py-12 text-center shadow-sm">
              <MessageSquareQuote
                size={42}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No approved reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">
                Be one of the first customers to share an experience.
                Reviews appear here only after administrator approval.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {approvedReviews.map((review) => (
                <article
                  key={review.id}
                  className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-extrabold text-emerald-700">
                        {getInitials(review.customer_name) || (
                          <UserRound size={20} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-950">
                          {review.customer_name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {review.service_used}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      Approved
                    </span>
                  </div>

                  <div
                    className="mt-5 flex gap-1 text-amber-500"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={19}
                        fill={
                          index < review.rating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          index < review.rating
                            ? "text-amber-500"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>

                  <blockquote className="mt-5 flex-1 whitespace-pre-wrap leading-7 text-slate-700">
                    “{review.review_text}”
                  </blockquote>

                  <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    {new Date(
                      review.published_at || review.submitted_at,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          aria-labelledby="submit-review-heading"
          className="mt-20"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
              Tell us about your experience
            </p>

            <h2
              id="submit-review-heading"
              className="mt-2 text-3xl font-extrabold text-slate-950"
            >
              Submit a customer review
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Your review will be saved with pending status. It will
              become publicly visible only after an administrator
              approves it.
            </p>
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Star
                  size={27}
                  className="fill-amber-400 text-amber-400"
                />

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Honest customer feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Feedback helps Bhumi Enterprise improve its
                  products and customer service.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <ShieldCheck
                  size={27}
                  className="text-emerald-600"
                />

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Privacy and moderation
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Every submission is reviewed before publishing.
                  Customer email addresses are kept private and are
                  never displayed with reviews.
                </p>
              </div>
            </div>

            <ReviewForm />
          </div>
        </section>
      </div>
    </main>
  );
}