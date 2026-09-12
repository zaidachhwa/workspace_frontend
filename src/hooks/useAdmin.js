"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsersRequest, updateUserRequest } from "@/services/adminService";

export const useAdminUsers = () => useQuery({ queryKey: ["admin", "users"], queryFn: listUsersRequest });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};
