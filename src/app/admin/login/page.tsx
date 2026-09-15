import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm/AdminLoginForm";
import { getAdminSession } from "@/lib/session";

type AdminLoginPageProps = {
  searchParams: Promise<{
    reset?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const parameters = await searchParams;
  const passwordReset =
    parameters.reset === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-14 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <AdminLoginForm passwordReset={passwordReset} />

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Login and password recovery are restricted to authorised
          Bhumi Enterprise administrators.
        </p>
      </div>
    </main>
  );
}