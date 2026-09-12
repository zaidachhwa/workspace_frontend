"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSnapshotRequest,
  deleteSnapshotRequest,
  listSnapshotsRequest,
  restoreSnapshotRequest,
} from "@/services/workspaceService";

export const useSnapshots = (workspaceId, { enabled = true } = {}) =>
  useQuery({
    queryKey: ["snapshots", workspaceId],
    queryFn: () => listSnapshotsRequest(workspaceId),
    enabled,
  });

const useSnapshotMutation = (mutationFn, workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["snapshots", workspaceId] }),
  });
};

export const useCreateSnapshot = (workspaceId) =>
  useSnapshotMutation(() => createSnapshotRequest(workspaceId), workspaceId);

export const useRestoreSnapshot = (workspaceId) =>
  useSnapshotMutation((snapshotId) => restoreSnapshotRequest({ workspaceId, snapshotId }), workspaceId);

export const useDeleteSnapshot = (workspaceId) =>
  useSnapshotMutation((snapshotId) => deleteSnapshotRequest({ workspaceId, snapshotId }), workspaceId);
