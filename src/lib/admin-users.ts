import { getDatabase } from "@/lib/db";
import type { AdminRole } from "@/lib/session";

export type AdminUser = {
  id: number;
  email: string;
  passwordHash: string;
  displayName: string;
  role: AdminRole;
  isActive: boolean;
};

type AdminUserRow = {
  id: number;
  email: string;
  password_hash: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
};

export async function findAdminByEmail(
  suppliedEmail: string,
): Promise<AdminUser | null> {
  const sql = getDatabase();
  const normalizedEmail = suppliedEmail.trim().toLowerCase();

  const rows = await sql<AdminUserRow[]>`
    SELECT
      id,
      email,
      password_hash,
      display_name,
      role,
      is_active
    FROM admin_users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  const user = rows[0];

  if (!user) {
    return null;
  }

  return {
    id: Number(user.id),
    email: user.email,
    passwordHash: user.password_hash,
    displayName: user.display_name,
    role: user.role,
    isActive: user.is_active,
  };
}

export async function recordAdminLogin(userId: number) {
  const sql = getDatabase();

  await sql`
    UPDATE admin_users
    SET last_login_at = NOW()
    WHERE id = ${userId}
  `;
}