"use client";

import { LoaderCircle } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import WorkspaceCard from "./WorkspaceCard";

export default function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-zinc-500">
        <LoaderCircle className="h-4 w-4 animate-spin" /> Loading workspaces...
      </div>
    );
  }

  if (!workspaces?.length) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">
        No workspaces yet — create your first one above.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
