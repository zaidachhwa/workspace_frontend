import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().trim().min(2, "Name is too short").required("Name is required"),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "At least 8 characters").required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});
