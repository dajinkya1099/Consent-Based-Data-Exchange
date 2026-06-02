"use client";

import { useState } from "react";

export default function FollowStatusPage() {

  const [id, setId] = useState("");
  const [apikey, setApikey] = useState("");
  const [entity, setEntity] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFetchStatus = async () => {

    setLoading(true);
    setError("");
    setResponse(null);

    try {

      const query = new URLSearchParams({
        id,
        apikey,
        entity,
      });

      const res = await fetch(
        `/api/follow-status?${query.toString()}`
      );

      const data = await res.json();

      console.log("FOLLOW STATUS RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch follow status");
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

      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow">

        <h1 className="text-xl font-bold">
          Follow Status
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
            placeholder="Entity (optional for owner API)"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handleFetchStatus}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 p-3 text-white"
          >
            {loading ? "Fetching..." : "Get Follow Status"}
          </button>

        </div>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {response && (
          <div className="mt-6 overflow-auto">

            <table className="w-full border-collapse border">

              <thead className="bg-slate-200">

                <tr>
                  <th className="border p-2">Follow ID</th>
                  <th className="border p-2">From</th>
                  <th className="border p-2">To</th>
                  <th className="border p-2">Permission</th>
                  <th className="border p-2">Topic</th>
                  <th className="border p-2">Validity</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Time</th>
                </tr>

              </thead>

              <tbody>

                {response.map((item: any, index: number) => (

                  <tr key={index}>

                    <td className="border p-2">
                      {item["follow-id"]}
                    </td>

                    <td className="border p-2">
                      {item.from}
                    </td>

                    <td className="border p-2">
                      {item.to}
                    </td>

                    <td className="border p-2">
                      {item.permission}
                    </td>

                    <td className="border p-2">
                      {item.topic}
                    </td>

                    <td className="border p-2">
                      {item.validity}
                    </td>

                    <td className="border p-2">
                      {item.status}
                    </td>

                    <td className="border p-2">
                      {item.time}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}