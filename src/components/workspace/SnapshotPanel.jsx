"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Camera, RotateCcw, Trash2, LoaderCircle } from "lucide-react";
import { useSnapshots, useCreateSnapshot, useRestoreSnapshot, useDeleteSnapshot } from "@/hooks/useSnapshots";

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) => new Date(iso).toLocaleString();

export default function SnapshotPanel({ workspace }) {
  const [open, setOpen] = useState(false);
  const isRunning = workspace.status === "running";

  const { data: snapshots, isLoading } = useSnapshots(workspace.id, { enabled: open });
  const create = useCreateSnapshot(workspace.id);
  const restore = useRestoreSnapshot(workspace.id);
  const del = useDeleteSnapshot(workspace.id);

  return (
    <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        Snapshots
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <button
            disabled={create.isPending}
            onClick={() => create.mutate()}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {create.isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            Create snapshot
          </button>

          {create.isError && (
            <p className="text-xs text-red-600">{create.error?.response?.data?.message || "Failed to create snapshot"}</p>
          )}

          {isLoading && (
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Loading...
            </p>
          )}

          {!isLoading && !snapshots?.length && <p className="text-xs text-zinc-500">No snapshots yet.</p>}

          {snapshots?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900"
            >
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">{formatDate(snapshot.createdAt)}</p>
                <p className="text-zinc-500">{formatSize(snapshot.sizeBytes)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={isRunning || restore.isPending || del.isPending}
                  title={isRunning ? "Stop the workspace before restoring" : "Restore this snapshot"}
                  onClick={() => {
                    if (confirm("Restore this snapshot? Current files will be overwritten.")) {
                      restore.mutate(snapshot.id);
                    }
                  }}
                  className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 disabled:opacity-40 dark:hover:text-zinc-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </button>
                <button
                  disabled={restore.isPending || del.isPending}
                  onClick={() => {
                    if (confirm("Delete this snapshot? This cannot be undone.")) {
                      del.mutate(snapshot.id);
                    }
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {restore.isError && (
            <p className="text-xs text-red-600">{restore.error?.response?.data?.message || "Failed to restore snapshot"}</p>
          )}
        </div>
      )}
    </div>
  );
}
