import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Create account</h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-50">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
