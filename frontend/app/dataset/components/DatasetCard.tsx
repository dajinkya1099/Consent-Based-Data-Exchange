import type { Dataset } from "../types/dataset.types";

interface DatasetCardProps {
  dataset: Dataset;
}

function getText(value?: unknown) {
  if (typeof value === "string") {
    return value.trim() ? value : "-";
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  console.log("DatasetCard dataset:", dataset);
  const datasetName = dataset.dataset || dataset.name || dataset.label || dataset.title;
  const description = dataset.description || dataset.datasetDescription;
  const owner = dataset.owner || dataset.provider || dataset.datasetOwner;
  const category = dataset.category || dataset.domain || dataset.resourceType;
  const status =
  typeof dataset.accessPolicy === "object" &&
  dataset.accessPolicy !== null
    ? dataset.accessPolicy.SECURE > 0
      ? "Private"
      : dataset.accessPolicy.OPEN > 0
      ? "Public"
      : "-"
    : dataset.status ||
      dataset.datasetStatus ||
      dataset.accessPolicy;
  const createdDate = dataset.createdAt || dataset.itemCreatedAt;
  const updatedDate = dataset.updatedAt || dataset.lastUpdated || dataset.modifiedAt;

  return (
    <article className="rounded-2xl bg-sky-100 border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Dataset Name</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{getText(datasetName)}</h2>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dataset Description</p>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{getText(description)}</p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-500">Dataset Owner</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{getText(owner)}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-500">Dataset Category</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{getText(category)}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-500">Dataset Status</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{getText(status)}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-500">Created Date</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{getText(createdDate)}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
          <dt className="text-xs font-medium text-slate-500">Updated Date</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{getText(updatedDate)}</dd>
        </div>
      </dl>
    </article>
  );
}
