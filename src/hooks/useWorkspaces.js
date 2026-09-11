"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  listWorkspaceTemplatesRequest,
  listWorkspacesRequest,
  restartWorkspaceRequest,
  startWorkspaceRequest,
  stopWorkspaceRequest,
} from "@/services/workspaceService";

export const useWorkspaces = () =>
  useQuery({ queryKey: ["workspaces"], queryFn: listWorkspacesRequest });

export const useWorkspaceTemplates = () =>
  useQuery({ queryKey: ["workspace-templates"], queryFn: listWorkspaceTemplatesRequest });

const useWorkspaceMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
  });
};

export const useCreateWorkspace = () => useWorkspaceMutation(createWorkspaceRequest);
export const useDeleteWorkspace = () => useWorkspaceMutation(deleteWorkspaceRequest);
export const useStartWorkspace = () => useWorkspaceMutation(startWorkspaceRequest);
export const useStopWorkspace = () => useWorkspaceMutation(stopWorkspaceRequest);
export const useRestartWorkspace = () => useWorkspaceMutation(restartWorkspaceRequest);
