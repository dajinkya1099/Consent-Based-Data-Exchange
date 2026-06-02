"use client";

import { useState } from "react";
import Link from "next/link";

type RegisterOwnerResponse = {
  id: string;
  apikey: string;
};

export default function RegisterOwnerPage() {
  // Input state
  const [owner, setOwner] = useState("");

  // Loading state
  const [loading, setLoading] =
    useState(false);

  // Error state
  const [error, setError] = useState("");

  // Success response state
  const [responseData, setResponseData] =
    useState<RegisterOwnerResponse | null>(
      null
    );

  // Form submit function
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      // Start loading
      setLoading(true);

      // Clear previous states
      setError("");
      setResponseData(null);

      // Validation
      if (!owner.trim()) {
        setError("Owner name is required");
        return;
      }

      // Call API route
      const response = await fetch(
        "/api/register-owner",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            owner: owner.trim(),
          }),
        }
      );

      // Parse JSON response
      const data = await response.json();

      // Handle errors
      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to register owner"
        );
      }

      // Store success response
      setResponseData(data);

      // Clear input
      setOwner("");
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong"
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Register Owner
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create owner using Kore
            Publisher API
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* OWNER INPUT */}
          <div className="space-y-2">

            <label className="block text-sm font-medium text-slate-700">
              Owner Name
            </label>

            <input
              type="text"
              placeholder="Enter owner name"
              value={owner}
              onChange={(e) =>
                setOwner(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Owner..."
              : "Create Owner"}
          </button>

        </form>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* SUCCESS RESPONSE */}
        {responseData && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">

            <h2 className="mb-4 text-lg font-semibold text-green-700">
              Owner Created Successfully
            </h2>

            <div className="space-y-4">

              {/* OWNER ID */}
              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Owner ID
                </p>

                <div className="mt-1 rounded-xl bg-white p-3 text-sm font-medium text-slate-900 shadow-sm">
                  {responseData.id}
                </div>

              </div>

              {/* API KEY */}
              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  API Key
                </p>

                <div className="mt-1 break-all rounded-xl bg-white p-3 text-sm font-medium text-slate-900 shadow-sm">
                  {responseData.apikey}
                </div>

              </div>

            </div>

            {/* NAVIGATE TO ENTITY REGISTRATION */}
            <div className="mt-6">
              <Link
                href={`/register-owner/entity-registration?ownerId=${encodeURIComponent(
                  responseData.id
                )}&apikey=${encodeURIComponent(responseData.apikey)}`}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Register Entities for this Owner
              </Link>
            </div>

          </div>
        )}

      </div>

    </main>
  );
}