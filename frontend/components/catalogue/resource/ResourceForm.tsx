"use client";

import { useState } from "react";

export default function CreateResourceForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    provider: "",
    resourceGroup: "",
    resourceServer: "",
    apdURL: "",
    accessPolicy: "SECURE",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      "@context": "https://voc.iudx.org.in/",
      type: ["iudx:Resource", "iudx:PointOfInterest"],
      name: form.name,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()),
      provider: form.provider,
      resourceGroup: form.resourceGroup,
      resourceServer: form.resourceServer,
      apdURL: form.apdURL,
      accessPolicy: form.accessPolicy,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

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

      alert("Resource created successfully");

      setForm({
        name: "",
        description: "",
        tags: "",
        provider: "",
        resourceGroup: "",
        resourceServer: "",
        apdURL: "",
        accessPolicy: "SECURE",
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter resource name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter description"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Tags (comma separated)
        </label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="WiFi, hotspot, internet"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Provider */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Provider UUID *
        </label>
        <input
          name="provider"
          value={form.provider}
          onChange={handleChange}
          placeholder="Provider UUID"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Resource Group */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Resource Group UUID *
        </label>
        <input
          name="resourceGroup"
          value={form.resourceGroup}
          onChange={handleChange}
          placeholder="Resource Group UUID"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Resource Server */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Resource Server UUID *
        </label>
        <input
          name="resourceServer"
          value={form.resourceServer}
          onChange={handleChange}
          placeholder="Resource Server UUID"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* APD URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          APD URL *
        </label>
        <input
          name="apdURL"
          value={form.apdURL}
          onChange={handleChange}
          placeholder="rs.apd.iudx.org.in"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Access Policy */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Access Policy *
        </label>
        <input
          name="accessPolicy"
          value={form.accessPolicy}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-800 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Resource"}
      </button>
    </form>
  );
}