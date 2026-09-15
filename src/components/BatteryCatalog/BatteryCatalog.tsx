"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Battery,
  CheckCircle2,
  CarFront,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import type {
  BatteryProduct,
  ProductStatus,
} from "@/data/batteries";
import type { VehicleCompatibility } from "@/lib/battery-database";

type CatalogueProduct = BatteryProduct & {
  vehicleCompatibility?: VehicleCompatibility[];
};

type BatteryCatalogProps = {
  categoryTitle: string;
  finderType: "vehicle" | "application";
  products: CatalogueProduct[];
};

type VehicleMakeOption = {
  name: string;
};

type VehicleModelOption = VehicleCompatibility;

const PRODUCTS_PER_PAGE = 9;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const statusDetails: Record<
  ProductStatus,
  {
    label: string;
    button: string;
    badge: string;
  }
> = {
  available: {
    label: "Available",
    button: "Get This Battery",
    badge: "bg-emerald-600 text-white",
  },
  "coming-soon": {
    label: "",
    button: "Enquire About Battery",
    badge: "",
  },
  "out-of-stock": {
    label: "Out of Stock",
    button: "Enquire About Restock",
    badge: "bg-slate-700 text-white",
  },
  draft: {
    label: "",
    button: "Contact Us",
    badge: "",
  },
  hidden: {
    label: "",
    button: "Contact Us",
    badge: "",
  },
  discontinued: {
    label: "Discontinued",
    button: "Find an Alternative",
    badge: "bg-red-600 text-white",
  },
};

function vehicleModelLabel(vehicle: VehicleModelOption) {
  const details = [
    vehicle.model,
    vehicle.variant,
    vehicle.fuelType,
  ].filter(Boolean);

  let yearText = "";

  if (vehicle.yearFrom && vehicle.yearTo) {
    yearText = `${vehicle.yearFrom}–${vehicle.yearTo}`;
  } else if (vehicle.yearFrom) {
    yearText = `${vehicle.yearFrom} onwards`;
  } else if (vehicle.yearTo) {
    yearText = `up to ${vehicle.yearTo}`;
  }

  if (yearText) {
    details.push(yearText);
  }

  return details.join(" • ");
}

