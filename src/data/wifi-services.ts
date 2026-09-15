export type WifiQuestion = {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: "text" | "textarea" | "select";
  options?: string[];
};

export type WifiService = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  questions: WifiQuestion[];
};

export const wifiServiceCategories: WifiService[] = [
  {
    slug: "installation",
    title: "WiFi Installation",
    shortTitle: "Installation",
    description:
      "Request a new Airtel WiFi installation for your home, shop, office or other property.",
    questions: [
      {
        id: "propertyType",
        label: "Property type",
        placeholder: "Select property type",
        required: true,
        type: "select",
        options: [
          "Home",
          "Flat",
          "Shop",
          "Office",
          "Warehouse",
          "Other",
        ],
      },
      {
        id: "connectionPurpose",
        label: "Primary internet use",
        placeholder: "Select the main use",
        required: true,
        type: "select",
        options: [
          "General browsing",
          "Office or work from home",
          "Online classes",
          "Video streaming",
          "Online gaming",
          "CCTV cameras",
          "Shop or business use",
          "Multiple purposes",
          "Other",
        ],
      },
      {
        id: "numberOfUsers",
        label: "Approximate number of users or devices",
        placeholder: "For example: 5 users and 8 devices",
        required: true,
        type: "text",
      },
      {
        id: "preferredSpeed",
        label: "Preferred internet speed",
        placeholder: "Select a speed or request a recommendation",
        required: false,
        type: "select",
        options: [
          "Let Bhumi Enterprise recommend the speed",
          "Up to 40 Mbps",
          "Up to 100 Mbps",
          "Up to 200 Mbps",
          "Up to 300 Mbps",
          "More than 300 Mbps",
          "Not sure",
        ],
      },
      {
        id: "numberOfFloors",
        label: "Number of floors requiring WiFi",
        placeholder: "For example: one floor or ground and first floor",
        required: false,
        type: "text",
      },
      {
        id: "existingConnection",
        label: "Do you already have an internet connection?",
        placeholder: "Select an option",
        required: false,
        type: "select",
        options: [
          "No, this is a new connection",
          "Yes, Airtel",
          "Yes, another provider",
          "Not sure",
        ],
      },
      {
        id: "installationDetails",
        label: "Additional installation details",
        placeholder:
          "Tell us where you need the router and any other requirements",
        required: false,
        type: "textarea",
      },
    ],
  },
  {
    slug: "router-configuration",
    title: "Router Configuration",
    shortTitle: "Configuration",
    description:
      "Request assistance configuring an Airtel-compatible router and connected devices.",
    questions: [
      {
        id: "routerBrand",
        label: "Router brand and model",
        placeholder: "Enter the router brand and model, if known",
        required: false,
        type: "text",
      },
      {
        id: "configurationRequired",
        label: "Configuration required",
        placeholder: "Select the required configuration",
        required: true,
        type: "select",
        options: [
          "New router setup",
          "WiFi name or password change",
          "Device connection",
          "Parental controls",
          "Guest network",
          "Router reset",
          "Other",
        ],
      },
      {
        id: "connectionStatus",
        label: "Is the internet currently working?",
        placeholder: "Select an option",
        required: false,
        type: "select",
        options: [
          "Yes",
          "No",
          "Works occasionally",
          "Not sure",
        ],
      },
      {
        id: "connectedDevices",
        label: "Devices that need to be connected",
        placeholder:
          "For example: phones, laptops, smart TV, CCTV or printer",
        required: false,
        type: "textarea",
      },
      {
        id: "configurationNotes",
        label: "Additional configuration details",
        placeholder:
          "Describe any other router or device requirement",
        required: false,
        type: "textarea",
      },
    ],
  },
  {
    slug: "repair",
    title: "WiFi Repair",
    shortTitle: "Repair",
    description:
      "Request troubleshooting for an existing Airtel WiFi connection or router problem.",
    questions: [
      {
        id: "problemType",
        label: "What problem are you experiencing?",
        placeholder: "Select the closest problem",
        required: true,
        type: "select",
        options: [
          "No internet connection",
          "Slow internet",
          "Router not turning on",
          "Frequent disconnection",
          "Red light on router",
          "Device cannot connect",
          "Cable or wiring problem",
          "Other",
        ],
      },
      {
        id: "problemStarted",
        label: "When did the problem begin?",
        placeholder: "For example: today morning or three days ago",
        required: true,
        type: "text",
      },
      {
        id: "currentPlanSpeed",
        label: "Current internet-plan speed",
        placeholder: "Select the speed if known",
        required: false,
        type: "select",
        options: [
          "I do not know",
          "Up to 40 Mbps",
          "Up to 100 Mbps",
          "Up to 200 Mbps",
          "Up to 300 Mbps",
          "More than 300 Mbps",
        ],
      },
      {
        id: "affectedDevices",
        label: "Which devices are affected?",
        placeholder:
          "For example: all devices, one phone, laptop or smart TV",
        required: false,
        type: "text",
      },
      {
        id: "routerLightStatus",
        label: "Router-light status",
        placeholder: "Select the closest option",
        required: false,
        type: "select",
        options: [
          "All normal lights",
          "Red light",
          "No lights",
          "Lights blinking continuously",
          "I do not know",
        ],
      },
      {
        id: "troubleshootingTried",
        label: "What have you already tried?",
        placeholder:
          "For example: restarted router, checked wires or contacted Airtel",
        required: false,
        type: "textarea",
      },
    ],
  },
  {
    slug: "coverage-assistance",
    title: "Coverage Assistance",
    shortTitle: "Coverage",
    description:
      "Request help improving weak WiFi coverage across your property.",
    questions: [
      {
        id: "propertyType",
        label: "Property type",
        placeholder: "Select property type",
        required: true,
        type: "select",
        options: [
          "Home",
          "Flat",
          "Shop",
          "Office",
          "Warehouse",
          "Other",
        ],
      },
      {
        id: "propertySize",
        label: "Approximate property size",
        placeholder:
          "For example: 2 BHK, two floors or 1,500 sq. ft.",
        required: true,
        type: "text",
      },
      {
        id: "numberOfFloors",
        label: "Number of floors",
        placeholder: "For example: two floors",
        required: false,
        type: "text",
      },
      {
        id: "weakAreas",
        label: "Where is the signal weak?",
        placeholder:
          "For example: first-floor bedroom, back office or terrace",
        required: true,
        type: "textarea",
      },
      {
        id: "currentPlanSpeed",
        label: "Current internet-plan speed",
        placeholder: "Select the speed if known",
        required: false,
        type: "select",
        options: [
          "I do not know",
          "Up to 40 Mbps",
          "Up to 100 Mbps",
          "Up to 200 Mbps",
          "Up to 300 Mbps",
          "More than 300 Mbps",
        ],
      },
      {
        id: "routerLocation",
        label: "Current router location",
        placeholder:
          "For example: drawing room, ground floor or front office",
        required: false,
        type: "text",
      },
      {
        id: "currentEquipment",
        label: "Current router or extender details",
        placeholder:
          "Enter the router or extender brand and model, if known",
        required: false,
        type: "text",
      },
      {
        id: "coverageGoal",
        label: "Where do you want stronger coverage?",
        placeholder:
          "Describe all rooms, floors or areas that need better WiFi",
        required: false,
        type: "textarea",
      },
    ],
  },
  {
    slug: "maintenance",
    title: "Maintenance Support",
    shortTitle: "Maintenance",
    description:
      "Request routine assistance for an existing Airtel WiFi connection and equipment.",
    questions: [
      {
        id: "maintenanceRequired",
        label: "Maintenance required",
        placeholder: "Select maintenance type",
        required: true,
        type: "select",
        options: [
          "Connection health check",
          "Router inspection",
          "Cable inspection",
          "Speed check",
          "Device reconnection",
          "General maintenance",
          "Other",
        ],
      },
      {
        id: "currentCondition",
        label: "Current connection condition",
        placeholder: "Select the closest option",
        required: false,
        type: "select",
        options: [
          "Working normally",
          "Sometimes slow",
          "Frequently disconnects",
          "Not working",
          "Not sure",
        ],
      },
      {
        id: "equipmentDetails",
        label: "Router and equipment details",
        placeholder:
          "Enter available equipment information, if known",
        required: false,
        type: "text",
      },
      {
        id: "lastService",
        label: "When was the connection last inspected?",
        placeholder: "For example: six months ago or never",
        required: false,
        type: "text",
      },
      {
        id: "maintenanceNotes",
        label: "Additional details",
        placeholder:
          "Describe anything the technician should know",
        required: false,
        type: "textarea",
      },
    ],
  },
];

export function getWifiService(slug: string) {
  return wifiServiceCategories.find(
    (service) => service.slug === slug,
  );
}