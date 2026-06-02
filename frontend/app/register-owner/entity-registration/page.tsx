"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function EntityRegistrationPage() {
  const searchParams = useSearchParams();

  const ownerId = searchParams.get("ownerId") || "";
  const apikey = searchParams.get("apikey") || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [backendResponse, setBackendResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!ownerId) {
      setError("Missing owner information.");
      return;
    }

    if (!name.trim()) {
      setError("Entity name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register-entity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId,
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();
      setBackendResponse(data);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to register entity");
      }
console.log("REGISTER ENTITY API RESPONSE:", data);
      setSuccess(data?.message || "Entity registered successfully.");
      setName("");
      setDescription("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to register entity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Entity Registration</h1>

        <p className="mt-2 text-sm text-slate-500">
          Register entities for the owner below. The response from the owner registration is shown for reference.
        </p>

        {/* Owner Info */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Owner ID</p>
          <div className="mt-1 rounded-xl bg-white p-3 text-sm font-medium text-slate-900 shadow-sm">{ownerId || "-"}</div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">API Key</p>
          <div className="mt-1 break-all rounded-xl bg-white p-3 text-sm font-medium text-slate-900 shadow-sm">{apikey || "-"}</div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Entity Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              placeholder="Enter entity name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              placeholder="Short description"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Entity"}
            </button>

            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Add Another
            </button>
            
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-600">{success}</p>
          </div>
        )}
        {backendResponse && (
  <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
    <h2 className="text-sm font-semibold text-slate-700">
      Backend Response
    </h2>

    <p className="mt-2 text-sm">
      <b>ID:</b> {backendResponse.id}
    </p>

    <p className="text-sm break-all">
      <b>API Key:</b> {backendResponse.apikey}
    </p>
  </div>
)}
<div className="mt-6">
  <Link
    href="/view-entities"
    className="inline-block rounded-xl bg-purple-600 px-5 py-3 text-white"
  >
    View Entities
  </Link>
</div>
      </div>
    </main>
  );
}
