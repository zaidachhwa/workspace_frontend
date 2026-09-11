"use client";

import { useState } from "react";
import { Play, Square, RotateCw, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import {
  useDeleteWorkspace,
  useRestartWorkspace,
  useStartWorkspace,
  useStopWorkspace,
} from "@/hooks/useWorkspaces";

const STATUS_STYLES = {
  running: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  stopped: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  creating: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  deleting: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

export default function WorkspaceCard({ workspace }) {
  const start = useStartWorkspace();
  const stop = useStopWorkspace();
  const restart = useRestartWorkspace();
  const remove = useDeleteWorkspace();

  const [copied, setCopied] = useState(false);

  const isRunning = workspace.status === "running";
  const busy = start.isPending || stop.isPending || restart.isPending || remove.isPending;

  const copyPassword = () => {
    navigator.clipboard?.writeText(workspace.accessPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{workspace.name}</h3>
          <p className="text-xs text-zinc-500">{workspace.slug}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[workspace.status] || STATUS_STYLES.stopped}`}
        >
          {workspace.status}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-xs text-zinc-500">
        <div>
          <dt>CPU</dt>
          <dd className="font-medium text-zinc-800 dark:text-zinc-200">{workspace.cpuLimit} vCPU</dd>
        </div>
        <div>
          <dt>Memory</dt>
          <dd className="font-medium text-zinc-800 dark:text-zinc-200">{workspace.memoryLimitMb} MB</dd>
        </div>
        <div>
          <dt>Storage</dt>
          <dd className="font-medium text-zinc-800 dark:text-zinc-200">{workspace.storageLimitMb} MB</dd>
        </div>
      </dl>

      {isRunning && workspace.accessUrl && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900">
          <a
            href={workspace.accessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-zinc-50"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open IDE
          </a>
          <button
            onClick={copyPassword}
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy password"}
          </button>
        </div>
      )}

      <div className="mt-1 flex gap-2">
        {isRunning ? (
          <button
            disabled={busy}
            onClick={() => stop.mutate(workspace.id)}
            className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <Square className="h-3.5 w-3.5" /> Stop
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() => start.mutate(workspace.id)}
            className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <Play className="h-3.5 w-3.5" /> Start
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => restart.mutate(workspace.id)}
          className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <RotateCw className="h-3.5 w-3.5" /> Restart
        </button>
        <button
          disabled={busy}
          onClick={() => {
            if (confirm(`Delete workspace "${workspace.name}"? This cannot be undone.`)) {
              remove.mutate(workspace.id);
            }
          }}
          className="ml-auto flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
