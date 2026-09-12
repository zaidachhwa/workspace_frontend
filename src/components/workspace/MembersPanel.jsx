"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, UserPlus, X, LoaderCircle, Crown } from "lucide-react";
import { useMembers, useAddMember, useRemoveMember } from "@/hooks/useMembers";
import { useAuthStore } from "@/store/authStore";

export default function MembersPanel({ workspace }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const currentUser = useAuthStore((state) => state.user);

  const { data, isLoading } = useMembers(workspace.id, { enabled: open });
  const addMember = useAddMember(workspace.id);
  const removeMember = useRemoveMember(workspace.id);

  const onInvite = (e) => {
    e.preventDefault();
    addMember.mutate(email, { onSuccess: () => setEmail("") });
  };

  return (
    <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        Members
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {isLoading && (
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Loading...
            </p>
          )}

          {data?.owner && (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900">
              <span className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                {data.owner.name} {data.owner.email === currentUser?.email && "(you)"}
              </span>
              <span className="text-zinc-500">Owner</span>
            </div>
          )}

          {data?.members?.map((member) => {
            const isSelf = member.email === currentUser?.email;
            return (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900"
              >
                <span className="text-zinc-800 dark:text-zinc-200">
                  {member.name} {isSelf && "(you)"}
                </span>
                {(workspace.isOwner || isSelf) && (
                  <button
                    disabled={removeMember.isPending}
                    onClick={() => {
                      const label = isSelf ? "leave this workspace" : `remove ${member.name}`;
                      if (confirm(`Are you sure you want to ${label}?`)) {
                        removeMember.mutate(member.id);
                      }
                    }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    <X className="h-3.5 w-3.5" /> {isSelf ? "Leave" : "Remove"}
                  </button>
                )}
              </div>
            );
          })}

          {workspace.isOwner && (
            <form onSubmit={onInvite} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="teammate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
              />
              <button
                type="submit"
                disabled={addMember.isPending}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {addMember.isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                Invite
              </button>
            </form>
          )}

          {addMember.isError && (
            <p className="text-xs text-red-600">{addMember.error?.response?.data?.message || "Failed to add member"}</p>
          )}
          {!workspace.isOwner && (
            <p className="text-xs text-zinc-500">Only the owner can invite people to this workspace.</p>
          )}
        </div>
      )}
    </div>
  );
}
