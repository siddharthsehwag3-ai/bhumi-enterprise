import Link from "next/link";
import {
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Car,
  Link2,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import AdminConfirmButton from "@/components/AdminConfirmButton/AdminConfirmButton";
import {
  getAllBatteryCategories,
  getAllBatteryProducts,
} from "@/lib/battery-database";
import { getDatabase } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

type CompatibilityPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

type VehicleMake = {
  id: string;
  category_id: string;
  name: string;
  published: boolean;
  sort_order: number;
};

type VehicleModel = {
  id: string;
  make_id: string;
  make_name: string;
  name: string;
  fuel_type: string;
  variant: string;
  year_from: number | null;
  year_to: number | null;
  published: boolean;
  sort_order: number;
};

type Compatibility = {
  id: string;
  battery_id: string;
  vehicle_model_id: string;
  battery_name: string;
  battery_model: string;
  brand: string;
  make_name: string;
  vehicle_name: string;
  fuel_type: string;
  variant: string;
  recommended: boolean;
  notes: string;
};

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

function clean(
  value: FormDataEntryValue | null,
  maximumLength = 500,
) {
  return String(value ?? "")
    .trim()
    .slice(0, maximumLength);
}

function optionalYear(value: FormDataEntryValue | null) {
  const cleaned = clean(value, 4);

  if (!cleaned) {
    return null;
  }

  const year = Number(cleaned);
  const maximumYear = new Date().getFullYear() + 2;

  if (
    !Number.isInteger(year) ||
    year < 1950 ||
    year > maximumYear
  ) {
    return null;
  }

  return year;
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }
}

function refreshCompatibilityPages() {
  revalidateTag("battery-catalogue", {
    expire: 0,
  });

  revalidatePath(
    "/admin/batteries/compatibility",
  );
  revalidatePath("/batteries/[category]", "page");
}

async function addMake(formData: FormData) {
  "use server";

  await requireAdmin();

  const categoryId = clean(
    formData.get("categoryId"),
    50,
  );

  const name = clean(formData.get("name"), 120);

  const sortOrder = Number(
    formData.get("sortOrder") || 0,
  );

  if (!categoryId || name.length < 2) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO vehicle_makes (
      category_id,
      name,
      published,
      sort_order
    )
    VALUES (
      ${categoryId}::uuid,
      ${name},
      TRUE,
      ${Number.isFinite(sortOrder) ? sortOrder : 0}
    )
    ON CONFLICT (category_id, name)
    DO UPDATE SET
      published = TRUE,
      sort_order = EXCLUDED.sort_order
  `;

  refreshCompatibilityPages();
}

async function deleteMake(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM vehicle_makes
    WHERE id = ${id}::uuid
  `;

  refreshCompatibilityPages();
}

async function addModel(formData: FormData) {
  "use server";

  await requireAdmin();

  const makeId = clean(formData.get("makeId"), 50);
  const name = clean(formData.get("name"), 150);
  const fuelType = clean(formData.get("fuelType"), 50);
  const variant = clean(formData.get("variant"), 150);
  const yearFrom = optionalYear(formData.get("yearFrom"));
  const yearTo = optionalYear(formData.get("yearTo"));

  const sortOrder = Number(
    formData.get("sortOrder") || 0,
  );

  if (!makeId || name.length < 1) {
    return;
  }

  if (
    yearFrom !== null &&
    yearTo !== null &&
    yearFrom > yearTo
  ) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO vehicle_models (
      make_id,
      name,
      fuel_type,
      variant,
      year_from,
      year_to,
      published,
      sort_order
    )
    VALUES (
      ${makeId}::uuid,
      ${name},
      ${fuelType},
      ${variant},
      ${yearFrom},
      ${yearTo},
      TRUE,
      ${Number.isFinite(sortOrder) ? sortOrder : 0}
    )
  `;

  refreshCompatibilityPages();
}

async function deleteModel(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM vehicle_models
    WHERE id = ${id}::uuid
  `;

  refreshCompatibilityPages();
}

async function assignBattery(formData: FormData) {
  "use server";

  await requireAdmin();

  const batteryId = clean(
    formData.get("batteryId"),
    50,
  );

  const vehicleModelId = clean(
    formData.get("vehicleModelId"),
    50,
  );

  const notes = clean(formData.get("notes"), 1000);

  const recommended =
    formData.get("recommended") === "true";

  if (!batteryId || !vehicleModelId) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO battery_compatibility (
      battery_id,
      vehicle_model_id,
      recommended,
      notes
    )
    VALUES (
      ${batteryId}::uuid,
      ${vehicleModelId}::uuid,
      ${recommended},
      ${notes}
    )
    ON CONFLICT (battery_id, vehicle_model_id)
    DO UPDATE SET
      recommended = EXCLUDED.recommended,
      notes = EXCLUDED.notes
  `;

  refreshCompatibilityPages();
}

async function deleteCompatibility(
  formData: FormData,
) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM battery_compatibility
    WHERE id = ${id}::uuid
  `;

  refreshCompatibilityPages();
}

