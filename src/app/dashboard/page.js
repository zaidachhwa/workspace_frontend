"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { useMe, useLogout } from "@/hooks/useAuth";
import CreateWorkspaceForm from "@/components/workspace/CreateWorkspaceForm";
import WorkspaceList from "@/components/workspace/WorkspaceList";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();
  const logout = useLogout();

  useEffect(() => {
    if (isError) router.replace("/login");
  }, [isError, router]);

  if (isLoading || isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Workspaces</h1>
          <p className="text-sm text-zinc-500">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.replace("/login") })}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </header>

      <CreateWorkspaceForm />
      <WorkspaceList />
    </div>
  );
}
