"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitConsentRequest } from "../lib/api";

const datasetOptions = [
  {
    id: "ds-001",
    name: "Open Demographics",
    access_type: "public",
    description: "A public demographics dataset suitable for analytics, R&D, and academic experimentation.",
    metadata: {
      records: 120000,
      owner: "Open Data Trust",
      tags: ["demographics", "open", "public"],
    },
  },
  {
    id: "ds-002",
    name: "Protected Health Signals",
    access_type: "protected",
    description: "A protected health dataset with sensitive signals and metadata requiring consent for access.",
    metadata: {
      records: 54000,
      owner: "HealthGov",
      tags: ["health", "protected", "research"],
    },
  },
  {
    id: "ds-003",
    name: "Protected Financial Insights",
    access_type: "protected",
    description: "A protected financial dataset for business intelligence and regulatory research.",
    metadata: {
      records: 24000,
      owner: "FinanceLabs",
      tags: ["finance", "protected", "analytics"],
    },
  },
];

const purposeOptions = ["R&D", "Academia", "Business", "Govt Use"];

const consentSchema = z.object({
  dataset_id: z.string().nonempty("Please select a dataset."),
  dataset_name: z.string().nonempty(),
  access_type: z.enum(["public", "protected"]),
  request_type: z.enum(["individual", "organisational"]),
  purpose: z.array(z.string()).min(1, "Select at least one purpose."),
  agreed_to_terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms to submit." }),
  }),
  requester_email: z.string().email("Enter a valid email address.").optional().or(z.literal("")),
});

type ConsentFormValues = z.infer<typeof consentSchema>;

export default function ConsentRequestForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConsentFormValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      dataset_id: datasetOptions[0].id,
      dataset_name: datasetOptions[0].name,
      access_type: datasetOptions[0].access_type,
      request_type: "individual",
      purpose: [],
      agreed_to_terms: false,
      requester_email: "",
    },
  });

  const datasetId = watch("dataset_id");
  const selectedDataset = useMemo(
    () => datasetOptions.find((item) => item.id === datasetId) ?? datasetOptions[0],
    [datasetId],
  );

  useEffect(() => {
    setValue("dataset_name", selectedDataset.name);
    setValue("access_type", selectedDataset.access_type);
  }, [selectedDataset, setValue]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = window.localStorage.getItem("consent-exchange-user-profile");
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          if (profile?.email) {
            setValue("requester_email", profile.email);
          }
        } catch {
          // ignore malformed localStorage values
        }
      }
    }
  }, [setValue]);

  const purposeValues = watch("purpose") || [];

  const togglePurpose = (value: string) => {
    if (purposeValues.includes(value)) {
      setValue("purpose", purposeValues.filter((item) => item !== value));
      return;
    }
    setValue("purpose", [...purposeValues, value]);
  };

  const onSubmit = async (formData: ConsentFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await submitConsentRequest({
        ...formData,
        requester_email: formData.requester_email || undefined,
      });
      setSuccessMessage(`Consent request submitted successfully. Request ID: ${result.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Submission failed.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Consent Request</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Request dataset access</h1>
        <p className="mt-3 text-slate-600">Submit a new consent request for protected and public datasets with purpose and policy agreement.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Dataset</span>
            <select
              className="mt-2 block w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              {...register("dataset_id")}
            >
              {datasetOptions.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} ({dataset.access_type})
                </option>
              ))}
            </select>
            {errors.dataset_id && <p className="mt-2 text-sm text-red-600">{errors.dataset_id.message}</p>}
          </label>

          <div className="block">
            <span className="text-sm font-medium text-slate-700">Dataset type</span>
            <div className="mt-2 rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800">
              {selectedDataset.access_type}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Request type</span>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "individual", label: "Individual" },
                { value: "organisational", label: "Organisational" },
              ].map((option) => (
                <label key={option.value} className="inline-flex items-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-400">
                  <input
                    type="radio"
                    value={option.value}
                    {...register("request_type")}
                    className="h-4 w-4 text-sky-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.request_type && <p className="mt-2 text-sm text-red-600">{errors.request_type.message}</p>}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email (optional)</span>
            <input
              type="email"
              placeholder="Enter requestor email"
              className="mt-2 block w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              {...register("requester_email")}
            />
            {errors.requester_email && <p className="mt-2 text-sm text-red-600">{errors.requester_email.message}</p>}
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-700">Purpose</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {purposeOptions.map((purpose) => (
              <label key={purpose} className="inline-flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm hover:border-slate-400">
                <input
                  type="checkbox"
                  value={purpose}
                  checked={purposeValues.includes(purpose)}
                  onChange={() => togglePurpose(purpose)}
                  className="h-4 w-4 text-sky-600"
                />
                {purpose}
              </label>
            ))}
          </div>
          {errors.purpose && <p className="mt-3 text-sm text-red-600">{errors.purpose.message}</p>}
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Dataset details</span>
            <p className="text-sm text-slate-600">{selectedDataset.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {selectedDataset.metadata.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-200 px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>
          {selectedDataset.access_type === "protected" && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View protected dataset details
            </button>
          )}
        </div>

        <label className="flex items-start gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-4">
          <input type="checkbox" {...register("agreed_to_terms")} className="mt-1 h-4 w-4 text-sky-600" />
          <span className="text-sm leading-6 text-slate-700">
            I agree to the terms of use and consent policy for dataset access.
          </span>
        </label>
        {errors.agreed_to_terms && <p className="text-sm text-red-600">{errors.agreed_to_terms.message}</p>}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit consent request"}
          </button>
          <p className="text-sm text-slate-500">A request ID is generated on successful submission.</p>
        </div>

        {successMessage && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{successMessage}</div>}
        {errorMessage && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{errorMessage}</div>}
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Protected dataset</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedDataset.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 text-slate-700">
              <p>{selectedDataset.description}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Records</p>
                  <p className="mt-2 text-lg font-semibold">{selectedDataset.metadata.records.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Owner</p>
                  <p className="mt-2 text-lg font-semibold">{selectedDataset.metadata.owner}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Access</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{selectedDataset.access_type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDataset.metadata.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
