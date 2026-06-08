export async function getAllDatasets() {
  const response = await fetch(
    "http://localhost:8082/api/internal/ui/dataset"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch datasets");
  }

  return response.json();
}