export default function BatteryCatalog({
  categoryTitle,
  finderType,
  products,
}: BatteryCatalogProps) {
  const [search, setSearch] = useState("");
  const [capacity, setCapacity] = useState("all");
  const [warranty, setWarranty] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedVehicleModelId, setSelectedVehicleModelId] =
    useState("");
  const [visibleCount, setVisibleCount] = useState(
    PRODUCTS_PER_PAGE,
  );

  const capacities = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.capacityAh)
            .filter((item) => item > 0),
        ),
      ).sort((first, second) => first - second),
    [products],
  );

  const warranties = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.warranty)),
      )
        .filter(Boolean)
        .sort(),
    [products],
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.status)),
      ).filter(
        (item) =>
          item !== "draft" &&
          item !== "hidden" &&
          item !== "discontinued",
      ),
    [products],
  );

  const allVehicleMappings = useMemo(() => {
    const mappings = products.flatMap(
      (product) => product.vehicleCompatibility ?? [],
    );

    const uniqueMappings = new Map<
      string,
      VehicleCompatibility
    >();

    for (const mapping of mappings) {
      uniqueMappings.set(mapping.vehicleModelId, mapping);
    }

    return Array.from(uniqueMappings.values());
  }, [products]);

  const vehicleMakes = useMemo<VehicleMakeOption[]>(() => {
    const uniqueMakes = new Set(
      allVehicleMappings.map((vehicle) => vehicle.make),
    );

    return Array.from(uniqueMakes)
      .sort((first, second) =>
        first.localeCompare(second, "en", {
          sensitivity: "base",
        }),
      )
      .map((name) => ({ name }));
  }, [allVehicleMappings]);

  const vehicleModels = useMemo<VehicleModelOption[]>(() => {
    if (!selectedMake) {
      return [];
    }

    return allVehicleMappings
      .filter((vehicle) => vehicle.make === selectedMake)
      .sort((first, second) =>
        vehicleModelLabel(first).localeCompare(
          vehicleModelLabel(second),
          "en",
          { sensitivity: "base" },
        ),
      );
  }, [allVehicleMappings, selectedMake]);

  const selectedVehicle = useMemo(
    () =>
      allVehicleMappings.find(
        (vehicle) =>
          vehicle.vehicleModelId === selectedVehicleModelId,
      ) ?? null,
    [allVehicleMappings, selectedVehicleModelId],
  );

  const hasVerifiedVehicleMappings =
    allVehicleMappings.length > 0;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matchingProducts = products.filter((product) => {
      const compatibility =
        product.vehicleCompatibility ?? [];

      const searchableText = [
        product.brand,
        product.name,
        product.model,
        product.description,
        product.warranty,
        ...compatibility.flatMap((vehicle) => [
          vehicle.make,
          vehicle.model,
          vehicle.fuelType,
          vehicle.variant,
          vehicle.yearFrom?.toString() ?? "",
          vehicle.yearTo?.toString() ?? "",
          vehicle.notes,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query === "" || searchableText.includes(query);

      const matchesCapacity =
        capacity === "all" ||
        product.capacityAh === Number(capacity);

      const matchesWarranty =
        warranty === "all" ||
        product.warranty === warranty;

      const matchesStatus =
        status === "all" || product.status === status;

      const matchesSelectedVehicle =
        !selectedVehicleModelId ||
        compatibility.some(
          (vehicle) =>
            vehicle.vehicleModelId ===
            selectedVehicleModelId,
        );

      return (
        matchesSearch &&
        matchesCapacity &&
        matchesWarranty &&
        matchesStatus &&
        matchesSelectedVehicle
      );
    });

    if (!selectedVehicleModelId) {
      return matchingProducts;
    }

    return [...matchingProducts].sort(
      (firstProduct, secondProduct) => {
        const firstRecommended =
          firstProduct.vehicleCompatibility?.some(
            (vehicle) =>
              vehicle.vehicleModelId ===
                selectedVehicleModelId &&
              vehicle.recommended,
          ) ?? false;

        const secondRecommended =
          secondProduct.vehicleCompatibility?.some(
            (vehicle) =>
              vehicle.vehicleModelId ===
                selectedVehicleModelId &&
              vehicle.recommended,
          ) ?? false;

        if (firstRecommended === secondRecommended) {
          return 0;
        }

        return firstRecommended ? -1 : 1;
      },
    );
  }, [
    products,
    search,
    capacity,
    warranty,
    status,
    selectedVehicleModelId,
  ]);

  const displayedProducts = filteredProducts.slice(
    0,
    visibleCount,
  );

  const hasMoreProducts =
    displayedProducts.length < filteredProducts.length;

  const resetVisibleCount = () => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const updateMake = (value: string) => {
    setSelectedMake(value);
    setSelectedVehicleModelId("");
    resetVisibleCount();
  };

  const updateVehicleModel = (value: string) => {
    setSelectedVehicleModelId(value);
    resetVisibleCount();
  };

  const clearFilters = () => {
    setSearch("");
    setCapacity("all");
    setWarranty("all");
    setStatus("all");
    setSelectedMake("");
    setSelectedVehicleModelId("");
    resetVisibleCount();
  };

  const loadMore = () => {
    setVisibleCount((currentCount) =>
      Math.min(
        currentCount + PRODUCTS_PER_PAGE,
        filteredProducts.length,
      ),
    );
  };

  return (
    <>
      <section className="mt-12 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Battery finder
        </p>

        <h2 className="mt-3 text-2xl font-extrabold text-slate-950 md:text-3xl">
          Find the right {categoryTitle.toLowerCase()}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {finderType === "vehicle"
            ? "Choose your vehicle manufacturer and exact model to see compatible batteries. Only combinations confirmed in the admin panel are recommended."
            : "Search by battery model, capacity, warranty or application."}
        </p>

        {finderType === "vehicle" &&
          hasVerifiedVehicleMappings && (
            <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CarFront size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-950">
                    Search by vehicle
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    First select the manufacturer, then select the
                    exact vehicle model.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Vehicle manufacturer
                  </span>

                  <select
                    value={selectedMake}
                    onChange={(event) =>
                      updateMake(event.target.value)
                    }
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">
                      Select manufacturer
                    </option>

                    {vehicleMakes.map((make) => (
                      <option key={make.name} value={make.name}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Vehicle model
                  </span>

                  <select
                    value={selectedVehicleModelId}
                    disabled={!selectedMake}
                    onChange={(event) =>
                      updateVehicleModel(event.target.value)
                    }
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">
                      {selectedMake
                        ? "Select exact model"
                        : "Select manufacturer first"}
                    </option>

                    {vehicleModels.map((vehicle) => (
                      <option
                        key={vehicle.vehicleModelId}
                        value={vehicle.vehicleModelId}
                      >
                        {vehicleModelLabel(vehicle)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedVehicle && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />

                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Showing exact matches for{" "}
                      {selectedVehicle.make}{" "}
                      {selectedVehicle.model}
                    </p>

                    {(selectedVehicle.variant ||
                      selectedVehicle.fuelType) && (
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {[
                          selectedVehicle.variant,
                          selectedVehicle.fuelType,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {finderType === "vehicle" &&
          !hasVerifiedVehicleMappings && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-medium leading-6 text-amber-900">
                Vehicle compatibility has not yet been added for
                this category. Search by battery details below or
                contact Bhumi Enterprise so the correct battery can
                be confirmed.
              </p>
            </div>
          )}

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">
              Search the battery catalogue
            </span>

            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetVisibleCount();
              }}
              placeholder="Search battery or model..."
              className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <select
            value={capacity}
            onChange={(event) => {
              setCapacity(event.target.value);
              resetVisibleCount();
            }}
            aria-label="Filter by capacity"
            className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All capacities</option>

            {capacities.map((item) => (
              <option key={item} value={item}>
                {item} Ah
              </option>
            ))}
          </select>

          <select
            value={warranty}
            onChange={(event) => {
              setWarranty(event.target.value);
              resetVisibleCount();
            }}
            aria-label="Filter by warranty"
            className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All warranties</option>

            {warranties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              resetVisibleCount();
            }}
            aria-label="Filter by product status"
            className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All statuses</option>

            {statuses.map((item) => (
              <option key={item} value={item}>
                {statusDetails[item].label || "Available"}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-600 hover:text-emerald-700 hover:shadow-md"
          >
            <RefreshCw size={17} />
            Reset
          </button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Product catalogue
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Battery options
            </h2>
          </div>

          <p
            aria-live="polite"
            className="text-sm font-semibold text-slate-600"
          >
            {filteredProducts.length} matching product
            {filteredProducts.length === 1 ? "" : "s"}
          </p>
        </div>

        {finderType === "vehicle" &&
        selectedMake &&
        !selectedVehicleModelId ? (
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/60 p-10 text-center">
            <CarFront
              className="mx-auto text-emerald-600"
              size={42}
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Now select the exact vehicle model
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              The model list contains only vehicles currently
              connected to confirmed battery records.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Battery
              className="mx-auto text-slate-400"
              size={40}
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No matching battery found
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Reset the filters or contact Bhumi Enterprise for
              assistance.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Contact us
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.map((product, index) => {
                const isRecommended =
                  selectedVehicleModelId !== "" &&
                  (product.vehicleCompatibility?.some(
                    (vehicle) =>
                      vehicle.vehicleModelId ===
                        selectedVehicleModelId &&
                      vehicle.recommended,
                  ) ??
                    false);

                return (
                  <div
                    key={product.id}
                    className="animate-[batteryCardEnter_450ms_ease-out_both]"
                    style={{
                      animationDelay: `${
                        (index % PRODUCTS_PER_PAGE) * 45
                      }ms`,
                    }}
                  >
                    <ProductCard
                      product={product}
                      isRecommended={isRecommended}
                      selectedVehicle={selectedVehicle}
                    />
                  </div>
                );
              })}
            </div>

            {hasMoreProducts && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border-2 border-emerald-600 bg-white px-7 py-3.5 font-bold text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:text-white hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  More Batteries

                  <ArrowDown
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function ProductCard({
  product,
  isRecommended,
  selectedVehicle,
}: {
  product: CatalogueProduct;
  isRecommended: boolean;
  selectedVehicle: VehicleCompatibility | null;
}) {
  const details = statusDetails[product.status];

  const vehicleText = selectedVehicle
    ? ` for my ${selectedVehicle.make} ${selectedVehicle.model}`
    : "";

  const enquiryMessage = encodeURIComponent(
    `Hello Bhumi Enterprise, I am interested in the ${product.name} (${product.model})${vehicleText}. Please share more information.`,
  );

  const enquiryUrl = `/contact?product=${encodeURIComponent(
    product.model,
  )}&message=${enquiryMessage}`;

  const showStatusBadge =
    details.label.trim() !== "" &&
    product.status !== "coming-soon";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
        isRecommended
          ? "border-emerald-500 ring-2 ring-emerald-100"
          : "border-slate-200 hover:border-emerald-500"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-4 z-30 translate-y-[-150%] rounded-xl bg-slate-950/95 px-4 py-3 text-center text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        Exchange your old battery for a potentially lower final
        price—contact us for valuation.
      </div>

      {isRecommended && (
        <span className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
          <ShieldCheck size={14} />
          Recommended match
        </span>
      )}

      {showStatusBadge && (
        <span
          className={`absolute right-5 top-5 z-20 rounded-full px-3 py-1.5 text-xs font-bold ${details.badge}`}
        >
          {details.label}
        </span>
      )}

      <div className="relative h-60 bg-slate-50">
        {product.image.trim() !== "" && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-contain p-7"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          {product.brand}
        </p>

        <h3 className="mt-3 text-xl font-bold text-slate-950">
          {product.name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        {selectedVehicle && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Compatible with
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {selectedVehicle.make} {selectedVehicle.model}
            </p>

            {(selectedVehicle.variant ||
              selectedVehicle.fuelType) && (
              <p className="mt-1 text-xs text-slate-600">
                {[
                  selectedVehicle.variant,
                  selectedVehicle.fuelType,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            )}
          </div>
        )}

        <ul className="mt-5 space-y-3 text-sm text-slate-600">
          {product.capacityAh > 0 && (
            <li className="flex gap-2">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              Capacity: {product.capacityAh} Ah
            </li>
          )}

          {product.voltage > 0 && (
            <li className="flex gap-2">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              Voltage: {product.voltage} V
            </li>
          )}

          {product.warranty && (
            <li className="flex gap-2">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              {product.warranty}
            </li>
          )}

          <li className="flex gap-2">
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            Free installation and battery checkup
          </li>
        </ul>

        <div className="mt-auto pt-6">
          {product.mrp > 0 && product.price > 0 ? (
            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-400 line-through">
                MRP {formatPrice(product.mrp)}
              </p>

              <p className="mt-1 text-2xl font-extrabold text-slate-950">
                {formatPrice(product.price)}
              </p>

              {product.priceCheckedOn && (
                <p className="mt-1 text-xs text-slate-500">
                  Price checked {product.priceCheckedOn}
                </p>
              )}
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-6">
              <p className="font-semibold text-slate-700">
                Contact for confirmed price
              </p>
            </div>
          )}

          <Link
            href={enquiryUrl}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            {details.button}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}