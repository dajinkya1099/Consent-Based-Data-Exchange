import { z } from "zod";

export const individualStep1Schema = z.object({
  role: z.enum(["Consumer", "Provider"]),
  email: z.string().email("Enter a valid email"),
  aadhaarNumber: z.string().min(12, "Aadhaar must be 12 digits").max(12, "Aadhaar must be 12 digits"),
});

export const individualStep2Schema = z.object({
  addressLine1: z.string().min(2, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode is required"),
  country: z.string().min(2, "Country is required"),
});

export const individualStep3Schema = z.object({
  username: z.string().min(4, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export const organisationStep1Schema = z.object({
  role: z.enum(["Consumer", "Provider"]),
  organisationName: z.string().min(2, "Organisation name is required"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactPersonEmail: z.string().email("Enter a valid email"),
  contactPersonMobile: z.string().min(10, "Mobile number is required"),
});

export const organisationStep2Schema = z.object({
  documentType: z.enum(["GST", "CIN", "MSME", "PAN"]),
  registrationNumber: z.string().min(5, "Registration number is required"),
});

export const organisationStep3Schema = z.object({
  organisationAddress: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode is required"),
  country: z.string().min(2, "Country is required"),
});

export const organisationStep4Schema = z.object({
  secondaryContactName: z.string().min(2, "Secondary contact name is required"),
  secondaryContactEmail: z.string().email("Enter a valid email"),
  secondaryContactMobile: z.string().min(10, "Secondary contact mobile is required"),
});

export const organisationStep5Schema = z.object({
  username: z.string().min(4, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});
