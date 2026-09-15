import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/session";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const maximumFileSize = 4 * 1024 * 1024;

function safeFileName(name: string) {
  const extension =
    name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)?.[0] ??
    ".webp";

  const baseName = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${baseName || "battery"}${extension}`;
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return Response.json(
        {
          error: "Administrator login required.",
        },
        {
          status: 401,
        },
      );
    }

    const formData = await request.formData();
    const uploadedValue = formData.get("image");

    if (!(uploadedValue instanceof File)) {
      return Response.json(
        {
          error: "Please choose an image.",
        },
        {
          status: 400,
        },
      );
    }

    if (!allowedTypes.has(uploadedValue.type)) {
      return Response.json(
        {
          error:
            "Only JPG, JPEG, PNG and WebP images are accepted.",
        },
        {
          status: 400,
        },
      );
    }

    if (uploadedValue.size <= 0) {
      return Response.json(
        {
          error: "The selected image is empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (uploadedValue.size > maximumFileSize) {
      return Response.json(
        {
          error: "The image must be smaller than 4 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const blob = await put(
      `battery-images/${safeFileName(
        uploadedValue.name,
      )}`,
      uploadedValue,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: uploadedValue.type,
      },
    );

    return Response.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Battery image upload failed:", error);

    return Response.json(
      {
        error:
          "Unable to upload the battery image. Check the Vercel Blob connection and try again.",
      },
      {
        status: 500,
      },
    );
  }
}