"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, ArrowLeft, ShieldCheck, ShieldOff } from "lucide-react";
import { useMe } from "@/hooks/useAuth";
import { useAdminUsers, useUpdateUser } from "@/hooks/useAdmin";

function UserRow({ user }) {
  const updateUser = useUpdateUser();
  const [quota, setQuota] = useState(user.workspaceQuota);
  const [open, setOpen] = useState(false);

  const saveQuota = () => {
    if (Number(quota) !== user.workspaceQuota) {
      updateUser.mutate({ userId: user.id, workspaceQuota: Number(quota) });
    }
  };

  const toggleDisabled = () => {
    const action = user.disabled ? "re-enable" : "disable";
    if (confirm(`${action[0].toUpperCase()}${action.slice(1)} ${user.email}?`)) {
      updateUser.mutate({ userId: user.id, disabled: !user.disabled });
    }
  };

  return (
    <>
      <tr className="border-b border-zinc-200 dark:border-zinc-800">
        <td className="py-2 pr-4">
          <button onClick={() => setOpen((v) => !v)} className="text-left hover:underline">
            {user.name}
          </button>
          <p className="text-xs text-zinc-500">{user.email}</p>
        </td>
        <td className="py-2 pr-4">
          {user.role === "admin" ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              Admin
            </span>
          ) : (
            <span className="text-xs text-zinc-500">User</span>
          )}
        </td>
        <td className="py-2 pr-4 text-sm">
          {user.workspaceCount} / {user.workspaceQuota}
        </td>
        <td className="py-2 pr-4">
          <input
            type="number"
            min={0}
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            onBlur={saveQuota}
            className="w-16 rounded-lg border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
        </td>
        <td className="py-2 pr-4">
          {user.disabled ? (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
              Disabled
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Active</span>
          )}
        </td>
        <td className="py-2">
          {user.role !== "admin" && (
            <button
              disabled={updateUser.isPending}
              onClick={toggleDisabled}
              className="flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {user.disabled ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
              {user.disabled ? "Enable" : "Disable"}
            </button>
          )}
        </td>
      </tr>
      {open && user.workspaces.length > 0 && (
        <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <td colSpan={6} className="px-2 py-2">
            <ul className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              {user.workspaces.map((w) => (
                <li key={w.id}>
                  {w.name} — <span className="capitalize">{w.status}</span>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading, isError } = useMe();
  const { data: users, isLoading: usersLoading } = useAdminUsers();

  useEffect(() => {
    if (isError) router.replace("/login");
    else if (me && me.role !== "admin") router.replace("/dashboard");
  }, [isError, me, router]);

  if (meLoading || isError || !me || me.role !== "admin") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
      <header className="flex items-center gap-3">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Admin</h1>
          <p className="text-sm text-zinc-500">Manage users, quotas, and access</p>
        </div>
      </header>

      {usersLoading ? (
        <LoaderCircle className="h-5 w-5 animate-spin text-zinc-400" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium text-zinc-500 dark:border-zinc-800">
                <th className="pb-2 pr-4">User</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">Workspaces</th>
                <th className="pb-2 pr-4">Quota</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
