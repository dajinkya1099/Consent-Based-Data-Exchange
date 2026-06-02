"use client";

import { useState } from "react";

export default function BindPage() {

    const [id, setId] = useState("");
    const [apikey, setApikey] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [topic, setTopic] = useState("data");
    const [messageType, setMessageType] = useState("protected");

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState("");

    const handleBind = async () => {

        setLoading(true);
        setError("");
        setResponse(null);

        try {

            const res = await fetch("/api/bind", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    apikey,
                    to,
                    topic,
                    messageType,
                    from,
                }),
            });

            const data = await res.json();

            console.log("BIND RESPONSE:", data);

            if (!res.ok) {
                throw new Error(data?.error || "Bind failed");
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

                <h1 className="text-xl font-bold">Bind Queue to Exchange</h1>

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
                        placeholder="To Device"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                    <input
                        placeholder="Topic (e.g. temperature, logs)"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                    <input
                        placeholder="From (your device id)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                    <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    >
                        <option value="public">public</option>
                        <option value="protected">protected</option>
                        <option value="private">private</option>
                        <option value="diagnostics">diagnostics</option>
                    </select>

                    <button
                        onClick={handleBind}
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 p-3 text-white"
                    >
                        {loading ? "Binding..." : "Bind"}
                    </button>

                </div>

                {error && (
                    <p className="mt-4 text-red-600">{error}</p>
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