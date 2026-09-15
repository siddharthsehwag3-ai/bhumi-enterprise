"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";

type BatteryImageFieldProps = {
  defaultValue?: string;
};

export default function BatteryImageField({
  defaultValue = "",
}: BatteryImageFieldProps) {
  const [imagePath, setImagePath] = useState(defaultValue);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        "/api/admin/battery-images",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error || "Unable to upload image.",
        );
      }

      setImagePath(result.url);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const previewAllowed =
    imagePath.startsWith("/") ||
    imagePath.startsWith("https://");

  return (
    <div>
      <input
        type="hidden"
        name="imagePath"
        value={imagePath}
      />

      <label className="text-sm font-bold text-slate-700">
        Image URL or existing public path
        <input
          value={imagePath}
          onChange={(event) => {
            setImagePath(event.target.value);
            setMessage("");
          }}
          placeholder="/products/tata/car/example.png"
          className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
          {uploading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <ImagePlus size={17} />
          )}

          {uploading ? "Uploading..." : "Upload image"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {imagePath && (
          <button
            type="button"
            onClick={() => {
              setImagePath("");
              setMessage("Image removed from this product.");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100"
          >
            <Trash2 size={16} />
            Remove image
          </button>
        )}
      </div>

      {previewAllowed && (
        <div className="relative mt-4 h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src={imagePath}
            alt="Battery preview"
            fill
            sizes="320px"
            className="object-contain p-4"
          />
        </div>
      )}

      {message && (
        <p
          className={`mt-3 text-sm font-semibold ${
            message.includes("successfully")
              ? "text-emerald-700"
              : message.includes("Uploading")
                ? "text-slate-600"
                : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-2 text-xs leading-5 text-slate-500">
        JPG, PNG or WebP, maximum 4 MB. Leave blank when no image is
        available.
      </p>
    </div>
  );
}