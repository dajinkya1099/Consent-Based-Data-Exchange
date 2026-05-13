"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConsentRequestItem,
  getProviderDatasetsByOwner,
  getRequestsForProvider,
  ProviderDatasetItem,
  saveProviderDataset,
  updateRequestStatus,
} from "../../lib/dataStore";

interface UserProfile {
  registrationType: "individual" | "organisation";
  organisationName?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonMobile?: string;
  email?: string;
  aadhaarNumber?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  addressLine1?: string;
  documentType?: string;
  registrationNumber?: string;
  organisationAddress?: string;
  secondaryContactName?: string;
  secondaryContactEmail?: string;
  secondaryContactMobile?: string;
  username?: string;
  aadhaarVerified?: boolean;
  mobileVerified?: boolean;
  documentValidated?: boolean;
}

interface ProfilePanelProps {
  isOpen: boolean;
  profile: UserProfile | null;
  completion: number;
  onClose: () => void;
  onVerifyMobile: () => void;
  onVerifyAadhaar: () => void;
}

const initialDatasetForm = {
  id: "",
  name: "",
  accessType: "protected" as "public" | "protected",
  description: "",
  author: "",
  institution: "",
  fileType: "CSV",
  publicationDate: new Date().toISOString().slice(0, 10),
  uploadedBy: "",
  organisationType: "Protected",
  department: "",
  lastUpdated: new Date().toISOString().slice(0, 10),
  license: "CC BY 4.0",
  tags: "",
  consentStatus: "Active" as "Active" | "Withdrawn",
  expiryDate: "",
};

