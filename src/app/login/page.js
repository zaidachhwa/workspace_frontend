import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Log in</h1>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/register" className="font-medium text-zinc-900 underline dark:text-zinc-50">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
