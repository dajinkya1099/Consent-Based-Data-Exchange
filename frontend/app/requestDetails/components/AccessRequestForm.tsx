"use client";

import { FormEvent, useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import UploadBox from "./UploadBox";
import { DEFAULT_FORM_VALUES, DESCRIPTION_MAX_LENGTH, FIELD_PLACEHOLDERS } from "../constants";
import { FormValues } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-() ]{8,20}$/;

export default function AccessRequestForm() {
  const [data, setData] = useState<FormValues>(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (name: keyof FormValues, value: string) => {
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setData((current) => ({ ...current, fileName: file.name }));
      setErrors((current) => ({ ...current, fileName: undefined }));
      setSuccess(false);
    } else if (file) {
      setErrors((current) => ({ ...current, fileName: "Only PDF files are accepted." }));
    }
  };

  const validate = (): Partial<Record<keyof FormValues, string>> => {
    const validation: Partial<Record<keyof FormValues, string>> = {};

    if (!data.name.trim()) validation.name = "Name is required.";
    if (!data.email.trim()) validation.email = "Email is required.";
    else if (!emailPattern.test(data.email.trim())) validation.email = "Enter a valid email address.";
    if (!data.dataset.trim()) validation.dataset = "Dataset name is required.";
    if (!data.resources.trim()) validation.resources = "Resources are required.";
    if (!data.phone.trim()) validation.phone = "Phone number is required.";
    else if (!phonePattern.test(data.phone.trim())) validation.phone = "Enter a valid phone number.";
    if (!data.purpose.trim()) validation.purpose = "Purpose is required.";
    if (!data.duration.trim()) validation.duration = "Duration is required.";
    if (!data.description.trim()) validation.description = "Description of use is required.";
    else if (data.description.trim().length > DESCRIPTION_MAX_LENGTH)
      validation.description = `Maximum ${DESCRIPTION_MAX_LENGTH} characters allowed.`;
    if (!data.fileName.trim()) validation.fileName = "Upload a PDF to continue.";

    return validation;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccess(Object.keys(validationErrors).length === 0);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Name"
          name="name"
          value={data.name}
          placeholder={FIELD_PLACEHOLDERS.name}
          required
          error={errors.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          placeholder={FIELD_PLACEHOLDERS.email}
          required
          error={errors.email}
          onChange={handleChange}
        />
        <InputField
          label="Dataset"
          name="dataset"
          value={data.dataset}
          placeholder={FIELD_PLACEHOLDERS.dataset}
          required
          error={errors.dataset}
          onChange={handleChange}
        />
        <InputField
          label="Resources"
          name="resources"
          value={data.resources}
          placeholder={FIELD_PLACEHOLDERS.resources}
          required
          error={errors.resources}
          onChange={handleChange}
        />
        <InputField
          label="Phone Number"
          name="phone"
          value={data.phone}
          placeholder={FIELD_PLACEHOLDERS.phone}
          required
          error={errors.phone}
          onChange={handleChange}
        />
        <InputField
          label="Select Duration"
          name="duration"
          value={data.duration}
          placeholder={FIELD_PLACEHOLDERS.duration}
          required
          error={errors.duration}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-6">
        <InputField
          label="Purpose"
          name="purpose"
          value={data.purpose}
          placeholder={FIELD_PLACEHOLDERS.purpose}
          required
          error={errors.purpose}
          onChange={handleChange}
        />

        <TextAreaField
          label="Description of Use"
          name="description"
          value={data.description}
          placeholder={FIELD_PLACEHOLDERS.description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          error={errors.description}
          onChange={handleChange}
        />

        <UploadBox fileName={data.fileName} error={errors.fileName} onFileChange={handleFileChange} />
      </div>

      {success ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
          Your access request is ready for submission. This interface is frontend-only and demonstrates the full form flow.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Ready to submit</p>
          <p className="text-sm text-slate-500">Review the form and upload the required PDF before submission.</p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}
