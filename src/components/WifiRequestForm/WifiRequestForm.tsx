"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import type {
  WifiQuestion,
  WifiService,
} from "@/data/wifi-services";

type WifiRequestFormProps = {
  service: WifiService;
  businessName: string;
  whatsappNumber: string;
  supportedIsp: string;
};

export default function WifiRequestForm({
  service,
  businessName,
  whatsappNumber,
  supportedIsp,
}: WifiRequestFormProps) {
  const [error, setError] = useState("");

  const submitRequest = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(
      formData.get("name") || "",
    ).trim();

    const phone = String(
      formData.get("phone") || "",
    ).trim();

    const address = String(
      formData.get("address") || "",
    ).trim();

    const preferredTime = String(
      formData.get("preferredTime") || "",
    ).trim();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (address.length < 10) {
      setError(
        "Please enter your complete service address.",
      );
      return;
    }

    for (const question of service.questions) {
      if (!question.required) {
        continue;
      }

      const answer = String(
        formData.get(question.id) || "",
      ).trim();

      if (!answer) {
        setError(
          `Please complete the required field: ${question.label}.`,
        );
        return;
      }
    }

    const answers = service.questions
      .map((question) => {
        const answer = String(
          formData.get(question.id) || "",
        ).trim();

        return answer
          ? `• ${question.label}: ${answer}`
          : null;
      })
      .filter(
        (answer): answer is string =>
          typeof answer === "string",
      );

    const message = [
      `Hello ${businessName},`,
      "",
      `I need help with: ${service.title}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Supported ISP: ${supportedIsp}`,
      `Address: ${address}`,
      preferredTime
        ? `Preferred visit/call time: ${preferredTime}`
        : "",
      "",
      "Requirement details:",
      answers.length > 0
        ? answers.join("\n")
        : "No additional details provided.",
    ]
      .filter(Boolean)
      .join("\n");

    const cleanedWhatsappNumber =
      whatsappNumber.replace(/[^\d]/g, "");

    if (cleanedWhatsappNumber.length < 10) {
      setError(
        "The business WhatsApp number is temporarily unavailable.",
      );
      return;
    }

    const whatsappUrl =
      `https://wa.me/${cleanedWhatsappNumber}` +
      `?text=${encodeURIComponent(message)}`;

    setError("");

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <form
      onSubmit={submitRequest}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
    >
      <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <MessageCircle size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Request {service.shortTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Complete the details below. WhatsApp will open with your
            information ready to send to {businessName}.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <FormInput
          name="name"
          label="Full name"
          placeholder="Enter your full name"
          required
          icon={User}
          autoComplete="name"
        />

        <FormInput
          name="phone"
          label="Phone number"
          placeholder="Enter your mobile number"
          required
          icon={Phone}
          autoComplete="tel"
          type="tel"
        />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin size={16} className="text-sky-700" />
          Complete service address *
        </span>

        <textarea
          required
          minLength={10}
          maxLength={400}
          rows={4}
          name="address"
          autoComplete="street-address"
          placeholder="House/shop number, street, locality, city and PIN code"
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
        />
      </label>

      <div className="mt-5 space-y-5">
        {service.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
          />
        ))}
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Preferred visit or call time
        </span>

        <input
          name="preferredTime"
          maxLength={100}
          placeholder="For example: tomorrow after 4 PM"
          className="h-13 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
        />
      </label>

      <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-sky-900">
          <CheckCircle2 size={17} />
          Supported ISP: {supportedIsp}
        </p>

        <p className="mt-2 text-xs leading-5 text-sky-800">
          Submitting this form opens WhatsApp. You can review and
          edit the message before sending it.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1fbd5a] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 sm:w-auto"
      >
        <MessageCircle size={20} />
        Continue on WhatsApp
      </button>
    </form>
  );
}

type FormInputProps = {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

function FormInput({
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  autoComplete,
  icon: Icon,
}: FormInputProps) {
  return (
    <label>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={16} className="text-sky-700" />

        {label}
        {required ? " *" : ""}
      </span>

      <input
        required={required}
        type={type}
        name={name}
        maxLength={100}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-13 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

function QuestionField({
  question,
}: {
  question: WifiQuestion;
}) {
  const sharedClasses =
    "w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {question.label}
        {question.required ? " *" : ""}
      </span>

      {question.type === "textarea" ? (
        <textarea
          required={question.required}
          name={question.id}
          maxLength={500}
          rows={4}
          placeholder={question.placeholder}
          className={`${sharedClasses} resize-y py-3`}
        />
      ) : question.type === "select" ? (
        <select
          required={question.required}
          name={question.id}
          defaultValue=""
          className={`${sharedClasses} h-13`}
        >
          <option
            value=""
            disabled={question.required}
          >
            {question.placeholder ||
              (question.required
                ? "Select an option"
                : "Optional — select if known")}
          </option>

          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          required={question.required}
          name={question.id}
          maxLength={200}
          placeholder={question.placeholder}
          className={`${sharedClasses} h-13`}
        />
      )}
    </label>
  );
}