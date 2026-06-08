import DatasetCard from "./DatasetCard";
import type { Dataset } from "../types/dataset.types";

interface DatasetListProps {
  datasets: Dataset[];
}

export default function DatasetList({ datasets }: DatasetListProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {datasets.map((dataset, index) => (
        <DatasetCard key={dataset.id || `${dataset.name || dataset.dataset || "dataset"}-${index}`} dataset={dataset} />
      ))}
    </section>
  );
}
