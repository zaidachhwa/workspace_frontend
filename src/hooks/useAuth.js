"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest, logoutRequest, meRequest, registerRequest } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export const useMe = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await meRequest();
      setUser(user);
      return user;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["me"], user);
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["me"], user);
    },
  });
};

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
  });
};
