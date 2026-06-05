"use client";

import { useState } from "react";

export default function ResourceServerForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    cos: "",
    owner: "",
    resourceServerRegURL: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      "@context": "https://voc.iudx.org.in/",
      type: ["iudx:ResourceServer"],
      name: form.name,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()),
      cos: form.cos,
      owner: form.owner,
      resourceServerRegURL: form.resourceServerRegURL,

      resourceServerOrg: {
        name: "iudx",
        additionalInfoURL: "https://iudx.org.in",
        location: {}
      },

      location: {
        type: "Place",
        address: "IISc, Bangalore",
        geometry: {}
      },

      resourceAccessModalities: []
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8082/api/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed");

      alert("Resource Server created successfully");
      console.log(data);

    } catch (err) {
      console.error(err);
      alert("Error creating Resource Server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* CONTEXT */}
      <div>
        <label className="label">Context</label>
        <input
          value="https://voc.iudx.org.in/"
          disabled
          className="input-disabled"
        />
      </div>

      {/* TYPE */}
      <div>
        <label className="label">Type</label>
        <input
          value="iudx:ResourceServer"
          disabled
          className="input-disabled"
        />
      </div>

      {/* NAME */}
      <div>
        <label className="label">Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input"
          placeholder="Enter resource server name"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="label">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
          placeholder="Enter description"
        />
      </div>

      {/* TAGS */}
      <div>
        <label className="label">Tags (comma separated)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="input"
          placeholder="IUDX, Resource, Server"
        />
      </div>

      {/* COS */}
      <div>
        <label className="label">COS UUID *</label>
        <input
          name="cos"
          value={form.cos}
          onChange={handleChange}
          className="input"
          placeholder="Enter COS UUID"
        />
      </div>

      {/* OWNER */}
      <div>
        <label className="label">Owner UUID *</label>
        <input
          name="owner"
          value={form.owner}
          onChange={handleChange}
          className="input"
          placeholder="Enter Owner UUID"
        />
      </div>

      {/* REG URL */}
      <div>
        <label className="label">Registration URL *</label>
        <input
          name="resourceServerRegURL"
          value={form.resourceServerRegURL}
          onChange={handleChange}
          className="input"
          placeholder="example.iudx.io"
        />
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
      >
        {loading ? "Creating..." : "Create Resource Server"}
      </button>

      {/* STYLES */}
      <style jsx>{`
        .label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .input-disabled {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </form>
  );
}