import Link from "next/link";
import {
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Wifi,
} from "lucide-react";
import AdminConfirmButton from "@/components/AdminConfirmButton/AdminConfirmButton";
import { getDatabase } from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import {
  createFieldKey,
  createSlug,
  parseQuestionOptions,
  seedWifiServicesIfEmpty,
} from "@/lib/wifi-database";

type WifiServiceRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  description: string;
  supported_isp: string;
  published: boolean;
  sort_order: number;
};

type WifiQuestionRow = {
  id: string;
  service_id: string;
  field_key: string;
  label: string;
  placeholder: string;
  field_type: "text" | "textarea" | "select";
  options: unknown;
  required: boolean;
  sort_order: number;
  published: boolean;
};

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

function clean(value: FormDataEntryValue | null, maximum = 500) {
  return String(value ?? "").trim().slice(0, maximum);
}

function getCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function normalizeOptions(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .filter((option): option is string => typeof option === "string")
    .join("\n");
}

function refreshWifiPages() {
  revalidateTag("wifi-services", {
    expire: 0,
  });

  revalidatePath("/");
  revalidatePath("/wifi-services");
  revalidatePath("/wifi-services/[service]", "page");
  revalidatePath("/admin/wifi");
}

async function addService(formData: FormData) {
  "use server";

  await requireAdmin();

  const title = clean(formData.get("title"), 150);
  const suppliedSlug = clean(formData.get("slug"), 100);
  const slug = createSlug(suppliedSlug || title);
  const shortTitle =
    clean(formData.get("shortTitle"), 100) || title;
  const description = clean(formData.get("description"), 2000);
  const supportedIsp =
    clean(formData.get("supportedIsp"), 100) || "Airtel";
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!title || !slug || !description) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO wifi_services (
      slug,
      title,
      short_title,
      description,
      supported_isp,
      published,
      sort_order
    )
    VALUES (
      ${slug},
      ${title},
      ${shortTitle},
      ${description},
      ${supportedIsp},
      FALSE,
      ${Number.isFinite(sortOrder) ? sortOrder : 0}
    )
    ON CONFLICT (slug)
    DO NOTHING
  `;

  refreshWifiPages();
}

async function updateService(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);
  const title = clean(formData.get("title"), 150);
  const shortTitle = clean(formData.get("shortTitle"), 100);
  const description = clean(formData.get("description"), 2000);
  const supportedIsp =
    clean(formData.get("supportedIsp"), 100) || "Airtel";
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const published = getCheckbox(formData, "published");

  if (!id || !title || !shortTitle || !description) {
    return;
  }

  const sql = getDatabase();

  await sql`
    UPDATE wifi_services
    SET
      title = ${title},
      short_title = ${shortTitle},
      description = ${description},
      supported_isp = ${supportedIsp},
      sort_order = ${Number.isFinite(sortOrder) ? sortOrder : 0},
      published = ${published},
      updated_at = NOW()
    WHERE id = ${id}::uuid
  `;

  refreshWifiPages();
}

async function deleteService(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM wifi_services
    WHERE id = ${id}::uuid
  `;

  refreshWifiPages();
}

async function addQuestion(formData: FormData) {
  "use server";

  await requireAdmin();

  const serviceId = clean(formData.get("serviceId"), 50);
  const label = clean(formData.get("label"), 200);
  const suppliedKey = clean(formData.get("fieldKey"), 100);
  const fieldKey = createFieldKey(suppliedKey || label);
  const placeholder = clean(formData.get("placeholder"), 500);
  const fieldType = clean(formData.get("fieldType"), 20);
  const options = parseQuestionOptions(
    clean(formData.get("options"), 3000),
  );
  const required = getCheckbox(formData, "required");
  const published = getCheckbox(formData, "published");
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (
    !serviceId ||
    !label ||
    !fieldKey ||
    !["text", "textarea", "select"].includes(fieldType)
  ) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO wifi_questions (
      service_id,
      field_key,
      label,
      placeholder,
      field_type,
      options,
      required,
      sort_order,
      published
    )
    VALUES (
      ${serviceId}::uuid,
      ${fieldKey},
      ${label},
      ${placeholder},
      ${fieldType},
      ${sql.json(fieldType === "select" ? options : [])},
      ${required},
      ${Number.isFinite(sortOrder) ? sortOrder : 0},
      ${published}
    )
    ON CONFLICT (service_id, field_key)
    DO NOTHING
  `;

  refreshWifiPages();
}

async function updateQuestion(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);
  const label = clean(formData.get("label"), 200);
  const placeholder = clean(formData.get("placeholder"), 500);
  const fieldType = clean(formData.get("fieldType"), 20);
  const options = parseQuestionOptions(
    clean(formData.get("options"), 3000),
  );
  const required = getCheckbox(formData, "required");
  const published = getCheckbox(formData, "published");
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (
    !id ||
    !label ||
    !["text", "textarea", "select"].includes(fieldType)
  ) {
    return;
  }

  const sql = getDatabase();

  await sql`
    UPDATE wifi_questions
    SET
      label = ${label},
      placeholder = ${placeholder},
      field_type = ${fieldType},
      options = ${sql.json(
        fieldType === "select" ? options : [],
      )},
      required = ${required},
      published = ${published},
      sort_order = ${Number.isFinite(sortOrder) ? sortOrder : 0}
    WHERE id = ${id}::uuid
  `;

  refreshWifiPages();
}

async function deleteQuestion(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM wifi_questions
    WHERE id = ${id}::uuid
  `;

  refreshWifiPages();
}

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export const dynamic = "force-dynamic";

