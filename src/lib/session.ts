import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "bhumi_admin_session";

export type AdminRole = "owner" | "admin" | "editor";

export type AdminSession = {
  userId: number;
  email: string;
  displayName: string;
  role: AdminRole;
};

function getSessionSecret() {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error("SESSION_SECRET is missing from .env.local");
  }

  return new TextEncoder().encode(sessionSecret);
}

export async function createAdminSession(session: AdminSession) {
  const token = await new SignJWT({
    userId: session.userId,
    email: session.email,
    displayName: session.displayName,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSessionSecret());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());

    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.displayName !== "string" ||
      !["owner", "admin", "editor"].includes(String(payload.role))
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      displayName: payload.displayName,
      role: payload.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}