export function ProfilePanel({ isOpen, profile, completion, onClose, onVerifyMobile, onVerifyAadhaar }: ProfilePanelProps) {
  const router = useRouter();
  const [providerDatasets, setProviderDatasets] = useState<ProviderDatasetItem[]>([]);
  const [providerRequests, setProviderRequests] = useState<ConsentRequestItem[]>([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showAddDatasetModal, setShowAddDatasetModal] = useState(false);
  const [showDatasetManager, setShowDatasetManager] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<ProviderDatasetItem | null>(null);
  const [datasetForm, setDatasetForm] = useState<typeof initialDatasetForm>(initialDatasetForm);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const ownerName = useMemo(() => profile?.organisationName || profile?.username || "", [profile]);

  useEffect(() => {
    if (!profile || profile.registrationType !== "organisation") return;
    setProviderDatasets(getProviderDatasetsByOwner(ownerName));
    setProviderRequests(getRequestsForProvider(ownerName));
  }, [profile, ownerName]);

  const handleDatasetInput = (field: string, value: string) => {
    setDatasetForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveDataset = () => {
    if (!profile) return;
    const newDataset: ProviderDatasetItem = {
      id: selectedDataset?.id || `provider-${Date.now()}`,
      name: datasetForm.name,
      accessType: datasetForm.accessType,
      description: datasetForm.description,
      author: datasetForm.author,
      institution: datasetForm.institution,
      fileType: datasetForm.fileType,
      publicationDate: datasetForm.publicationDate,
      uploadedBy: ownerName,
      organisationType: datasetForm.organisationType,
      department: datasetForm.department,
      lastUpdated: datasetForm.lastUpdated,
      license: datasetForm.license,
      tags: datasetForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      consentStatus: datasetForm.consentStatus,
      expiryDate: datasetForm.expiryDate || undefined,
    };

    saveProviderDataset(newDataset);
    setProviderDatasets(getProviderDatasetsByOwner(ownerName));
    setStatusMessage("Dataset metadata saved successfully.");
    setShowAddDatasetModal(false);
    setSelectedDataset(null);
    setDatasetForm(initialDatasetForm);
  };

  const handleEditDataset = (dataset: ProviderDatasetItem) => {
    setSelectedDataset(dataset);
    setDatasetForm({
      ...dataset,
      tags: dataset.tags.join(", "),
      expiryDate: dataset.expiryDate ?? "",
    });
    setShowAddDatasetModal(true);
  };

  const handleSelectDataset = (dataset: ProviderDatasetItem) => {
    setSelectedDataset(dataset);
    setShowDatasetManager(true);
  };

  const handleUpdateDataset = () => {
    if (!selectedDataset) return;
    handleSaveDataset();
  };

  const handleWithdrawConsent = () => {
    if (!selectedDataset) return;
    setSelectedDataset({ ...selectedDataset, consentStatus: "Withdrawn" });
    setDatasetForm((current) => ({ ...current, consentStatus: "Withdrawn" }));
    saveProviderDataset({ ...selectedDataset, consentStatus: "Withdrawn" });
    setStatusMessage("Consent withdrawn successfully.");
    setProviderDatasets(getProviderDatasetsByOwner(ownerName));
  };

  const handleRequestStatus = (requestId: string, status: "Approved" | "Rejected") => {
    const updated = updateRequestStatus(requestId, status);
    if (updated) {
      setProviderRequests(getRequestsForProvider(ownerName));
      setStatusMessage(`Request marked ${status.toLowerCase()}.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
      <div className="m-4 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
            <p className="text-sm text-slate-500">Review saved registration data and available request actions.</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>

        {statusMessage ? (
          <div className="rounded-3xl border border-sky-200 bg-sky-50 px-6 py-4 text-sm text-slate-900">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Profile Completion</p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-sky-600" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{completion}%</p>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">Verification Status</p>
            <p className="text-sm text-slate-600">Aadhaar: {profile?.aadhaarVerified ? "Verified" : "Not verified"}</p>
            <p className="text-sm text-slate-600">Mobile: {profile?.mobileVerified ? "Verified" : "Not verified"}</p>
            {!profile?.mobileVerified ? (
              <button onClick={onVerifyMobile} className="mt-3 inline-flex rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                Verify Mobile
              </button>
            ) : null}
            {!profile?.aadhaarVerified ? (
              <button onClick={onVerifyAadhaar} className="mt-3 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                Verify Aadhaar
              </button>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-6">
          <div className="grid gap-4">
            {profile ? Object.entries(profile).map(([key, value]) => {
              if (value === undefined || key === "registrationType") return null;
              return (
                <div key={key} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{String(value)}</p>
                </div>
              );
            }) : null}
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            {profile?.registrationType === "individual" ? (
              <button onClick={() => router.push("/dashboard/my-requests")} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                My Request
              </button>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={() => setShowRequestsModal(true)} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Show Request
                </button>
                <button onClick={() => setShowAddDatasetModal(true)} className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                  Add Dataset Metadata
                </button>
              </div>
            )}
            {profile?.registrationType === "organisation" && providerDatasets.length > 0 ? (
              <button onClick={() => setShowDatasetManager(true)} className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Added Dataset Details
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {showRequestsModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-4xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Provider request queue</h3>
                <p className="mt-1 text-sm text-slate-500">Approve or reject access requests for your datasets.</p>
              </div>
              <button onClick={() => setShowRequestsModal(false)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
            </div>
            <div className="mt-6 space-y-4">
              {providerRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-700">
                      <tr>
                        <th className="px-4 py-3">Dataset</th>
                        <th className="px-4 py-3">Requester</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {providerRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-4 py-4 font-semibold text-slate-900">{request.datasetName}</td>
                          <td className="px-4 py-4 text-slate-600">{request.username}</td>
                          <td className="px-4 py-4 text-slate-600">{request.requestType}</td>
                          <td className="px-4 py-4 text-slate-600">{request.status}</td>
                          <td className="px-4 py-4 space-x-2">
                            <button onClick={() => handleRequestStatus(request.id, "Approved")} className="rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                              Approve
                            </button>
                            <button onClick={() => handleRequestStatus(request.id, "Rejected")} className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-800">
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                  <p className="text-lg font-semibold text-slate-900">No pending requests yet.</p>
                  <p className="mt-2">Requests will appear here once consumers submit them for your datasets.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showAddDatasetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Add or update dataset metadata</h3>
                <p className="mt-1 text-sm text-slate-500">Create provider dataset details that will appear to all users.</p>
              </div>
              <button onClick={() => { setShowAddDatasetModal(false); setSelectedDataset(null); setDatasetForm(initialDatasetForm); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  <span>Name</span>
                  <input value={datasetForm.name} onChange={(event) => handleDatasetInput("name", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
                <label className="block text-sm text-slate-700">
                  <span>Access type</span>
                  <select value={datasetForm.accessType} onChange={(event) => handleDatasetInput("accessType", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                    <option value="public">Public</option>
                    <option value="protected">Protected</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  <span>Author</span>
                  <input value={datasetForm.author} onChange={(event) => handleDatasetInput("author", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
                <label className="block text-sm text-slate-700">
                  <span>Institution</span>
                  <input value={datasetForm.institution} onChange={(event) => handleDatasetInput("institution", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  <span>Department</span>
                  <input value={datasetForm.department} onChange={(event) => handleDatasetInput("department", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
                <label className="block text-sm text-slate-700">
                  <span>Publication date</span>
                  <input type="date" value={datasetForm.publicationDate} onChange={(event) => handleDatasetInput("publicationDate", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
              </div>
              <label className="block text-sm text-slate-700">
                <span>Dataset description</span>
                <textarea value={datasetForm.description} onChange={(event) => handleDatasetInput("description", event.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  <span>File type</span>
                  <input value={datasetForm.fileType} onChange={(event) => handleDatasetInput("fileType", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
                <label className="block text-sm text-slate-700">
                  <span>License</span>
                  <input value={datasetForm.license} onChange={(event) => handleDatasetInput("license", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                </label>
              </div>
              <label className="block text-sm text-slate-700">
                <span>Tags</span>
                <input value={datasetForm.tags} onChange={(event) => handleDatasetInput("tags", event.target.value)} placeholder="comma separated tags" className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
              </label>
              <button onClick={handleSaveDataset} className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                {selectedDataset ? "Update dataset" : "Save dataset metadata"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDatasetManager ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Added Dataset Details</h3>
                <p className="mt-1 text-sm text-slate-500">View and manage datasets you have uploaded as a provider.</p>
              </div>
              <button onClick={() => setShowDatasetManager(false)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
              <div className="space-y-4">
                {providerDatasets.length > 0 ? (
                  providerDatasets.map((dataset) => (
                    <button
                      key={dataset.id}
                      type="button"
                      onClick={() => handleSelectDataset(dataset)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <p className="font-semibold text-slate-900">{dataset.name}</p>
                      <p className="text-xs text-slate-500">{dataset.accessType} • {dataset.fileType}</p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">No datasets added yet.</div>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                {selectedDataset ? (
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                      <p className="text-sm text-slate-500">Selected dataset</p>
                      <h4 className="mt-2 text-xl font-semibold text-slate-900">{selectedDataset.name}</h4>
                      <p className="mt-2 text-sm text-slate-600">{selectedDataset.description}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Consent</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{selectedDataset.consentStatus}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Expiry</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{selectedDataset.expiryDate || "Not set"}</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <label className="block text-sm text-slate-700">
                        <span>Expiry date</span>
                        <input type="date" value={datasetForm.expiryDate} onChange={(event) => handleDatasetInput("expiryDate", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        <span>Consent status</span>
                        <select value={datasetForm.consentStatus} onChange={(event) => handleDatasetInput("consentStatus", event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                          <option value="Active">Active</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button onClick={handleUpdateDataset} className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                          Save updates
                        </button>
                        <button onClick={handleWithdrawConsent} className="inline-flex w-full items-center justify-center rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
                          Withdraw consent
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Select a dataset to view or manage its consent details.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
