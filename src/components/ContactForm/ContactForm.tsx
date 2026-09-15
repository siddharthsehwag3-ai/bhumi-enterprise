"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

type FormState = {
  type: "idle" | "loading" | "success" | "error";
  message: string;
};

export default function ContactForm() {
  const [state, setState] = useState<FormState>({
    type: "idle",
    message: "",
  });

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({
      type: "loading",
      message: "Sending your enquiry...",
    });

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send enquiry.");
      }

      form.reset();

      setState({
        type: "success",
        message: result.message || "Your enquiry was sent.",
      });
    } catch (error) {
      setState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send enquiry.",
      });
    }
  };

  return (
    <form
      onSubmit={submitForm}
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

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Phone number
          </span>

          <input
            type="tel"
            maxLength={20}
            name="phone"
            autoComplete="tel"
            className="h-13 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Enquiry type *
          </span>

          <select
            required
            name="subject"
            defaultValue=""
            className="h-13 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="" disabled>
              Select enquiry type
            </option>
            <option value="Battery enquiry">Battery enquiry</option>
            <option value="Battery installation">
              Battery installation
            </option>
            <option value="Battery checkup">Battery checkup</option>
            <option value="WiFi enquiry">WiFi enquiry</option>
            <option value="General enquiry">General enquiry</option>
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Your message *
        </span>

        <textarea
          required
          minLength={10}
          maxLength={1500}
          rows={6}
          name="message"
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

        {state.type === "loading" ? "Sending..." : "Send enquiry"}
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