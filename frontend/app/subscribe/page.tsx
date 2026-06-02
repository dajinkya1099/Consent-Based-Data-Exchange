"use client";

import { useState } from "react";

export default function SubscribePage() {

  const [id, setId] = useState("");
  const [apikey, setApikey] = useState("");

  const [messageType, setMessageType] = useState("");
  const [numMessages, setNumMessages] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {

    setLoading(true);
    setError("");
    setResponse(null);

    try {

      const query = new URLSearchParams();

      query.append("id", id);
      query.append("apikey", apikey);

      // optional params only if provided
      if (messageType) {
        query.append("messageType", messageType);
      }

      if (numMessages) {
        query.append("numMessages", numMessages);
      }

      const res = await fetch(
        `/api/subscribe?${query.toString()}`
      );

      const data = await res.json();

      console.log("SUBSCRIBE RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Subscribe failed");
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

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">

        <h1 className="text-xl font-bold">
          Subscribe Messages
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

          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="">(default queue)</option>
            <option value="priority">priority</option>
            <option value="command">command</option>
            <option value="notification">notification</option>
          </select>

          <input
            placeholder="Number of messages (default: 10)"
            value={numMessages}
            onChange={(e) => setNumMessages(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 p-3 text-white"
          >
            {loading ? "Fetching..." : "Subscribe"}
          </button>

        </div>

        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}

        {response && (
          <div className="mt-6 space-y-4">

            {response.map((msg: any, index: number) => (

              <div
                key={index}
                className="rounded-xl border bg-slate-50 p-4"
              >

                <p><b>Sent By:</b> {msg["sent-by"]}</p>
                <p><b>From:</b> {msg.from}</p>
                <p><b>Subject:</b> {msg.subject}</p>
                <p><b>Content-Type:</b> {msg["content-type"]}</p>

                <pre className="mt-2 rounded bg-white p-2 text-sm">
                  {JSON.stringify(msg.body, null, 2)}
                </pre>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}