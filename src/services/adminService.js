import axiosInstance from "./axiosInstance";

export const listUsersRequest = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data.data;
};

export const updateUserRequest = async ({ userId, ...updates }) => {
  const response = await axiosInstance.patch(`/admin/users/${userId}`, updates);
  return response.data.data;
};
