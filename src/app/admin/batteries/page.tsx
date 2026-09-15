import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import AdminConfirmButton from "@/components/AdminConfirmButton/AdminConfirmButton";
import BatteryImageField from "@/components/BatteryImageField/BatteryImageField";
import {
  getAllBatteryCategories,
  getAllBatteryProducts,
} from "@/lib/battery-database";
import { getDatabase } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

type AdminBatteriesPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const statuses = [
  "available",
  "coming-soon",
  "out-of-stock",
  "draft",
  "hidden",
  "discontinued",
] as const;

const brands = ["Tata Green", "Amaron", "Geon"] as const;

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

function clean(
  value: FormDataEntryValue | null,
  maximum = 1000,
) {
  return String(value ?? "").trim().slice(0, maximum);
}

function optionalNumber(value: FormDataEntryValue | null) {
  const cleaned = clean(value, 30);

  if (!cleaned) {
    return null;
  }

  const number = Number(cleaned);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }
}

function refreshBatteryPages() {
  revalidatePath("/");
  revalidatePath("/batteries");
  revalidatePath("/batteries/[category]", "page");
  revalidatePath("/admin/batteries");
}

async function addBattery(formData: FormData) {
  "use server";

  await requireAdmin();

  const categoryId = clean(formData.get("categoryId"), 50);
  const brand = clean(formData.get("brand"), 100);
  const name = clean(formData.get("name"), 200);
  const model = clean(formData.get("model"), 120);
  const description = clean(
    formData.get("description"),
    2000,
  );
  const imagePath = clean(formData.get("imagePath"), 1000);
  const capacity = optionalNumber(formData.get("capacity"));
  const voltage = optionalNumber(formData.get("voltage"));
  const warranty = clean(formData.get("warranty"), 500);
  const mrp = optionalNumber(formData.get("mrp"));
  const price = optionalNumber(formData.get("price"));
  const status = clean(formData.get("status"), 30);
  const sortOrder =
    optionalNumber(formData.get("sortOrder")) ?? 0;
  const priceCheckedOn =
    clean(formData.get("priceCheckedOn"), 20) || null;
  const published = checked(formData, "published");
  const featured = checked(formData, "featured");

  if (
    !categoryId ||
    !brands.includes(brand as (typeof brands)[number]) ||
    !name ||
    !model ||
    !description ||
    !warranty ||
    !statuses.includes(status as (typeof statuses)[number])
  ) {
    return;
  }

  const sql = getDatabase();

  await sql`
    INSERT INTO batteries (
      category_id,
      brand,
      name,
      model,
      description,
      image_path,
      capacity_ah,
      voltage,
      warranty,
      mrp,
      price,
      status,
      published,
      featured,
      sort_order,
      price_checked_on
    )
    VALUES (
      ${categoryId}::uuid,
      ${brand},
      ${name},
      ${model},
      ${description},
      ${imagePath},
      ${capacity},
      ${voltage},
      ${warranty},
      ${mrp},
      ${price},
      ${status},
      ${published},
      ${featured},
      ${sortOrder},
      ${priceCheckedOn}
    )
    ON CONFLICT (category_id, brand, model)
    DO NOTHING
  `;

  refreshBatteryPages();
}

