import {FormValues } from "./types";



export const DEFAULT_FORM_VALUES: FormValues = {
  name: "",
  email: "",
  dataset: "",
  resources: "",
  phone: "",
  purpose: "",
  duration: "",
  description: "",
  fileName: "",
};

export const DESCRIPTION_MAX_LENGTH = 200;

export const FIELD_PLACEHOLDERS = {
  name: "Enter full name",
  email: "Enter email address",
  dataset: "Enter dataset name",
  resources: "Enter required resources",
  phone: "Enter phone number",
  purpose: "Describe the purpose",
  duration: "Enter access duration (e.g. 30 days)",
  description: "Describe how you will use the data",
};
