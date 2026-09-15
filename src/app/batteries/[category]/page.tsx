import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import BatteryCatalog from "@/components/BatteryCatalog/BatteryCatalog";
import {
  getPublishedBatteryCategory,
  getPublishedProductsByCategory,
} from "@/lib/battery-database";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: requestedCategory } = await params;
  const category =
    await getPublishedBatteryCategory(requestedCategory);

  if (!category) {
    return {
      title: "Battery Catalogue",
    };
  }

  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category: requestedCategory } = await params;

  const [category, products] = await Promise.all([
    getPublishedBatteryCategory(requestedCategory),
    getPublishedProductsByCategory(requestedCategory),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f4f8f5]/90 px-5 py-14 sm:px-6 sm:py-16">
      <div className="relative z-30 mx-auto max-w-7xl">
        <Link
          href="/batteries"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={17} />
          All battery categories
        </Link>

        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Bhumi Enterprise
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            {category.title}
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
            {category.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={16} />
              Free battery installation
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={16} />
              Free battery checkup
            </span>
          </div>
        </div>

        <BatteryCatalog
          categoryTitle={category.title}
          finderType={category.finderType}
          products={products}
        />
      </div>
    </main>
  );
}