"use client";

import { useState } from "react";

export default function FollowPage() {
  const [id, setId] = useState("");
  const [apikey, setApikey] = useState("");
  const [to, setTo] = useState("");

  const [permission, setPermission] = useState("read");
  const [validity, setValidity] = useState("24");
  const [topic, setTopic] = useState("data");

  //const [messageType, setMessageType] = useState("protected");
  const [from, setFrom] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFollow = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          apikey,
          to,
          permission,
          validity,
          topic,
          messageType : "protected",
          from,
        }),
      });

      const data = await res.json();

      console.log("FOLLOW RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Follow request failed");
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
          Follow Request
        </h1>

        <div className="mt-4 space-y-3">

          <input
            placeholder="ID (e.g. company/device)"
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
            placeholder="To (target entity)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="read">read</option>
            <option value="write">write</option>
            <option value="read-write">read-write</option>
          </select>

          <input
            placeholder="Validity (hours)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Topic (e.g. data, alerts)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          {/* <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="command">command</option>
            <option value="diagnostics">diagnostics</option>
          </select> */}

          <input
            placeholder="From (optional)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handleFollow}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-3 text-white"
          >
            {loading ? "Sending Request..." : "Send Follow Request"}
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