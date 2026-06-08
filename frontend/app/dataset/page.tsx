"use client";

import { useEffect, useState } from "react";
import { DATASET_PAGE_DESCRIPTION, DATASET_PAGE_TITLE } from "./constants";
import DatasetList from "./components/DatasetList";
import EmptyState from "./components/EmptyState";
import ErrorMessage from "./components/ErrorMessage";
import Loading from "./components/Loading";
import { getAllDatasets } from "./services/datasetApi";
import type { Dataset, DatasetApiResponse } from "./types/dataset.types";

function normalizeDatasets(response: Dataset[] | DatasetApiResponse): Dataset[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.datasets)) {
    return response.datasets;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.hits?.hits)) {
    return response.hits.hits.map((hit) => hit._source).filter(Boolean) as Dataset[];
  }

  return [];
}

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDatasets() {
      try {
        setIsLoading(true);
        setError("");
        const response = await getAllDatasets();
        setDatasets(normalizeDatasets(response));
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch datasets");
        setDatasets([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadDatasets();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">{DATASET_PAGE_TITLE}</h1>
          <p className="mt-2 text-sm text-slate-600">{DATASET_PAGE_DESCRIPTION}</p>
        </header>

        {isLoading ? <Loading /> : null}
        {!isLoading && error ? <ErrorMessage message={error} /> : null}
        {!isLoading && !error && datasets.length === 0 ? <EmptyState /> : null}
        {!isLoading && !error && datasets.length > 0 ? <DatasetList datasets={datasets} /> : null}
      </div>
    </div>
  );
}
