export type BatteryCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  finderType: "vehicle" | "application";
};

export type ProductStatus =
  | "available"
  | "coming-soon"
  | "out-of-stock"
  | "draft"
  | "hidden"
  | "discontinued";

export type BatteryProduct = {
  id: string;
  brand: "Tata Green" | "Geon" | "Amaron";
  category: string;
  name: string;
  model: string;
  description: string;
  image: string;
  capacityAh: number;
  voltage: number;
  warranty: string;
  mrp: number;
  price: number;
  priceCheckedOn: string;
  compatibility: string[];
  published: boolean;
  status: ProductStatus;
};

export const batteryCategories: BatteryCategory[] = [
  {
    slug: "two-wheeler",
    title: "Two-Wheeler Batteries",
    shortTitle: "Two-Wheeler",
    description: "Batteries for motorcycles, scooters and other two-wheelers.",
    finderType: "vehicle",
  },
  {
    slug: "car-muv-suv",
    title: "Car / MUV / SUV Batteries",
    shortTitle: "Car / MUV / SUV",
    description: "Batteries for hatchbacks, sedans, MUVs and SUVs.",
    finderType: "vehicle",
  },
  {
    slug: "tractor",
    title: "Tractor Batteries",
    shortTitle: "Tractor",
    description: "Batteries for tractors and agricultural applications.",
    finderType: "vehicle",
  },
  {
    slug: "commercial-vehicle",
    title: "Commercial Vehicle Batteries",
    shortTitle: "Commercial Vehicle",
    description: "Batteries for trucks, buses and commercial vehicles.",
    finderType: "vehicle",
  },
  {
    slug: "e-rickshaw",
    title: "E-Rickshaw Batteries",
    shortTitle: "E-Rickshaw",
    description: "Battery solutions for electric rickshaws.",
    finderType: "vehicle",
  },
  {
    slug: "inverter",
    title: "Inverter Batteries",
    shortTitle: "Inverter",
    description: "Tubular batteries for home and business power backup.",
    finderType: "application",
  },
  {
    slug: "genset",
    title: "Genset Batteries",
    shortTitle: "Genset",
    description: "Starting-power batteries for generators and gensets.",
    finderType: "application",
  },
  {
    slug: "industrial",
    title: "Industrial Batteries",
    shortTitle: "Industrial",
    description: "Battery solutions for industrial applications.",
    finderType: "application",
  },
  {
    slug: "inverter-ups",
    title: "Inverter / UPS Systems",
    shortTitle: "Inverter / UPS",
    description: "Power-backup systems for homes and businesses.",
    finderType: "application",
  },
];

type ProductSeed = {
  category: string;
  model: string;
  image: string;
  capacityAh: number;
  warranty: string;
  mrp: number;
  price: number;
};

const W2430 = "24 months free replacement + 30 months pro-rata";
const W1818 = "18 months free replacement + 18 months pro-rata";
const W1212 = "12 months free replacement + 12 months pro-rata";
const W2424 = "24 months free replacement + 24 months pro-rata";
const W2436 = "24 months free replacement + 36 months pro-rata";
const W3036 = "30 months free replacement + 36 months pro-rata";
const W3636 = "36 months free replacement + 36 months pro-rata";
const W4836 = "48 months free replacement + 36 months pro-rata";

