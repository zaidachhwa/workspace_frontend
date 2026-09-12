import axiosInstance from "./axiosInstance";

export const listWorkspacesRequest = async () => {
  const response = await axiosInstance.get("/workspaces");
  return response.data.data;
};

export const listWorkspaceTemplatesRequest = async () => {
  const response = await axiosInstance.get("/workspace-templates");
  return response.data.data;
};

export const createWorkspaceRequest = async (payload) => {
  const response = await axiosInstance.post("/workspaces", payload);
  return response.data.data;
};

export const deleteWorkspaceRequest = async (id) => {
  await axiosInstance.delete(`/workspaces/${id}`);
};

export const startWorkspaceRequest = async (id) => {
  const response = await axiosInstance.post(`/workspaces/${id}/start`);
  return response.data.data;
};

export const stopWorkspaceRequest = async (id) => {
  const response = await axiosInstance.post(`/workspaces/${id}/stop`);
  return response.data.data;
};

export const restartWorkspaceRequest = async (id) => {
  const response = await axiosInstance.post(`/workspaces/${id}/restart`);
  return response.data.data;
};

export const listSnapshotsRequest = async (id) => {
  const response = await axiosInstance.get(`/workspaces/${id}/snapshots`);
  return response.data.data;
};

export const createSnapshotRequest = async (id) => {
  const response = await axiosInstance.post(`/workspaces/${id}/snapshots`);
  return response.data.data;
};

export const restoreSnapshotRequest = async ({ workspaceId, snapshotId }) => {
  await axiosInstance.post(`/workspaces/${workspaceId}/snapshots/${snapshotId}/restore`);
};

export const deleteSnapshotRequest = async ({ workspaceId, snapshotId }) => {
  await axiosInstance.delete(`/workspaces/${workspaceId}/snapshots/${snapshotId}`);
};

export const listMembersRequest = async (id) => {
  const response = await axiosInstance.get(`/workspaces/${id}/members`);
  return response.data.data;
};

export const addMemberRequest = async ({ workspaceId, email }) => {
  const response = await axiosInstance.post(`/workspaces/${workspaceId}/members`, { email });
  return response.data.data;
};

export const removeMemberRequest = async ({ workspaceId, memberId }) => {
  await axiosInstance.delete(`/workspaces/${workspaceId}/members/${memberId}`);
};
