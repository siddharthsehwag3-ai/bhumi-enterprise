"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send, Star } from "lucide-react";

type FormState = {
  type: "idle" | "loading" | "success" | "error";
  message: string;
};

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<FormState>({
    type: "idle",
    message: "",
  });

  const submitReview = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (rating < 1) {
      setState({
        type: "error",
        message: "Please select a star rating.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({
      type: "loading",
      message: "Submitting your review...",
    });

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "review",
          name: formData.get("name"),
          email: formData.get("email"),
          serviceUsed: formData.get("serviceUsed"),
          message: formData.get("message"),
          website: formData.get("website"),
          rating,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit review.");
      }

      form.reset();
      setRating(0);

      setState({
        type: "success",
        message:
          result.message ||
          "Thank you. Your review was submitted for approval.",
      });
    } catch (error) {
      setState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit review.",
      });
    }
  };

  return (
    <form
      onSubmit={submitReview}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Full name *
          </span>

          <input
            required
            minLength={2}
            maxLength={80}
            name="name"
            autoComplete="name"
            className="h-13 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Email address *
          </span>

          <input
            required
            type="email"
            maxLength={120}
            name="email"
            autoComplete="email"
            className="h-13 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Product or service used *
        </span>

        <select
          required
          name="serviceUsed"
          defaultValue=""
          className="h-13 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="" disabled>
            Select product or service
          </option>
          <option value="Two-wheeler battery">
            Two-wheeler battery
          </option>
          <option value="Car / MUV / SUV battery">
            Car / MUV / SUV battery
          </option>
          <option value="Tractor battery">Tractor battery</option>
          <option value="Commercial vehicle battery">
            Commercial vehicle battery
          </option>
          <option value="Inverter or backup battery">
            Inverter or backup battery
          </option>
          <option value="Battery installation">
            Battery installation
          </option>
          <option value="Battery checkup">Battery checkup</option>
          <option value="WiFi service">WiFi service</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-slate-700">
          Rating *
        </legend>

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className="rounded-lg p-1 focus:outline-none focus:ring-4 focus:ring-amber-100"
            >
              <Star
                size={32}
                className={
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }
              />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Your review *
        </span>

        <textarea
          required
          minLength={10}
          maxLength={1500}
          rows={6}
          name="message"
          placeholder="Tell us about your experience..."
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="hidden" aria-hidden="true">
        Website
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Reviews are checked before appearing publicly. Your email
        address will never be displayed with your review.
      </p>

      <button
        type="submit"
        disabled={state.type === "loading"}
        className="mt-6 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.type === "loading" ? (
          <LoaderCircle size={19} className="animate-spin" />
        ) : (
          <Send size={19} />
        )}

        {state.type === "loading"
          ? "Submitting..."
          : "Submit review"}
      </button>

      {state.message && (
        <p
          role="status"
          className={`mt-4 text-sm font-medium ${
            state.type === "success"
              ? "text-emerald-700"
              : state.type === "error"
                ? "text-red-700"
                : "text-slate-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}