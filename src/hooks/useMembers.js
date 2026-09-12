"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMemberRequest, listMembersRequest, removeMemberRequest } from "@/services/workspaceService";

export const useMembers = (workspaceId, { enabled = true } = {}) =>
  useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => listMembersRequest(workspaceId),
    enabled,
  });

const useMemberMutation = (mutationFn, workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members", workspaceId] }),
  });
};

export const useAddMember = (workspaceId) =>
  useMemberMutation((email) => addMemberRequest({ workspaceId, email }), workspaceId);

export const useRemoveMember = (workspaceId) =>
  useMemberMutation((memberId) => removeMemberRequest({ workspaceId, memberId }), workspaceId);
