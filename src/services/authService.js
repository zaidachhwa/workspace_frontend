import axiosInstance from "./axiosInstance";

export const registerRequest = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data.data;
};

export const loginRequest = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data.data;
};

export const logoutRequest = async () => {
  await axiosInstance.post("/auth/logout");
};

export const meRequest = async () => {
  const response = await axiosInstance.get("/me");
  return response.data.data;
};
