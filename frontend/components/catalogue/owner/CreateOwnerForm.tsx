"use client";

import { useState } from "react";

export default function CreateOwnerForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const payload = {
            "@context": "https://voc.iudx.org.in/",
            type: ["iudx:Owner"],
            name,
            description,
        };

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            console.log("token", token);

            const response = await fetch(
                "http://localhost:8082/api/item",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token || "",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Non-JSON response: ${text}`);
            }

            if (!response.ok) {
                throw new Error(data.detail || data.title || "Request failed");
            }

            console.log("Success:", data);

            alert("Owner created successfully");

            setName("");
            setDescription("");
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Context */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Context
                </label>

                <input
                    value="https://voc.iudx.org.in/"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
            </div>

            {/* Type */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type
                </label>

                <input
                    value="iudx:Owner"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
            </div>

            {/* Name */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name *
                </label>

                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter owner name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
            </div>

            {/* Description */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description *
                </label>

                <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-800 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Owner"}
            </button>
        </form>
    );
}