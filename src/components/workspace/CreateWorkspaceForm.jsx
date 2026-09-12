"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, LoaderCircle, TriangleAlert } from "lucide-react";
import { createWorkspaceSchema } from "@/validators/workspace.validator";
import { useCreateWorkspace, useWorkspaceTemplates } from "@/hooks/useWorkspaces";

export default function CreateWorkspaceForm() {
  const { data: templates, isLoading: templatesLoading } = useWorkspaceTemplates();
  const createWorkspace = useCreateWorkspace();
  const [gitImportError, setGitImportError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createWorkspaceSchema),
    defaultValues: { profile: "small", gitRepoUrl: "" },
  });

  const onSubmit = (values) => {
    setGitImportError(null);
    createWorkspace.mutate(values, {
      onSuccess: (workspace) => {
        setGitImportError(workspace.gitImportError);
        reset({ name: "", profile: "small", gitRepoUrl: "" });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700"
    >
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Create workspace</h3>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label htmlFor="name" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="my-project"
            {...register("name")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="templateId" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Template
          </label>
          <select
            id="templateId"
            disabled={templatesLoading}
            {...register("templateId")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            <option value="">Select a template</option>
            {templates?.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {errors.templateId && <p className="text-xs text-red-600">{errors.templateId.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="profile" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Profile
          </label>
          <select
            id="profile"
            {...register("profile")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          >
            <option value="small">Small — 1 vCPU / 2GB</option>
            <option value="medium">Medium — 2 vCPU / 4GB</option>
            <option value="large">Large — 4 vCPU / 8GB</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="gitRepoUrl" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Git repository URL (optional)
        </label>
        <input
          id="gitRepoUrl"
          type="text"
          placeholder="https://github.com/user/repo.git"
          {...register("gitRepoUrl")}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
        />
        <p className="text-xs text-zinc-500">Public repositories only — cloned in automatically once the workspace starts.</p>
        {errors.gitRepoUrl && <p className="text-xs text-red-600">{errors.gitRepoUrl.message}</p>}
      </div>

      {gitImportError && (
        <p className="flex items-start gap-1.5 text-sm text-amber-600 dark:text-amber-500">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Workspace created, but the repository import failed: {gitImportError}
        </p>
      )}

      {createWorkspace.isError && (
        <p className="text-sm text-red-600">
          {createWorkspace.error?.response?.data?.message || "Something went wrong"}
        </p>
      )}

      <button
        type="submit"
        disabled={createWorkspace.isPending}
        className="flex w-fit items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
      >
        {createWorkspace.isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Create
      </button>
    </form>
  );
}
