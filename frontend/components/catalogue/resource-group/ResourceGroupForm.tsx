"use client";

import { useState } from "react";

export default function ResourceGroupForm() {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      "@context": "https://voc.iudx.org.in/",
      type: ["iudx:ResourceGroup", "iudx:IssueReporting"],
      name,
      description,
      provider,
      tags: tags.split(",").map((t) => t.trim()),
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/iudx/cat/v1/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create ResourceGroup");
      }

      alert("Resource Group created successfully");

      setName("");
      setDescription("");
      setProvider("");
      setTags("");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

     

      {/* CONTEXT */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          @context
        </label>
        <input
          value="https://voc.iudx.org.in/"
          disabled
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
        />
      </div>

      {/* TYPE */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Type
        </label>
        <input
          value="iudx:ResourceGroup, iudx:IssueReporting"
          disabled
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
        />
      </div>

      {/* NAME */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter resource group name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* PROVIDER */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Provider UUID *
        </label>
        <input
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Enter provider UUID"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* TAGS */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Tags (comma separated)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="swachhata, garbage, complaint"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-800 py-3 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Resource Group"}
      </button>
    </form>
  );
}