const productSeeds: ProductSeed[] = [
  // TWO-WHEELER
  { category: "two-wheeler", model: "TGZ4 ADV", image: "/products/tata/two-wheeler/tgz4-adv.webp", capacityAh: 3, warranty: W2430, mrp: 1313, price: 1182 },
  { category: "two-wheeler", model: "TGZ4A", image: "/products/tata/two-wheeler/tgz4a.webp", capacityAh: 4, warranty: W2430, mrp: 1351, price: 1216 },
  { category: "two-wheeler", model: "YTZ7-TVS", image: "", capacityAh: 6, warranty: W2430, mrp: 2096, price: 1887 },
  { category: "two-wheeler", model: "YTZ5-TVS", image: "", capacityAh: 4, warranty: W2430, mrp: 1581, price: 1423 },
  { category: "two-wheeler", model: "YT5A-TVS", image: "/products/tata/two-wheeler/yt5a-tvs.webp", capacityAh: 5, warranty: W2430, mrp: 1704, price: 1534 },
  { category: "two-wheeler", model: "YTZ4-TVS", image: "/products/tata/two-wheeler/ytz4-tvs.webp", capacityAh: 3, warranty: W2430, mrp: 1339, price: 1205 },
  { category: "two-wheeler", model: "GYZ20L", image: "/products/tata/two-wheeler/gyz20l.png", capacityAh: 20, warranty: W1212, mrp: 18664, price: 16798 },
  { category: "two-wheeler", model: "YTZ7-H", image: "/products/tata/two-wheeler/ytz7-h.webp", capacityAh: 6, warranty: W2430, mrp: 2102, price: 1892 },
  { category: "two-wheeler", model: "YTZ14S", image: "/products/tata/two-wheeler/ytz14s.png", capacityAh: 12.1, warranty: W1212, mrp: 7898, price: 7108 },
  { category: "two-wheeler", model: "YTZ7", image: "/products/tata/two-wheeler/ytz7.png", capacityAh: 6, warranty: W2430, mrp: 2055, price: 1850 },
  { category: "two-wheeler", model: "TG7D", image: "/products/tata/two-wheeler/tg7d.png", capacityAh: 7, warranty: W2430, mrp: 1837, price: 1654 },
  { category: "two-wheeler", model: "YTZ5", image: "/products/tata/two-wheeler/ytz5.png", capacityAh: 4, warranty: W2430, mrp: 1550, price: 1395 },
  { category: "two-wheeler", model: "TGZ9", image: "/products/tata/two-wheeler/tgz9.png", capacityAh: 8, warranty: W2430, mrp: 2459, price: 2214 },
  { category: "two-wheeler", model: "TG2.5D", image: "/products/tata/two-wheeler/tg2-5d.png", capacityAh: 2.5, warranty: W2430, mrp: 1164, price: 1048 },
  { category: "two-wheeler", model: "YTZ4", image: "/products/tata/two-wheeler/ytz4.png", capacityAh: 3, warranty: W2430, mrp: 1313, price: 1182 },
  { category: "two-wheeler", model: "YTZ4-H", image: "/products/tata/two-wheeler/ytz4-h.png", capacityAh: 3, warranty: W2430, mrp: 1330, price: 1197 },
  { category: "two-wheeler", model: "YTZ6V-H", image: "/products/tata/two-wheeler/ytz6v-h.png", capacityAh: 5, warranty: W2430, mrp: 1670, price: 1503 },
  { category: "two-wheeler", model: "TG9D", image: "/products/tata/two-wheeler/tg9d.png", capacityAh: 9, warranty: W2430, mrp: 2462, price: 2216 },
  { category: "two-wheeler", model: "YT5A", image: "/products/tata/two-wheeler/yt5a.webp", capacityAh: 5, warranty: W2430, mrp: 1670, price: 1503 },
  { category: "two-wheeler", model: "YB14L-A2", image: "/products/tata/two-wheeler/yb14l-a2.png", capacityAh: 14, warranty: W1818, mrp: 3727, price: 3355 },

  // CAR / MUV / SUV
  { category: "car-muv-suv", model: "TG550R", image: "/products/tata/car/tg550r.jpg", capacityAh: 54, warranty: W1212, mrp: 5568, price: 5011 },
  { category: "car-muv-suv", model: "TGX 400L", image: "/products/tata/car/tgx-400l.jpg", capacityAh: 35, warranty: W1818, mrp: 4271, price: 3759 },
  { category: "car-muv-suv", model: "SLV600R", image: "/products/tata/car/slv600r.jpg", capacityAh: 55, warranty: W2424, mrp: 6459, price: 5942 },
  { category: "car-muv-suv", model: "SLV DIN60L", image: "/products/tata/car/slv-din60l.jpg", capacityAh: 60, warranty: W1818, mrp: 7629, price: 6866 },
  { category: "car-muv-suv", model: "TG400L", image: "/products/tata/car/tg400l.png", capacityAh: 35, warranty: W1212, mrp: 4169, price: 3835 },
  { category: "car-muv-suv", model: "SLV DIN65L", image: "/products/tata/car/slv-din65l.jpg", capacityAh: 65, warranty: W1818, mrp: 8288, price: 7459 },
  { category: "car-muv-suv", model: "SLV DIN50R", image: "/products/tata/car/slv-din50r.jpg", capacityAh: 50, warranty: W1818, mrp: 6512, price: 5861 },
  { category: "car-muv-suv", model: "SLV DIN50L", image: "", capacityAh: 50, warranty: W1818, mrp: 6512, price: 5861 },
  { category: "car-muv-suv", model: "SLV DIN44L", image: "", capacityAh: 44, warranty: W1818, mrp: 6052, price: 5447 },
  { category: "car-muv-suv", model: "SLV DIN44R", image: "/products/tata/car/slv-din44r.webp", capacityAh: 44, warranty: W1818, mrp: 6052, price: 5447 },
  { category: "car-muv-suv", model: "PREMIO 70D23R-BH", image: "", capacityAh: 68, warranty: W2436, mrp: 7610, price: 6697 },
  { category: "car-muv-suv", model: "PREMIO 55D23L", image: "", capacityAh: 54, warranty: W2436, mrp: 6503, price: 5723 },
  { category: "car-muv-suv", model: "PREMIO 55B24L (T1)", image: "", capacityAh: 45, warranty: W3036, mrp: 7231, price: 6146 },
  { category: "car-muv-suv", model: "PREMIO M-42 ISS", image: "/products/tata/car/premio-m42-iss.jpg", capacityAh: 38, warranty: W2436, mrp: 5068, price: 4460 },
  { category: "car-muv-suv", model: "PREMIO 70D23L-BH", image: "", capacityAh: 68, warranty: W2436, mrp: 7610, price: 6697 },
  { category: "car-muv-suv", model: "PREMIO 40B20L PR3036", image: "/products/tata/car/premio-40b20l-pr3036.jpg", capacityAh: 35, warranty: W3036, mrp: 5048, price: 4442 },
  { category: "car-muv-suv", model: "PREMIO 40B20R PR3036", image: "/products/tata/car/premio-40b20r-pr3036.png", capacityAh: 35, warranty: W3036, mrp: 5048, price: 4442 },
  { category: "car-muv-suv", model: "PREMIO 40B20R PR2436", image: "/products/tata/car/premio-40b20r-pr2436.jpg", capacityAh: 35, warranty: W2436, mrp: 4822, price: 4099 },
  { category: "car-muv-suv", model: "PREMIO 40B20L PR2436", image: "", capacityAh: 35, warranty: W2436, mrp: 4822, price: 4099 },
  { category: "car-muv-suv", model: "TG550L", image: "", capacityAh: 54, warranty: W1212, mrp: 5568, price: 5011 },
  { category: "car-muv-suv", model: "PREMIO 70D26R PR3036", image: "", capacityAh: 70, warranty: W3036, mrp: 9153, price: 7780 },
  { category: "car-muv-suv", model: "PREMIO 70D26L PR3036", image: "", capacityAh: 70, warranty: W3036, mrp: 9153, price: 7780 },
  { category: "car-muv-suv", model: "PREMIO 40B20L BH", image: "", capacityAh: 35, warranty: W3036, mrp: 5721, price: 4863 },
  { category: "car-muv-suv", model: "PREMIO 40B20R BH", image: "/products/tata/car/premio-40b20r-bh.png", capacityAh: 35, warranty: W3036, mrp: 5721, price: 4863 },
  { category: "car-muv-suv", model: "PREMIO 55B24LS", image: "/products/tata/car/premio-55b24ls.png", capacityAh: 45, warranty: W3036, mrp: 8553, price: 7270 },
  { category: "car-muv-suv", model: "PREMIO 70D26R PR2436", image: "/products/tata/car/premio-70d26r-pr2436.png", capacityAh: 65, warranty: W2436, mrp: 8344, price: 7343 },
  { category: "car-muv-suv", model: "PREMIO 80D31L", image: "/products/tata/car/premio-80d31l.png", capacityAh: 80, warranty: W2436, mrp: 9104, price: 8011 },
  { category: "car-muv-suv", model: "PREMIO 36B19L-AM", image: "/products/tata/car/premio-36b19l-am.png", capacityAh: 32, warranty: W2436, mrp: 4562, price: 3878 },
  { category: "car-muv-suv", model: "PREMIO 80D31R", image: "/products/tata/car/premio-80d31r.png", capacityAh: 80, warranty: W2436, mrp: 9104, price: 8011 },
  { category: "car-muv-suv", model: "PREMIO 34B19L-M", image: "/products/tata/car/premio-34b19l-m.png", capacityAh: 32, warranty: W2436, mrp: 4733, price: 4165 },
  { category: "car-muv-suv", model: "PREMIO 34B20L-M", image: "/products/tata/car/premio-34b20l-m.png", capacityAh: 32, warranty: W2436, mrp: 4818, price: 4240 },
  { category: "car-muv-suv", model: "PREMIO DIN50L", image: "/products/tata/car/premio-din50l.png", capacityAh: 50, warranty: W2436, mrp: 7702, price: 6778 },
  { category: "car-muv-suv", model: "PREMIO DIN44L", image: "/products/tata/car/premio-din44l.png", capacityAh: 44, warranty: W2436, mrp: 6961, price: 6126 },
  { category: "car-muv-suv", model: "PREMIO DIN44R", image: "", capacityAh: 44, warranty: W2436, mrp: 6961, price: 6126 },
  { category: "car-muv-suv", model: "PREMIO DIN65L", image: "", capacityAh: 65, warranty: W2436, mrp: 9040, price: 7955 },
  { category: "car-muv-suv", model: "PREMIO 70D26L PR2436", image: "", capacityAh: 65, warranty: W2436, mrp: 8344, price: 7343 },
  { category: "car-muv-suv", model: "PREMIO DIN60L", image: "", capacityAh: 60, warranty: W2436, mrp: 8818, price: 7760 },

  // TRACTOR
  { category: "tractor", model: "SLV 1000L", image: "/products/tata/tractor/slv-1000l.jpg", capacityAh: 90, warranty: W2424, mrp: 9922, price: 8930 },
  { category: "tractor", model: "SLV 800L", image: "", capacityAh: 75, warranty: W2424, mrp: 8155, price: 7340 },
  { category: "tractor", model: "SLV 900R", image: "", capacityAh: 80, warranty: W2424, mrp: 8979, price: 8081 },
  { category: "tractor", model: "SLV 1000R", image: "", capacityAh: 90, warranty: W2424, mrp: 9922, price: 8930 },
  { category: "tractor", model: "Jeevan 75D31RT", image: "/products/tata/tractor/jeevan-75d31rt.jpg", capacityAh: 75, warranty: W2424, mrp: 8834, price: 7950 },
  { category: "tractor", model: "Jeevan 95E41LT", image: "/products/tata/tractor/jeevan-95e41lt.png", capacityAh: 90, warranty: W2424, mrp: 9943, price: 8949 },
  { category: "tractor", model: "Jeevan 95E41RT", image: "/products/tata/tractor/jeevan-95e41rt.jpg", capacityAh: 90, warranty: W2424, mrp: 9943, price: 8949 },
  { category: "tractor", model: "TG700R", image: "/products/tata/tractor/tg700r.png", capacityAh: 65, warranty: W1212, mrp: 6717, price: 6045 },
  { category: "tractor", model: "TG350L", image: "/products/tata/tractor/tg350l.png", capacityAh: 32, warranty: W1212, mrp: 3809, price: 3428 },
  { category: "tractor", model: "TG350R", image: "/products/tata/tractor/tg350r.png", capacityAh: 32, warranty: W1212, mrp: 3809, price: 3428 },
  { category: "tractor", model: "TG800R", image: "/products/tata/tractor/tg800r.png", capacityAh: 80, warranty: W1212, mrp: 7962, price: 7166 },
  { category: "tractor", model: "TG700L", image: "/products/tata/tractor/tg700l.png", capacityAh: 65, warranty: W1212, mrp: 6717, price: 6045 },

  // COMMERCIAL VEHICLE
  { category: "commercial-vehicle", model: "TG550R", image: "/products/tata/commercial/tg550r.jpg", capacityAh: 54, warranty: W1212, mrp: 5568, price: 5011 },
  { category: "commercial-vehicle", model: "TGX 400L", image: "", capacityAh: 35, warranty: W1818, mrp: 4271, price: 3759 },
  { category: "commercial-vehicle", model: "SLV 1000L", image: "", capacityAh: 90, warranty: W2424, mrp: 9922, price: 8930 },
  { category: "commercial-vehicle", model: "ROADSTAR 105E41R PR1818", image: "/products/tata/commercial/roadstar-105e41r-pr1818.png", capacityAh: 100, warranty: W1818, mrp: 9759, price: 8588 },
  { category: "commercial-vehicle", model: "ROADSTAR 180H52", image: "/products/tata/commercial/roadstar-180h52.png", capacityAh: 180, warranty: W1818, mrp: 19913, price: 17524 },
  { category: "commercial-vehicle", model: "ROADSTAR 150G51 RS1818", image: "/products/tata/commercial/roadstar-150g51-rs1818.jpg", capacityAh: 150, warranty: W1818, mrp: 15029, price: 13226 },
  { category: "commercial-vehicle", model: "ROADSTAR 130F51", image: "/products/tata/commercial/roadstar-130f51.png", capacityAh: 130, warranty: W1818, mrp: 13687, price: 12045 },
  { category: "commercial-vehicle", model: "ROADSTAR 150G51 RS2424", image: "/products/tata/commercial/roadstar-150g51-rs2424.jpg", capacityAh: 150, warranty: W2424, mrp: 18227, price: 16040 },
  { category: "commercial-vehicle", model: "Jeevan 95E41RT", image: "", capacityAh: 90, warranty: W2424, mrp: 9943, price: 8949 },
  { category: "commercial-vehicle", model: "Jeevan 95E41LT", image: "", capacityAh: 90, warranty: W2424, mrp: 9943, price: 8949 },
  { category: "commercial-vehicle", model: "Jeevan 75D31RT", image: "", capacityAh: 75, warranty: W2424, mrp: 8834, price: 7950 },
  { category: "commercial-vehicle", model: "SLV 1000R", image: "/products/tata/commercial/slv-1000r.jpg", capacityAh: 90, warranty: W2424, mrp: 9922, price: 8930 },
  { category: "commercial-vehicle", model: "SLV 900R", image: "/products/tata/commercial/slv-900r.jpg", capacityAh: 80, warranty: W2424, mrp: 8979, price: 8081 },
  { category: "commercial-vehicle", model: "SLV 800L", image: "/products/tata/commercial/slv-800l.jpg", capacityAh: 75, warranty: W2424, mrp: 8155, price: 7340 },
  { category: "commercial-vehicle", model: "TG550L", image: "/products/tata/commercial/tg550l.png", capacityAh: 54, warranty: W1212, mrp: 5568, price: 5011 },
  { category: "commercial-vehicle", model: "ROADSTAR 105E41R RS2424", image: "/products/tata/commercial/roadstar-105e41r-rs2424.png", capacityAh: 100, warranty: W2424, mrp: 11676, price: 10275 },
  { category: "commercial-vehicle", model: "SLV 800R", image: "/products/tata/commercial/slv-800r.png", capacityAh: 75, warranty: W2424, mrp: 8155, price: 7340 },
  { category: "commercial-vehicle", model: "SLV600L", image: "/products/tata/commercial/slv600l.png", capacityAh: 55, warranty: W2424, mrp: 6458, price: 5942 },
  { category: "commercial-vehicle", model: "TG700R", image: "", capacityAh: 65, warranty: W1212, mrp: 6717, price: 6045 },
  { category: "commercial-vehicle", model: "TG350L", image: "", capacityAh: 32, warranty: W1212, mrp: 3809, price: 3428 },
  { category: "commercial-vehicle", model: "TG350R", image: "", capacityAh: 32, warranty: W1212, mrp: 3809, price: 3428 },
  { category: "commercial-vehicle", model: "TG700L", image: "", capacityAh: 65, warranty: W1212, mrp: 6717, price: 6045 },

  // E-RICKSHAW, INVERTER, GENSET, INDUSTRIAL AND UPS
  { category: "e-rickshaw", model: "ERLI10000 IoT", image: "/products/tata/e-rikshaw/sawaar-e-erli10000-iot.jpg", capacityAh: 135, warranty: W1212, mrp: 73954, price: 65080 },
  { category: "e-rickshaw", model: "ERLI10000", image: "/products/tata/e-rikshaw/sawaar-e-erli10000.jpg", capacityAh: 135, warranty: W1212, mrp: 68598, price: 60367 },
  { category: "inverter", model: "INTT180048", image: "/products/tata/inverter/intt180048.webp", capacityAh: 150, warranty: "48 months warranty", mrp: 17686, price: 15917 },
  { category: "inverter", model: "INTT180084", image: "/products/tata/inverter/intt180084.webp", capacityAh: 150, warranty: W4836, mrp: 22019, price: 18716 },
  { category: "inverter", model: "INTT260072", image: "/products/tata/inverter/intt260072.webp", capacityAh: 220, warranty: W3636, mrp: 26208, price: 22277 },
  { category: "inverter", model: "INTT280072", image: "/products/tata/inverter/intt280072.webp", capacityAh: 240, warranty: W3636, mrp: 27470, price: 23350 },
  { category: "inverter", model: "INTT280084", image: "/products/tata/inverter/intt280084.png", capacityAh: 240, warranty: W4836, mrp: 32968, price: 24047 },
  { category: "genset", model: "105E41R GENSTAR", image: "/products/tata/genset/105e41r-genstar.jpg", capacityAh: 100, warranty: "24 months free replacement + 12 months pro-rata", mrp: 10814, price: 9517 },
  { category: "industrial", model: "TGI 120AH 12V", image: "/products/tata/industrial/tgi-120ah-12v.jpg", capacityAh: 120, warranty: "Contact for warranty details", mrp: 0, price: 0 },
  { category: "inverter-ups", model: "TGUPS 48V 3.5KVA", image: "/products/tata/inverter-ups/tgups-48v-3-5kva.jpg", capacityAh: 0, warranty: "Contact for warranty details", mrp: 0, price: 0 },
  { category: "inverter-ups", model: "TGUPS 120V 10KVA", image: "/products/tata/inverter-ups/tgups-120v-10kva.jpg", capacityAh: 0, warranty: "Contact for warranty details", mrp: 0, price: 0 },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const categoryPurpose: Record<string, string> = {
  "two-wheeler": "motorcycles and scooters",
  "car-muv-suv": "cars, MUVs and SUVs",
  tractor: "tractors and agricultural vehicles",
  "commercial-vehicle": "trucks, buses and commercial vehicles",
  "e-rickshaw": "electric rickshaws",
  inverter: "home and business power backup",
  genset: "generator and genset starting",
  industrial: "industrial applications",
  "inverter-ups": "power-backup applications",
};

export const batteryProducts: BatteryProduct[] = productSeeds.map(
  (seed, index) => ({
    id: `tata-${seed.category}-${slugify(seed.model)}-${index + 1}`,
    brand: "Tata Green",
    category: seed.category,
    name: `${seed.model} ${
      seed.category === "inverter-ups" ? "Inverter / UPS System" : "Battery"
    }`,
    model: seed.model,
    description: `Designed for ${categoryPurpose[seed.category]}.`,
    image: seed.image,
    capacityAh: seed.capacityAh,
    voltage: 12,
    warranty: seed.warranty,
    mrp: seed.mrp,
    price: seed.price,
    priceCheckedOn: "2026-09-12",
    compatibility: [],
    published: true,
    status: "available",
  }),
);

export function getCategory(slug: string) {
  return batteryCategories.find((category) => category.slug === slug);
}

export function getProductsByCategory(category: string) {
  return batteryProducts.filter(
    (product) =>
      product.category === category &&
      product.published &&
      product.status !== "hidden" &&
      product.status !== "draft" &&
      product.status !== "discontinued",
  );
}