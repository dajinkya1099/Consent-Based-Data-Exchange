"use client";

import { useState } from "react";

export default function PublishPage() {
  const [id, setId] = useState("");
  const [apikey, setApikey] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("data");
  const [messageType, setMessageType] = useState("protected");

  const [ambientLux, setAmbientLux] = useState("");
  const [power, setPower] = useState("");
  const [caseTemp, setCaseTemp] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          apikey,
          to,
          subject,
          messageType,
          data: {
            ambientLux,
            power,
            caseTemp,
          },
        }),
      });

      const data = await res.json();

      console.log("PUBLISH RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Publish failed");
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

        <h1 className="text-xl font-bold">Publish Data</h1>

        <div className="mt-4 space-y-3">

          <input
            placeholder="ID (e.g. company/streetlight)"
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
            placeholder="To (e.g. company/streetlight)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Message Type"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <hr />

          <input
            placeholder="Ambient Lux"
            value={ambientLux}
            onChange={(e) => setAmbientLux(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Case Temperature"
            value={caseTemp}
            onChange={(e) => setCaseTemp(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 p-3 text-white"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>

        </div>

        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}

        {response && (
          <pre className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}

      </div>
    </div>
  );
}