"use client";

import { useState } from "react";

export default function SharePage() {

  const [id, setId] = useState("");
  const [apikey, setApikey] = useState("");
  const [followId, setFollowId] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleShare = async () => {

    setLoading(true);
    setError("");
    setResponse(null);

    try {

      const res = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          apikey,
          followId,
        }),
      });

      const data = await res.json();

      console.log("SHARE RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Share request failed");
      }

      setResponse(data);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">

        <h1 className="text-xl font-bold">
          Approve Follow Request
        </h1>

        <div className="mt-4 space-y-3">

          <input
            placeholder="ID (e.g. company/device-01)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="API Key"
            value={apikey}
            onChange={(e) => setApikey(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Follow ID"
            value={followId}
            onChange={(e) => setFollowId(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handleShare}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 p-3 text-white"
          >
            {loading ? "Approving..." : "Approve Follow Request"}
          </button>

        </div>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {response && (
          <pre className="mt-4 rounded-xl bg-slate-100 p-3 text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}

      </div>

    </div>
  );
}