"use client";

import { useState } from "react";

export default function CreateProviderForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    resourceServer: "",
    providerUserId: "",
    cos: "",
    orgName: "",
    orgURL: "",
    orgType: "",
    orgAddress: "",
    lat: "",
    lon: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      "@context": "https://voc.iudx.org.in/",
      type: ["iudx:Provider"],

      name: form.name,
      description: form.description,
      resourceServer: form.resourceServer,
      providerUserId: form.providerUserId,
      cos: form.cos,

      providerOrg: {
        name: form.orgName,
        additionalInfoURL: form.orgURL,
        location: {
          type: form.orgType,
          address: form.orgAddress,
          geometry: {
            type: "Point",
            coordinates: [Number(form.lon), Number(form.lat)],
          },
        },
      },
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

      if (!res.ok) throw new Error(data.detail || "Failed");

      alert("Provider created successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Context */}
      <div>
        <label className={labelClass}>Context</label>
        <input
          disabled
          value="https://voc.iudx.org.in/"
          className={inputClass + " bg-slate-50 text-slate-500"}
        />
      </div>

      {/* Type */}
      <div>
        <label className={labelClass}>Type</label>
        <input
          disabled
          value="iudx:Provider"
          className={inputClass + " bg-slate-50 text-slate-500"}
        />
      </div>

      {/* Name */}
      <div>
        <label className={labelClass}>Provider Name *</label>
        <input
          name="name"
          placeholder="Enter provider name"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          placeholder="Enter description"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Resource Server */}
      <div>
        <label className={labelClass}>Resource Server UUID *</label>
        <input
          name="resourceServer"
          placeholder="UUID"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Provider User */}
      <div>
        <label className={labelClass}>Provider User UUID *</label>
        <input
          name="providerUserId"
          placeholder="UUID"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* COS */}
      <div>
        <label className={labelClass}>COS UUID *</label>
        <input
          name="cos"
          placeholder="COS UUID"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      <div className="border-t pt-4 font-semibold text-slate-800">
        Provider Organization
      </div>

      {/* Org Name */}
      <div>
        <label className={labelClass}>Organization Name *</label>
        <input
          name="orgName"
          placeholder="Datakaveri"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Org URL */}
      <div>
        <label className={labelClass}>Additional Info URL *</label>
        <input
          name="orgURL"
          placeholder="https://datakaveri.org"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Org Type */}
      <div>
        <label className={labelClass}>Location Type *</label>
        <input
          name="orgType"
          placeholder="Place"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>Address *</label>
        <input
          name="orgAddress"
          placeholder="Full address"
          className={inputClass}
          onChange={handleChange}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Latitude *</label>
          <input
            name="lat"
            className={inputClass}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelClass}>Longitude *</label>
          <input
            name="lon"
            className={inputClass}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-800 px-6 py-3 font-semibold text-white shadow-lg"
      >
        {loading ? "Creating..." : "Create Provider"}
      </button>
    </form>
  );
}