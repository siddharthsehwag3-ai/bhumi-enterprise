import Link from "next/link";
import { compare, hash } from "bcryptjs";
import {
  createHash,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getDatabase } from "@/lib/db";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    sent?: string;
    error?: string;
    reset?: string;
    email?: string;
  }>;
};

type AdminRow = {
  id: number;
  email: string;
  display_name: string;
};

type ResetRow = {
  id: string;
  admin_id: number;
  code_hash: string;
  attempts: number;
  password_hash: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

function clean(
  value: FormDataEntryValue | null | undefined,
  maximumLength: number,
) {
  return String(value ?? "")
    .trim()
    .slice(0, maximumLength);
}

function hashResetCode(code: string) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return createHash("sha256")
    .update(`${code}:${secret}`)
    .digest("hex");
}

function hashesMatch(first: string, second: string) {
  const firstBuffer = Buffer.from(first, "hex");
  const secondBuffer = Buffer.from(second, "hex");

  return (
    firstBuffer.length === secondBuffer.length &&
    timingSafeEqual(firstBuffer, secondBuffer)
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendResetCode(formData: FormData) {
  "use server";

  const email = clean(
    formData.get("email"),
    200,
  ).toLowerCase();

  if (!emailPattern.test(email)) {
    redirect("/admin/forgot-password?error=invalid-email");
  }

  const sql = getDatabase();

  const admins = await sql<AdminRow[]>`
    SELECT
      id,
      email,
      display_name
    FROM admin_users
    WHERE LOWER(email) = ${email}
      AND is_active = TRUE
    LIMIT 1
  `;

  /*
   * The same visible response is used when the administrator email
   * does not exist. This prevents outsiders from discovering valid
   * administrator accounts.
   */
  if (!admins[0]) {
    redirect("/admin/forgot-password?sent=1");
  }

  const admin = admins[0];

  const recentRequests = await sql<{ count: number }[]>`
    SELECT COUNT(*)::integer AS count
    FROM admin_password_resets
    WHERE admin_id = ${admin.id}
      AND created_at > NOW() - INTERVAL '15 minutes'
  `;

  if ((recentRequests[0]?.count ?? 0) >= 3) {
    redirect("/admin/forgot-password?error=too-many");
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.EMAIL_FROM;
  const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL;

  if (
    !resendApiKey ||
    resendApiKey === "replace_later" ||
    !senderEmail ||
    senderEmail === "replace_later" ||
    !recoveryEmail
  ) {
    redirect("/admin/forgot-password?error=email-config");
  }

  const code = randomInt(100000, 1000000).toString();
  const codeHash = hashResetCode(code);

  await sql.begin(async (transaction) => {
    await transaction`
      UPDATE admin_password_resets
      SET used = TRUE
      WHERE admin_id = ${admin.id}
        AND used = FALSE
    `;

    await transaction`
      INSERT INTO admin_password_resets (
        admin_id,
        code_hash,
        expires_at
      )
      VALUES (
        ${admin.id},
        ${codeHash},
        NOW() + INTERVAL '10 minutes'
      )
    `;
  });

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recoveryEmail],
        subject:
          "Bhumi Enterprise admin password reset code",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
            <h2>Admin password reset</h2>

            <p>
              A password reset was requested for:
              <strong>${escapeHtml(admin.email)}</strong>
            </p>

            <p>
              Administrator:
              <strong>${escapeHtml(admin.display_name)}</strong>
            </p>

            <p>Your one-time reset code is:</p>

            <p style="font-size:32px;font-weight:800;letter-spacing:8px">
              ${code}
            </p>

            <p>
              This code expires in 10 minutes and can be used only
              once.
            </p>

            <p>
              If you did not request this reset, do not share the
              code. No further action is required.
            </p>
          </div>
        `,
      }),
    },
  );

  if (!response.ok) {
    console.error(
      "Admin recovery email failed:",
      await response.text(),
    );

    await sql`
      UPDATE admin_password_resets
      SET used = TRUE
      WHERE admin_id = ${admin.id}
        AND code_hash = ${codeHash}
    `;

    redirect(
      "/admin/forgot-password?error=email-failed",
    );
  }

  redirect(
    `/admin/forgot-password?sent=1&email=${encodeURIComponent(
      email,
    )}`,
  );
}

async function resetPassword(formData: FormData) {
  "use server";

  const email = clean(
    formData.get("email"),
    200,
  ).toLowerCase();

  const code = clean(formData.get("code"), 6);

  const newPassword = clean(
    formData.get("newPassword"),
    200,
  );

  const confirmPassword = clean(
    formData.get("confirmPassword"),
    200,
  );

  if (
    !emailPattern.test(email) ||
    !/^\d{6}$/.test(code)
  ) {
    redirect(
      `/admin/forgot-password?sent=1&email=${encodeURIComponent(
        email,
      )}&error=invalid-code`,
    );
  }

  if (newPassword.length < 12) {
    redirect(
      `/admin/forgot-password?sent=1&email=${encodeURIComponent(
        email,
      )}&error=weak-password`,
    );
  }

  if (newPassword !== confirmPassword) {
    redirect(
      `/admin/forgot-password?sent=1&email=${encodeURIComponent(
        email,
      )}&error=password-mismatch`,
    );
  }

  const sql = getDatabase();

  const resets = await sql<ResetRow[]>`
    SELECT
      admin_password_resets.id,
      admin_password_resets.admin_id,
      admin_password_resets.code_hash,
      admin_password_resets.attempts,
      admin_users.password_hash
    FROM admin_password_resets
    INNER JOIN admin_users
      ON admin_users.id = admin_password_resets.admin_id
    WHERE LOWER(admin_users.email) = ${email}
      AND admin_users.is_active = TRUE
      AND admin_password_resets.used = FALSE
      AND admin_password_resets.expires_at > NOW()
    ORDER BY admin_password_resets.created_at DESC
    LIMIT 1
  `;

  const reset = resets[0];
  const submittedHash = hashResetCode(code);

  if (
    !reset ||
    reset.attempts >= 5 ||
    !hashesMatch(reset.code_hash, submittedHash)
  ) {
    if (reset) {
      await sql`
        UPDATE admin_password_resets
        SET
          attempts = attempts + 1,
          used = CASE
            WHEN attempts + 1 >= 5 THEN TRUE
            ELSE used
          END
        WHERE id = ${reset.id}::uuid
      `;
    }

    redirect(
      `/admin/forgot-password?sent=1&email=${encodeURIComponent(
        email,
      )}&error=invalid-code`,
    );
  }

  const sameAsOldPassword = await compare(
    newPassword,
    reset.password_hash,
  );

  if (sameAsOldPassword) {
    redirect(
      `/admin/forgot-password?sent=1&email=${encodeURIComponent(
        email,
      )}&error=same-password`,
    );
  }

  const newPasswordHash = await hash(newPassword, 12);

  await sql.begin(async (transaction) => {
    await transaction`
      UPDATE admin_users
      SET
        password_hash = ${newPasswordHash},
        updated_at = NOW()
      WHERE id = ${reset.admin_id}
    `;

    await transaction`
      UPDATE admin_password_resets
      SET
        used = TRUE,
        used_at = NOW()
      WHERE admin_id = ${reset.admin_id}
        AND used = FALSE
    `;
  });

  redirect("/admin/login?reset=success");
}

const errorMessages: Record<string, string> = {
  "invalid-email":
    "Enter a valid administrator email address.",
  "too-many":
    "Too many reset requests were made. Wait 15 minutes and try again.",
  "email-config":
    "Recovery email is not configured. Check the server email settings.",
  "email-failed":
    "The recovery email could not be delivered. Please try again.",
  "invalid-code":
    "The code is incorrect, expired or has already been used.",
  "weak-password":
    "The new password must contain at least 12 characters.",
  "password-mismatch":
    "The two new-password fields do not match.",
  "same-password":
    "Choose a password different from the current password.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const parameters = await searchParams;
  const sent = parameters.sent === "1";

  const error = parameters.error
    ? errorMessages[parameters.error]
    : "";

  const suppliedEmail = clean(parameters.email, 200);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to admin login
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <KeyRound size={28} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Bhumi Enterprise
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
            Reset admin password
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            The recovery code is delivered only to the protected
            Bhumi Enterprise recovery email.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}

          {!sent ? (
            <form action={sendResetCode} className="mt-7">
              <label className="text-sm font-bold text-slate-700">
                Administrator login email

                <span className="relative mt-2 block">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="Enter your admin email"
                    className={`${inputClass} mt-0 pl-12`}
                  />
                </span>
              </label>

              <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                <ShieldCheck size={18} />
                Send recovery code
              </button>
            </form>
          ) : (
            <form
              action={resetPassword}
              className="mt-7 space-y-5"
            >
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                If that administrator account exists, a six-digit
                code has been sent to the protected recovery email.
              </p>

              <label className="block text-sm font-bold text-slate-700">
                Administrator login email

                <input
                  required
                  type="email"
                  name="email"
                  defaultValue={suppliedEmail}
                  autoComplete="username"
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Six-digit recovery code

                <input
                  required
                  name="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  minLength={6}
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="000000"
                  className={`${inputClass} text-center text-xl font-bold tracking-[0.35em]`}
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                New password

                <input
                  required
                  type="password"
                  name="newPassword"
                  minLength={12}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Confirm new password

                <input
                  required
                  type="password"
                  name="confirmPassword"
                  minLength={12}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>

              <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                <LockKeyhole size={18} />
                Set new password
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}