export default async function AdminWifiPage() {
  await requireAdmin();
  await seedWifiServicesIfEmpty();

  const sql = getDatabase();

  const services = await sql<WifiServiceRow[]>`
    SELECT
      id,
      slug,
      title,
      short_title,
      description,
      supported_isp,
      published,
      sort_order
    FROM wifi_services
    ORDER BY sort_order, title
  `;

  const questions = await sql<WifiQuestionRow[]>`
    SELECT
      id,
      service_id,
      field_key,
      label,
      placeholder,
      field_type,
      options,
      required,
      sort_order,
      published
    FROM wifi_questions
    ORDER BY service_id, sort_order, label
  `;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          Admin dashboard
        </Link>

        <div className="mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
            Bhumi Enterprise
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
            WiFi service management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Edit public services and control the questions included
            in each WhatsApp request form.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-sky-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Plus size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Add WiFi service
              </h2>

              <p className="text-sm text-slate-600">
                New services start hidden so you can add questions
                before publishing them.
              </p>
            </div>
          </div>

          <form
            action={addService}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <label className="text-sm font-bold text-slate-700">
              Service title *
              <input
                required
                name="title"
                placeholder="For example: WiFi Relocation"
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold text-slate-700">
              URL slug
              <input
                name="slug"
                placeholder="Leave blank to create automatically"
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold text-slate-700">
              Short title *
              <input
                required
                name="shortTitle"
                placeholder="For example: Relocation"
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold text-slate-700">
              Supported ISP
              <input
                name="supportedIsp"
                defaultValue="Airtel"
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Description *
              <textarea
                required
                name="description"
                rows={3}
                placeholder="Describe the service"
                className={textareaClass}
              />
            </label>

            <label className="text-sm font-bold text-slate-700">
              Display order
              <input
                name="sortOrder"
                type="number"
                defaultValue={services.length}
                className={inputClass}
              />
            </label>

            <div className="flex items-end">
              <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-700 px-5 font-bold text-white hover:bg-sky-800">
                <Plus size={18} />
                Add hidden service
              </button>
            </div>
          </form>
        </section>

        <div className="mt-10 space-y-8">
          {services.map((service) => {
            const serviceQuestions = questions.filter(
              (question) => question.service_id === service.id,
            );

            return (
              <section
                key={service.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <Wifi size={22} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-950">
                          {service.title}
                        </h2>

                        <p className="text-sm text-slate-500">
                          /wifi-services/{service.slug}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase ${
                        service.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {service.published ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                      {service.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <form
                    action={updateService}
                    className="mt-6 grid gap-4 md:grid-cols-2"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={service.id}
                    />

                    <label className="text-sm font-bold text-slate-700">
                      Service title
                      <input
                        required
                        name="title"
                        defaultValue={service.title}
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-bold text-slate-700">
                      Short title
                      <input
                        required
                        name="shortTitle"
                        defaultValue={service.short_title}
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-bold text-slate-700">
                      Supported ISP
                      <input
                        name="supportedIsp"
                        defaultValue={service.supported_isp}
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-bold text-slate-700">
                      Display order
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={service.sort_order}
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-bold text-slate-700 md:col-span-2">
                      Description
                      <textarea
                        required
                        name="description"
                        rows={3}
                        defaultValue={service.description}
                        className={textareaClass}
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        name="published"
                        value="true"
                        defaultChecked={service.published}
                        className="h-5 w-5 accent-sky-700"
                      />
                      Display this service publicly
                    </label>

                    <div className="flex flex-wrap justify-end gap-3">
                      <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 font-bold text-white hover:bg-sky-700">
                        <Save size={17} />
                        Save service
                      </button>
                    </div>
                  </form>

                  <form
                    action={deleteService}
                    className="mt-4 flex justify-end border-t border-slate-200 pt-4"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={service.id}
                    />

                    <AdminConfirmButton
                      message={`Permanently delete "${service.title}" and all its questions?`}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete service permanently
                    </AdminConfirmButton>
                  </form>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        Form questions
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {serviceQuestions.length} configured questions
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {serviceQuestions.map((question) => (
                      <form
                        key={question.id}
                        action={updateQuestion}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={question.id}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="text-sm font-bold text-slate-700">
                            Question label
                            <input
                              required
                              name="label"
                              defaultValue={question.label}
                              className={inputClass}
                            />
                          </label>

                          <label className="text-sm font-bold text-slate-700">
                            Field key
                            <input
                              readOnly
                              value={question.field_key}
                              className={`${inputClass} bg-slate-200 text-slate-500`}
                            />
                          </label>

                          <label className="text-sm font-bold text-slate-700">
                            Input type
                            <select
                              name="fieldType"
                              defaultValue={question.field_type}
                              className={inputClass}
                            >
                              <option value="text">
                                Single-line text
                              </option>
                              <option value="textarea">
                                Larger text area
                              </option>
                              <option value="select">
                                Dropdown options
                              </option>
                            </select>
                          </label>

                          <label className="text-sm font-bold text-slate-700">
                            Display order
                            <input
                              name="sortOrder"
                              type="number"
                              defaultValue={question.sort_order}
                              className={inputClass}
                            />
                          </label>

                          <label className="text-sm font-bold text-slate-700 md:col-span-2">
                            Placeholder or first dropdown message
                            <input
                              name="placeholder"
                              defaultValue={question.placeholder}
                              className={inputClass}
                            />
                          </label>

                          <label className="text-sm font-bold text-slate-700 md:col-span-2">
                            Dropdown options
                            <textarea
                              name="options"
                              rows={4}
                              defaultValue={normalizeOptions(
                                question.options,
                              )}
                              placeholder="One option per line. Used only when input type is Dropdown."
                              className={textareaClass}
                            />
                          </label>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-5">
                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input
                              type="checkbox"
                              name="required"
                              value="true"
                              defaultChecked={question.required}
                              className="h-5 w-5 accent-sky-700"
                            />
                            Required
                          </label>

                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input
                              type="checkbox"
                              name="published"
                              value="true"
                              defaultChecked={question.published}
                              className="h-5 w-5 accent-sky-700"
                            />
                            Visible on website
                          </label>

                          <button className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                            <Save size={16} />
                            Save question
                          </button>
                        </div>
                      </form>
                    ))}
                  </div>

                  <div className="mt-7 rounded-2xl border border-dashed border-sky-300 bg-sky-50 p-5">
                    <h4 className="font-bold text-slate-950">
                      Add a question to {service.short_title}
                    </h4>

                    <form
                      action={addQuestion}
                      className="mt-4 grid gap-4 md:grid-cols-2"
                    >
                      <input
                        type="hidden"
                        name="serviceId"
                        value={service.id}
                      />

                      <label className="text-sm font-bold text-slate-700">
                        Question label *
                        <input
                          required
                          name="label"
                          placeholder="For example: Preferred speed"
                          className={inputClass}
                        />
                      </label>

                      <label className="text-sm font-bold text-slate-700">
                        Field key
                        <input
                          name="fieldKey"
                          placeholder="Leave blank to create automatically"
                          className={inputClass}
                        />
                      </label>

                      <label className="text-sm font-bold text-slate-700">
                        Input type *
                        <select
                          required
                          name="fieldType"
                          defaultValue="text"
                          className={inputClass}
                        >
                          <option value="text">
                            Single-line text
                          </option>
                          <option value="textarea">
                            Larger text area
                          </option>
                          <option value="select">
                            Dropdown options
                          </option>
                        </select>
                      </label>

                      <label className="text-sm font-bold text-slate-700">
                        Display order
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={serviceQuestions.length}
                          className={inputClass}
                        />
                      </label>

                      <label className="text-sm font-bold text-slate-700 md:col-span-2">
                        Placeholder
                        <input
                          name="placeholder"
                          placeholder="Instruction displayed inside the field"
                          className={inputClass}
                        />
                      </label>

                      <label className="text-sm font-bold text-slate-700 md:col-span-2">
                        Dropdown options
                        <textarea
                          name="options"
                          rows={4}
                          placeholder={"One option per line\nFor example:\n40 Mbps\n100 Mbps\nLet the owner recommend"}
                          className={textareaClass}
                        />
                      </label>

                      <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            name="required"
                            value="true"
                            className="h-5 w-5 accent-sky-700"
                          />
                          Required
                        </label>

                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            name="published"
                            value="true"
                            defaultChecked
                            className="h-5 w-5 accent-sky-700"
                          />
                          Visible
                        </label>
                      </div>

                      <div className="flex justify-end">
                        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-700 px-5 font-bold text-white hover:bg-sky-800">
                          <Plus size={17} />
                          Add question
                        </button>
                      </div>
                    </form>
                  </div>

                  {serviceQuestions.map((question) => (
                    <form
                      key={`delete-${question.id}`}
                      action={deleteQuestion}
                      className="mt-3 flex justify-end"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={question.id}
                      />

                      <AdminConfirmButton
                        message={`Permanently delete the question "${question.label}"?`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Delete “{question.label}”
                      </AdminConfirmButton>
                    </form>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}