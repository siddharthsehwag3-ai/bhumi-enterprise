import { getDatabase } from "@/lib/db";

type SubmissionType = "contact" | "review";

type SubmissionBody = {
  type?: SubmissionType;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  rating?: number;
  serviceUsed?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maximumLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maximumLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function deliverEmail({
  type,
  name,
  email,
  phone,
  subject,
  message,
  serviceUsed,
  rating,
  submissionId,
}: {
  type: SubmissionType;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceUsed: string;
  rating: number;
  submissionId: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.EMAIL_FROM;

  const recipients = process.env.SUBMISSION_RECIPIENT_EMAILS
    ?.split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  const emailIsConfigured =
    resendApiKey &&
    resendApiKey !== "replace_later" &&
    senderEmail &&
    senderEmail !== "replace_later" &&
    recipients?.length;

  if (!emailIsConfigured) {
    return false;
  }

  const status = type === "review" ? "pending" : "new";

  const emailSubject =
    type === "review"
      ? `New pending customer review — ${rating}/5`
      : `New website enquiry — ${subject || "General enquiry"}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
      <h2>
        ${
          type === "review"
            ? "New customer review"
            : "New website enquiry"
        }
      </h2>

      <p><strong>Submission ID:</strong> ${escapeHtml(submissionId)}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Customer email:</strong> ${escapeHtml(email)}</p>

      ${
        phone
          ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`
          : ""
      }

      ${
        type === "review"
          ? `
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p>
              <strong>Product/service used:</strong>
              ${escapeHtml(serviceUsed)}
            </p>
          `
          : `
            <p>
              <strong>Subject:</strong>
              ${escapeHtml(subject || "General enquiry")}
            </p>
          `
      }

      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>

      <p>
        <em>
          This submission has also been saved in the Bhumi Enterprise
          admin panel.
        </em>
      </p>
    </div>
  `;

  const resendResponse = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: recipients,
        reply_to: email,
        subject: emailSubject,
        html,
      }),
    },
  );

  if (!resendResponse.ok) {
    console.error(
      "Resend email delivery failed:",
      await resendResponse.text(),
    );

    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody;

    // Spam bots often fill this hidden field. Real visitors leave it empty.
    if (clean(body.website, 200)) {
      return Response.json({ success: true });
    }

    const type = body.type;
    const name = clean(body.name, 80);
    const email = clean(body.email, 120).toLowerCase();
    const phone = clean(body.phone, 20);
    const subject = clean(body.subject, 120);
    const message = clean(body.message, 1500);
    const serviceUsed = clean(body.serviceUsed, 100);
    const rating = Number(body.rating);

    if (type !== "contact" && type !== "review") {
      return Response.json(
        { error: "Invalid submission type." },
        { status: 400 },
      );
    }

    if (name.length < 2) {
      return Response.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return Response.json(
        { error: "Please enter at least 10 characters." },
        { status: 400 },
      );
    }

    if (
      type === "review" &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      return Response.json(
        { error: "Please select a rating from 1 to 5." },
        { status: 400 },
      );
    }

    if (type === "review" && !serviceUsed) {
      return Response.json(
        {
          error: "Please select the product or service used.",
        },
        { status: 400 },
      );
    }

    const sql = getDatabase();

    let submissionId = "";

    if (type === "review") {
      const rows = await sql<{ id: string }[]>`
        INSERT INTO reviews (
          customer_name,
          customer_email,
          service_used,
          rating,
          review_text,
          status
        )
        VALUES (
          ${name},
          ${email},
          ${serviceUsed},
          ${rating},
          ${message},
          'pending'
        )
        RETURNING id
      `;

      submissionId = rows[0].id;
    } else {
      const rows = await sql<{ id: string }[]>`
        INSERT INTO enquiries (
          enquiry_type,
          customer_name,
          customer_email,
          customer_phone,
          subject,
          message,
          status
        )
        VALUES (
          'contact',
          ${name},
          ${email},
          ${phone || null},
          ${subject || "General enquiry"},
          ${message},
          'new'
        )
        RETURNING id
      `;

      submissionId = rows[0].id;
    }

    const emailDelivered = await deliverEmail({
      type,
      name,
      email,
      phone,
      subject,
      message,
      serviceUsed,
      rating,
      submissionId,
    });

    return Response.json({
      success: true,
      id: submissionId,
      status: type === "review" ? "pending" : "new",
      emailDelivered,
      message:
        type === "review"
          ? "Thank you. Your review was submitted for approval."
          : "Thank you. Your enquiry has been received.",
    });
  } catch (error) {
    console.error("Submission processing error:", error);

    return Response.json(
      {
        error:
          "Unable to process your submission. Please try again.",
      },
      { status: 500 },
    );
  }
}