async function updateBattery(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);
  const categoryId = clean(formData.get("categoryId"), 50);
  const brand = clean(formData.get("brand"), 100);
  const name = clean(formData.get("name"), 200);
  const model = clean(formData.get("model"), 120);
  const description = clean(
    formData.get("description"),
    2000,
  );
  const imagePath = clean(formData.get("imagePath"), 1000);
  const capacity = optionalNumber(formData.get("capacity"));
  const voltage = optionalNumber(formData.get("voltage"));
  const warranty = clean(formData.get("warranty"), 500);
  const mrp = optionalNumber(formData.get("mrp"));
  const price = optionalNumber(formData.get("price"));
  const status = clean(formData.get("status"), 30);
  const sortOrder =
    optionalNumber(formData.get("sortOrder")) ?? 0;
  const priceCheckedOn =
    clean(formData.get("priceCheckedOn"), 20) || null;
  const published = checked(formData, "published");
  const featured = checked(formData, "featured");

  if (
    !id ||
    !categoryId ||
    !brands.includes(brand as (typeof brands)[number]) ||
    !name ||
    !model ||
    !description ||
    !warranty ||
    !statuses.includes(status as (typeof statuses)[number])
  ) {
    return;
  }

  const sql = getDatabase();

  await sql`
    UPDATE batteries
    SET
      category_id = ${categoryId}::uuid,
      brand = ${brand},
      name = ${name},
      model = ${model},
      description = ${description},
      image_path = ${imagePath},
      capacity_ah = ${capacity},
      voltage = ${voltage},
      warranty = ${warranty},
      mrp = ${mrp},
      price = ${price},
      status = ${status},
      published = ${published},
      featured = ${featured},
      sort_order = ${sortOrder},
      price_checked_on = ${priceCheckedOn},
      updated_at = NOW()
    WHERE id = ${id}::uuid
  `;

  refreshBatteryPages();
}

async function deleteBattery(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = clean(formData.get("id"), 50);

  if (!id) {
    return;
  }

  const sql = getDatabase();

  await sql`
    DELETE FROM batteries
    WHERE id = ${id}::uuid
  `;

  refreshBatteryPages();
}

export const dynamic = "force-dynamic";

