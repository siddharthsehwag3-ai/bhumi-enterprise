import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  findAdminByEmail,
  recordAdminLogin,
} from "@/lib/admin-users";
import { createAdminSession } from "@/lib/session";

type LoginRequest = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;

    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const admin = await findAdminByEmail(email);

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createAdminSession({
      userId: admin.id,
      email: admin.email,
      displayName: admin.displayName,
      role: admin.role,
    });

    await recordAdminLogin(admin.id);

    return NextResponse.json({
      message: "Login successful.",
      redirectTo: "/admin",
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      {
        message:
          "The admin service is temporarily unavailable. Please try again.",
      },
      { status: 500 },
    );
  }
}