"use client";

import { useState } from "react";

export default function ViewEntitiesPage() {
  const [ownerId, setOwnerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchEntities = async () => {
    setLoading(true);
    setError("");
    setEntities(null);

    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId,
        }),
      });

      const data = await res.json();

      console.log("ENTITIES RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch entities");
      }

      setEntities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">

        <h1 className="text-xl font-bold">View Entities</h1>

        {/* INPUT */}
        <input
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          placeholder="Enter Owner ID"
          className="mt-4 w-full rounded-xl border px-4 py-3"
        />

        <button
          onClick={fetchEntities}
          disabled={loading}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          {loading ? "Loading..." : "View Entities"}
        </button>

        {error && (
          <p className="mt-3 text-red-600">{error}</p>
        )}

        {/* OUTPUT */}
        {entities && (
          <div className="mt-6">
            <h2 className="font-semibold">Entities</h2>

            <pre className="mt-2 rounded-xl bg-slate-100 p-3 text-sm">
              {JSON.stringify(entities, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}