export default async function AdminBatteriesPage({
  searchParams,
}: AdminBatteriesPageProps) {
  await requireAdmin();

  const { category: requestedCategory } = await searchParams;

  const [categories, allProducts] = await Promise.all([
    getAllBatteryCategories(),
    getAllBatteryProducts(),
  ]);

  const selectedCategory =
    categories.find(
      (category) => category.slug === requestedCategory,
    ) ??
    categories[0] ??
    null;

  const products = selectedCategory
    ? allProducts.filter(
        (product) =>
          product.category === selectedCategory.slug,
      )
    : [];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Admin dashboard
        </Link>

        <div className="mt-7">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Bhumi Enterprise
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
            Battery catalogue management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Add, edit, publish, hide and delete batteries. Published
            products automatically use the existing public
            battery-card design and animation.
          </p>
        </div>

        <nav className="mt-8 flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => (
            <Link
              key={category.databaseId}
              href={`/admin/batteries?category=${category.slug}`}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                selectedCategory?.slug === category.slug
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-500"
              }`}
            >
              {category.shortTitle}
            </Link>
          ))}
        </nav>

        {selectedCategory && (
          <>
            <section className="mt-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Battery className="text-emerald-700" />

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Add {selectedCategory.shortTitle} product
                  </h2>

                  <p className="text-sm text-slate-600">
                    Leave Published unchecked until the product
                    details are ready.
                  </p>
                </div>
              </div>

              <form
                action={addBattery}
                className="mt-6 grid gap-5 md:grid-cols-2"
              >
                <ProductFields
                  categories={categories}
                  selectedCategoryId={
                    selectedCategory.databaseId
                  }
                />

                <div className="md:col-span-2">
                  <BatteryImageField />
                </div>

                <label className="flex items-center gap-2 font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="published"
                    value="true"
                    className="h-5 w-5 accent-emerald-600"
                  />
                  Publish immediately
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="featured"
                    value="true"
                    className="h-5 w-5 accent-emerald-600"
                  />
                  Featured product
                </label>

                <div className="md:col-span-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700">
                    <Plus size={18} />
                    Add battery
                  </button>
                </div>
              </form>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                    {selectedCategory.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
                    Existing products
                  </h2>
                </div>

                <p className="font-semibold text-slate-600">
                  {products.length} products
                </p>
              </div>

              {products.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Battery
                    size={38}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    No products in this category
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Use the form above to add the first product.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {products.map((product) => (
                    <details
                      key={product.databaseId}
                      className="rounded-2xl border border-slate-200 bg-white shadow-sm open:shadow-md"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                        <div>
                          <h3 className="font-bold text-slate-950">
                            {product.model}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {product.brand}
                            {product.price > 0
                              ? ` · ₹${product.price}`
                              : " · Price not entered"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                            product.published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {product.published ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}

                          {product.published
                            ? "Published"
                            : "Hidden"}
                        </span>
                      </summary>

                      <div className="border-t border-slate-200 p-5">
                        <form
                          action={updateBattery}
                          className="grid gap-5 md:grid-cols-2"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={product.databaseId}
                          />

                          <ProductFields
                            categories={categories}
                            selectedCategoryId={
                              categories.find(
                                (category) =>
                                  category.slug ===
                                  product.category,
                              )?.databaseId ?? ""
                            }
                            product={product}
                          />

                          <div className="md:col-span-2">
                            <BatteryImageField
                              defaultValue={product.image}
                            />
                          </div>

                          <label className="flex items-center gap-2 font-bold text-slate-700">
                            <input
                              type="checkbox"
                              name="published"
                              value="true"
                              defaultChecked={product.published}
                              className="h-5 w-5 accent-emerald-600"
                            />
                            Published
                          </label>

                          <label className="flex items-center gap-2 font-bold text-slate-700">
                            <input
                              type="checkbox"
                              name="featured"
                              value="true"
                              defaultChecked={product.featured}
                              className="h-5 w-5 accent-emerald-600"
                            />
                            Featured
                          </label>

                          <div className="md:col-span-2">
                            <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white hover:bg-emerald-700">
                              <Save size={17} />
                              Save product
                            </button>
                          </div>
                        </form>

                        <form
                          action={deleteBattery}
                          className="mt-5 border-t border-slate-200 pt-5"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={product.databaseId}
                          />

                          <AdminConfirmButton
                            message={`Permanently delete ${product.model}?`}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Delete permanently
                          </AdminConfirmButton>
                        </form>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

type ProductFieldsProps = {
  categories: Awaited<
    ReturnType<typeof getAllBatteryCategories>
  >;
  selectedCategoryId: string;
  product?: Awaited<
    ReturnType<typeof getAllBatteryProducts>
  >[number];
};

function ProductFields({
  categories,
  selectedCategoryId,
  product,
}: ProductFieldsProps) {
  return (
    <>
      <label className="text-sm font-bold text-slate-700">
        Category *
        <select
          required
          name="categoryId"
          defaultValue={selectedCategoryId}
          className={inputClass}
        >
          {categories.map((category) => (
            <option
              key={category.databaseId}
              value={category.databaseId}
            >
              {category.title}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-bold text-slate-700">
        Brand *
        <select
          required
          name="brand"
          defaultValue={product?.brand ?? "Tata Green"}
          className={inputClass}
        >
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-bold text-slate-700">
        Product name *
        <input
          required
          name="name"
          defaultValue={product?.name ?? ""}
          placeholder="Complete displayed product name"
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Model *
        <input
          required
          name="model"
          defaultValue={product?.model ?? ""}
          placeholder="Battery model number"
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700 md:col-span-2">
        Description *
        <textarea
          required
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Product description"
          className={textareaClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Capacity (Ah)
        <input
          name="capacity"
          type="number"
          min="0"
          step="0.1"
          defaultValue={product?.capacityAh || ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Voltage
        <input
          name="voltage"
          type="number"
          min="0"
          step="0.1"
          defaultValue={product?.voltage || ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700 md:col-span-2">
        Warranty *
        <input
          required
          name="warranty"
          defaultValue={product?.warranty ?? ""}
          placeholder="For example: 24 months free replacement"
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        MRP
        <input
          name="mrp"
          type="number"
          min="0"
          step="0.01"
          defaultValue={product?.mrp || ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Selling price
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={product?.price || ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Status *
        <select
          required
          name="status"
          defaultValue={product?.status ?? "available"}
          className={inputClass}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status
                .replaceAll("-", " ")
                .replace(/\b\w/g, (letter) =>
                  letter.toUpperCase(),
                )}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-bold text-slate-700">
        Display order
        <input
          name="sortOrder"
          type="number"
          min="0"
          defaultValue={product?.sortOrder ?? 0}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-bold text-slate-700">
        Price checked date
        <input
          name="priceCheckedOn"
          type="date"
          defaultValue={product?.priceCheckedOn ?? ""}
          className={inputClass}
        />
      </label>
    </>
  );
}