export const dynamic = "force-dynamic";

export default async function CompatibilityPage({
  searchParams,
}: CompatibilityPageProps) {
  await requireAdmin();

  const parameters = await searchParams;

  const [categories, products] = await Promise.all([
    getAllBatteryCategories(),
    getAllBatteryProducts(),
  ]);

  const vehicleCategories = categories.filter(
    (category) => category.finderType === "vehicle",
  );

  const selectedCategory =
    vehicleCategories.find(
      (category) =>
        category.slug === parameters.category,
    ) ??
    vehicleCategories[0] ??
    null;

  if (!selectedCategory) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        No vehicle battery category is available.
      </main>
    );
  }

  const sql = getDatabase();

  const makes = await sql<VehicleMake[]>`
    SELECT
      id,
      category_id,
      name,
      published,
      sort_order
    FROM vehicle_makes
    WHERE category_id =
      ${selectedCategory.databaseId}::uuid
    ORDER BY sort_order, name
  `;

  const models = await sql<VehicleModel[]>`
    SELECT
      vehicle_models.id,
      vehicle_models.make_id,
      vehicle_makes.name AS make_name,
      vehicle_models.name,
      vehicle_models.fuel_type,
      vehicle_models.variant,
      vehicle_models.year_from,
      vehicle_models.year_to,
      vehicle_models.published,
      vehicle_models.sort_order
    FROM vehicle_models
    INNER JOIN vehicle_makes
      ON vehicle_makes.id = vehicle_models.make_id
    WHERE vehicle_makes.category_id =
      ${selectedCategory.databaseId}::uuid
    ORDER BY
      vehicle_makes.sort_order,
      vehicle_makes.name,
      vehicle_models.sort_order,
      vehicle_models.name
  `;

  const compatibility = await sql<Compatibility[]>`
    SELECT
      battery_compatibility.id,
      battery_compatibility.battery_id,
      battery_compatibility.vehicle_model_id,
      batteries.name AS battery_name,
      batteries.model AS battery_model,
      batteries.brand,
      vehicle_makes.name AS make_name,
      vehicle_models.name AS vehicle_name,
      vehicle_models.fuel_type,
      vehicle_models.variant,
      battery_compatibility.recommended,
      battery_compatibility.notes
    FROM battery_compatibility
    INNER JOIN batteries
      ON batteries.id =
        battery_compatibility.battery_id
    INNER JOIN vehicle_models
      ON vehicle_models.id =
        battery_compatibility.vehicle_model_id
    INNER JOIN vehicle_makes
      ON vehicle_makes.id =
        vehicle_models.make_id
    WHERE vehicle_makes.category_id =
      ${selectedCategory.databaseId}::uuid
    ORDER BY
      vehicle_makes.name,
      vehicle_models.name,
      battery_compatibility.recommended DESC,
      batteries.model
  `;

  const categoryProducts = products.filter(
    (product) =>
      product.category === selectedCategory.slug,
  );

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/batteries"
            className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700"
          >
            <ArrowLeft size={18} />
            Battery management
          </Link>

          <Link
            href={`/batteries/${selectedCategory.slug}`}
            target="_blank"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Open public category
          </Link>
        </div>

        <div className="mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Exact vehicle matching
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
            Vehicle compatibility
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Add only compatibility confirmed by the business owner
            or a reliable product catalogue. Customers will choose
            from these predefined records.
          </p>
        </div>

        <nav className="mt-8 flex gap-3 overflow-x-auto pb-3">
          {vehicleCategories.map((category) => (
            <Link
              key={category.databaseId}
              href={`/admin/batteries/compatibility?category=${category.slug}`}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold ${
                selectedCategory.slug === category.slug
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {category.shortTitle}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-7 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Car className="text-emerald-700" />

              <h2 className="text-2xl font-bold text-slate-950">
                Vehicle manufacturers
              </h2>
            </div>

            <form
              action={addMake}
              className="mt-6 grid gap-4 sm:grid-cols-[1fr_130px_auto]"
            >
              <input
                type="hidden"
                name="categoryId"
                value={selectedCategory.databaseId}
              />

              <label className="text-sm font-bold text-slate-700">
                Manufacturer *
                <input
                  required
                  name="name"
                  placeholder="For example: Maruti Suzuki"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-bold text-slate-700">
                Order
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue={makes.length}
                  className={inputClass}
                />
              </label>

              <div className="flex items-end">
                <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-700">
                  <Plus size={17} />
                  Add
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {makes.map((make) => (
                <form
                  key={make.id}
                  action={deleteMake}
                  className="inline-flex"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={make.id}
                  />

                  <AdminConfirmButton
                    message={`Delete ${make.name}, all its models and all connected compatibility records?`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    {make.name}
                    <Trash2 size={14} />
                  </AdminConfirmButton>
                </form>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Car className="text-emerald-700" />

              <h2 className="text-2xl font-bold text-slate-950">
                Add vehicle model
              </h2>
            </div>

            {makes.length === 0 ? (
              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Add a manufacturer first.
              </p>
            ) : (
              <form
                action={addModel}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                <label className="text-sm font-bold text-slate-700">
                  Manufacturer *
                  <select
                    required
                    name="makeId"
                    className={inputClass}
                  >
                    {makes.map((make) => (
                      <option key={make.id} value={make.id}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Vehicle model *
                  <input
                    required
                    name="name"
                    placeholder="For example: Swift"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Fuel type
                  <select
                    name="fuelType"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="">Any or not specified</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Variant
                  <input
                    name="variant"
                    placeholder="Optional variant"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  From year
                  <input
                    name="yearFrom"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 2}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  To year
                  <input
                    name="yearTo"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 2}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Display order
                  <input
                    name="sortOrder"
                    type="number"
                    min="0"
                    defaultValue={models.length}
                    className={inputClass}
                  />
                </label>

                <div className="flex items-end">
                  <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-700">
                    <Plus size={17} />
                    Add vehicle model
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Available vehicle models
          </h2>

          {models.length === 0 ? (
            <p className="mt-4 text-slate-600">
              No vehicle models have been entered.
            </p>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-bold text-slate-950">
                      {model.make_name} {model.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {[
                        model.fuel_type,
                        model.variant,
                        model.year_from || model.year_to
                          ? `${model.year_from ?? "Any"}–${model.year_to ?? "Current"}`
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" · ") || "General model"}
                    </p>
                  </div>

                  <form action={deleteModel}>
                    <input
                      type="hidden"
                      name="id"
                      value={model.id}
                    />

                    <AdminConfirmButton
                      message={`Delete ${model.make_name} ${model.name} and its battery connections?`}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </AdminConfirmButton>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Link2 className="text-emerald-700" />

            <h2 className="text-2xl font-bold text-slate-950">
              Connect battery to vehicle
            </h2>
          </div>

          {models.length === 0 ||
          categoryProducts.length === 0 ? (
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              At least one vehicle model and one battery are required.
            </p>
          ) : (
            <form
              action={assignBattery}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <label className="text-sm font-bold text-slate-700">
                Vehicle *
                <select
                  required
                  name="vehicleModelId"
                  className={inputClass}
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.make_name} {model.name}
                      {model.fuel_type
                        ? ` — ${model.fuel_type}`
                        : ""}
                      {model.variant
                        ? ` — ${model.variant}`
                        : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-bold text-slate-700">
                Compatible battery *
                <select
                  required
                  name="batteryId"
                  className={inputClass}
                >
                  {categoryProducts.map((product) => (
                    <option
                      key={product.databaseId}
                      value={product.databaseId}
                    >
                      {product.brand} — {product.model}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-bold text-slate-700 md:col-span-2">
                Compatibility note
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Optional fitting or variant information"
                  className={textareaClass}
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="recommended"
                  value="true"
                  className="h-5 w-5 accent-emerald-600"
                />
                Recommended battery for this vehicle
              </label>

              <div className="flex justify-end">
                <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-700">
                  <Link2 size={17} />
                  Save compatibility
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-extrabold text-slate-950">
              Confirmed compatibility
            </h2>

            <p className="font-semibold text-slate-600">
              {compatibility.length} connections
            </p>
          </div>

          {compatibility.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Battery
                size={38}
                className="mx-auto text-slate-400"
              />

              <p className="mt-4 font-semibold text-slate-700">
                No batteries have been connected to vehicle models.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {compatibility.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-950">
                        {item.make_name} {item.vehicle_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {[item.fuel_type, item.variant]
                          .filter(Boolean)
                          .join(" · ") || "General model"}
                      </p>

                      <p className="mt-4 font-bold text-emerald-700">
                        {item.brand} — {item.battery_model}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {item.battery_name}
                      </p>

                      {item.notes && (
                        <p className="mt-3 text-sm text-slate-500">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {item.recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          <Star
                            size={13}
                            fill="currentColor"
                          />
                          Recommended
                        </span>
                      )}

                      <form action={deleteCompatibility}>
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />

                        <AdminConfirmButton
                          message={`Remove the ${item.battery_model} connection from ${item.make_name} ${item.vehicle_name}?`}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </AdminConfirmButton>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}