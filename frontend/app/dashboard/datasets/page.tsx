"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DatasetItem, getAllDatasets } from "../../../lib/dataStore";

const accessOptions = ["all", "public", "protected"] as const;
const sortOptions = ["Newest", "Oldest"] as const;

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [authorFilter, setAuthorFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof accessOptions[number]>("all");
  const [sortBy, setSortBy] = useState<typeof sortOptions[number]>("Newest");

  useEffect(() => {
    setDatasets(getAllDatasets());
  }, []);

  const fileTypes = useMemo(() => {
    return Array.from(new Set(datasets.map((item) => item.fileType))).sort();
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    return datasets
      .filter((dataset) => {
        if (statusFilter !== "all" && dataset.accessType !== statusFilter) return false;
        if (authorFilter && !dataset.author.toLowerCase().includes(authorFilter.toLowerCase())) return false;
        if (institutionFilter && !dataset.institution.toLowerCase().includes(institutionFilter.toLowerCase())) return false;
        if (fileTypeFilter && dataset.fileType !== fileTypeFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Newest") return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        return new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime();
      });
  }, [datasets, authorFilter, institutionFilter, fileTypeFilter, statusFilter, sortBy]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Datasets</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Explore available datasets</h1>
              <p className="mt-3 text-slate-600">Filter by author, institution, file type, publication date and access status.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 px-4 py-3 text-sm text-white">{filteredDatasets.length} datasets found</div>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Author / Institution</span>
                <input
                  value={authorFilter}
                  onChange={(event) => setAuthorFilter(event.target.value)}
                  placeholder="Search author"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Institution</span>
                <input
                  value={institutionFilter}
                  onChange={(event) => setInstitutionFilter(event.target.value)}
                  placeholder="Search institution"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">File type</span>
                <select
                  value={fileTypeFilter}
                  onChange={(event) => setFileTypeFilter(event.target.value)}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">All file types</option>
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Access status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof accessOptions[number])}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  {accessOptions.map((status) => (
                    <option key={status} value={status}>{status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortOptions[number])}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  {sortOptions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredDatasets.map((dataset) => (
            <article key={dataset.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{dataset.accessType === "public" ? "Public dataset" : "Protected dataset"}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{dataset.name}</h2>
                  <p className="mt-3 text-sm text-slate-600">{dataset.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{dataset.fileType}</span>
                  <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{dataset.institution}</span>
                  <span className={`rounded-3xl px-4 py-2 text-sm font-semibold ${dataset.accessType === "public" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{dataset.accessType}</span>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Uploaded by</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{dataset.uploadedBy}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Department</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{dataset.department}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Published</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{dataset.publicationDate}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">License</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{dataset.license}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={`/dashboard/datasets/${dataset.id}`} className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  View dataset
                </Link>
                {dataset.accessType === "public" ? (
                  <span className="rounded-3xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">Download available</span>
                ) : (
                  <span className="rounded-3xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">Request access</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
