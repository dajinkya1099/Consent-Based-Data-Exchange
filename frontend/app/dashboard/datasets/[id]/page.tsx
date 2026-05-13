"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createConsentRequest, DatasetItem, getDatasetById } from "../../../../lib/dataStore";
import { loadUserProfile } from "../../../../lib/localStorage";

const purposes = ["Academia", "R&D", "Business", "Journalistic", "Govt Use", "Other"];

export default function DatasetDetailPage() {
  const params = useParams();
  const datasetId = params?.id as string;
  const [dataset, setDataset] = useState<DatasetItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestAs, setRequestAs] = useState<"individual" | "organisation">("organisation");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [requestSaved, setRequestSaved] = useState(false);

  useEffect(() => {
    if (!datasetId) return;
    setDataset(getDatasetById(datasetId) ?? null);
  }, [datasetId]);

  const userProfile = useMemo(() => {
    return loadUserProfile<Record<string, string | undefined>>();
  }, []);

  const currentUsername = userProfile?.username ?? "anonymous";

  const requestEnabled = requestAs === "organisation" ? agreedToTerms : agreedToTerms && selectedPurposes.length > 0;

  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes((current) =>
      current.includes(purpose) ? current.filter((item) => item !== purpose) : [...current, purpose],
    );
  };

  const handleRequestSubmit = () => {
    if (!dataset) return;
    if (!requestEnabled) {
      setErrorMessage("Please complete the request form before submitting.");
      return;
    }

    try {
      createConsentRequest(currentUsername, {
        datasetId: dataset.id,
        datasetName: dataset.name,
        accessType: dataset.accessType,
        requestType: requestAs,
        purpose: requestAs === "individual" ? selectedPurposes : [],
        agreedToTerms,
        requesterEmail: userProfile?.email ?? undefined,
      });
      setSuccessMessage("Your request has been submitted successfully.");
      setRequestSaved(true);
      setModalOpen(false);
    } catch (error) {
      setErrorMessage("Unable to submit the request. Please try again.");
    }
  };

  if (!dataset) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Dataset not found</h1>
          <p className="mt-4 text-slate-600">The dataset you are looking for is unavailable. Please return to the dataset list.</p>
          <div className="mt-6">
            <Link href="/dashboard/datasets" className="inline-flex rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Back to datasets
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Dataset details</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{dataset.name}</h1>
            <p className="mt-3 text-slate-600">{dataset.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center rounded-3xl px-4 py-2 text-sm font-semibold ${dataset.accessType === "public" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {dataset.accessType === "public" ? "Public dataset" : "Protected dataset"}
            </span>
            <Link href="/dashboard/datasets" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Back to datasets
            </Link>
          </div>
        </div>

        {successMessage ? (
          <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6 text-slate-900 shadow-sm">
            {successMessage}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Uploaded by</p>
                  <p className="text-lg font-semibold text-slate-900">{dataset.uploadedBy}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Organisation type</p>
                  <p className="text-lg font-semibold text-slate-900">{dataset.organisationType}</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="text-lg font-semibold text-slate-900">{dataset.department}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Last updated</p>
                  <p className="text-lg font-semibold text-slate-900">{dataset.lastUpdated}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">License</p>
                <p className="text-lg font-semibold text-slate-900">{dataset.license}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Dataset metadata</p>
                <div className="mt-4 grid gap-3">
                  <p><span className="font-semibold text-slate-900">File type:</span> {dataset.fileType}</p>
                  <p><span className="font-semibold text-slate-900">Author:</span> {dataset.author}</p>
                  <p><span className="font-semibold text-slate-900">Institution:</span> {dataset.institution}</p>
                  <p className="flex flex-wrap gap-2"><span className="font-semibold text-slate-900">Tags:</span> {dataset.tags.map((tag) => (<span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tag}</span>))}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Action</p>
            <p className="mt-2 text-slate-600">Use the actions below to request access or download the dataset.</p>
            {dataset.accessType === "public" ? (
              <button className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Download dataset
              </button>
            ) : (
              <button onClick={() => setModalOpen(true)} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500">
                Request for Data Access
              </button>
            )}
          </div>
        </div>

        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
            <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Additional Information for Download Request</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Request access for protected dataset</h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Close</button>
              </div>
              <div className="mt-8 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-700">Request as</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {(["individual", "organisation"] as const).map((option) => (
                      <label key={option} className="inline-flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="requestAs"
                          value={option}
                          checked={requestAs === option}
                          onChange={() => setRequestAs(option)}
                          className="h-4 w-4 text-sky-600"
                        />
                        {option === "individual" ? "Individual" : "Organisation"}
                      </label>
                    ))}
                  </div>
                </div>

                {requestAs === "individual" ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-700">Purpose</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {purposes.map((purpose) => (
                        <label key={purpose} className="inline-flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={selectedPurposes.includes(purpose)}
                            onChange={() => handlePurposeToggle(purpose)}
                            className="h-4 w-4 text-sky-600"
                          />
                          {purpose}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}

                <label className="inline-flex items-start gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-700">
                  <input type="checkbox" checked={agreedToTerms} onChange={(event) => setAgreedToTerms(event.target.checked)} className="mt-1 h-4 w-4 text-sky-600" />
                  <span>I agree to the terms and conditions for access request.</span>
                </label>

                <button
                  type="button"
                  onClick={handleRequestSubmit}
                  disabled={!requestEnabled}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Request Access
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
