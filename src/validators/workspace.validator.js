import * as yup from "yup";

export const createWorkspaceSchema = yup.object({
  name: yup.string().trim().min(2, "Name is too short").required("Name is required"),
  templateId: yup.string().required("Select a template"),
  profile: yup.string().oneOf(["small", "medium", "large"]).required(),
  gitRepoUrl: yup
    .string()
    .trim()
    .matches(/^https:\/\/.+/, { message: "Must be a public https:// repository URL", excludeEmptyString: true })
    .optional(),
});
