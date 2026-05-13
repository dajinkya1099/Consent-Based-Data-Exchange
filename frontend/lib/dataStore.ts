export type DatasetAccessType = "public" | "protected";
export type RequestType = "individual" | "organisation";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface DatasetItem {
  id: string;
  name: string;
  accessType: DatasetAccessType;
  description: string;
  author: string;
  institution: string;
  fileType: string;
  publicationDate: string;
  uploadedBy: string;
  organisationType: string;
  department: string;
  lastUpdated: string;
  license: string;
  tags: string[];
}

export interface ConsentRequestItem {
  id: string;
  datasetId: string;
  datasetName: string;
  accessType: DatasetAccessType;
  requestType: RequestType;
  purpose: string[];
  agreedToTerms: boolean;
  requesterEmail?: string;
  status: RequestStatus;
  username: string;
  createdAt: string;
}

export interface ProviderDatasetItem extends DatasetItem {
  consentStatus: "Active" | "Withdrawn";
  expiryDate?: string;
}

const DATASETS_KEY = "consent-exchange-datasets";
const REQUESTS_KEY = "consent-exchange-requests";
const PROVIDER_DATASETS_KEY = "consent-exchange-provider-datasets";

const DEFAULT_DATASETS: DatasetItem[] = [
  {
    id: "ds-001",
    name: "Open Demographics",
    accessType: "public",
    description: "A public demographics dataset suitable for analytics, R&D, and academic experimentation.",
    author: "Open Data Trust",
    institution: "Global Data Commons",
    fileType: "CSV",
    publicationDate: "2024-08-12",
    uploadedBy: "Open Data Trust",
    organisationType: "Public",
    department: "Statistics",
    lastUpdated: "2024-10-01",
    license: "CC BY 4.0",
    tags: ["demographics", "public", "analytics"],
  },
  {
    id: "ds-002",
    name: "Protected Health Signals",
    accessType: "protected",
    description: "A protected health dataset with sensitive signals and metadata requiring consent for access.",
    author: "HealthGov Research",
    institution: "HealthGov",
    fileType: "JSON",
    publicationDate: "2024-09-05",
    uploadedBy: "HealthGov",
    organisationType: "Protected",
    department: "Medical Research",
    lastUpdated: "2025-01-20",
    license: "Restricted Use",
    tags: ["health", "protected", "research"],
  },
  {
    id: "ds-003",
    name: "Protected Financial Insights",
    accessType: "protected",
    description: "A protected financial dataset for business intelligence and regulatory research.",
    author: "FinanceLabs",
    institution: "FinanceLabs",
    fileType: "PDF",
    publicationDate: "2025-02-15",
    uploadedBy: "FinanceLabs",
    organisationType: "Protected",
    department: "Finance",
    lastUpdated: "2025-03-08",
    license: "Restricted Use",
    tags: ["finance", "protected", "analytics"],
  },
  {
    id: "ds-004",
    name: "Global Energy Consumption",
    accessType: "public",
    description: "A public dataset containing global energy consumption and emissions trends.",
    author: "EnergyWatch",
    institution: "EnergyWatch",
    fileType: "CSV",
    publicationDate: "2024-12-11",
    uploadedBy: "EnergyWatch",
    organisationType: "Public",
    department: "Environmental Studies",
    lastUpdated: "2025-01-15",
    license: "CC BY 4.0",
    tags: ["energy", "public", "sustainability"],
  },
];

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const loadFromStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  return safeParse<T>(window.localStorage.getItem(key));
};

const saveToStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getProviderDatasets = (): ProviderDatasetItem[] => {
  return loadFromStorage<ProviderDatasetItem[]>(PROVIDER_DATASETS_KEY) ?? [];
};

export const getAllDatasets = (): DatasetItem[] => {
  return [...DEFAULT_DATASETS, ...getProviderDatasets()];
};

export const getDatasetById = (id: string): DatasetItem | undefined => {
  return getAllDatasets().find((item) => item.id === id);
};

export const getRequests = (): ConsentRequestItem[] => {
  return loadFromStorage<ConsentRequestItem[]>(REQUESTS_KEY) ?? [];
};

export const getUserRequests = (username: string): ConsentRequestItem[] => {
  return getRequests().filter((request) => request.username === username);
};

export const getRequestsForProvider = (organisationName: string): ConsentRequestItem[] => {
  const datasets = getAllDatasets();
  const providerDatasetIds = datasets.filter((dataset) => dataset.uploadedBy === organisationName).map((dataset) => dataset.id);
  return getRequests().filter((request) => providerDatasetIds.includes(request.datasetId));
};

export const createConsentRequest = (username: string, payload: Omit<ConsentRequestItem, "id" | "status" | "createdAt">) => {
  const current = getRequests();
  const id = `req-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const request: ConsentRequestItem = {
    id,
    status: "Pending",
    createdAt,
    ...payload,
    username,
  };
  saveToStorage(REQUESTS_KEY, [...current, request]);
  return request;
};

export const updateRequestStatus = (requestId: string, status: RequestStatus) => {
  const requests = getRequests();
  const updated = requests.map((request) => (request.id === requestId ? { ...request, status } : request));
  saveToStorage(REQUESTS_KEY, updated);
  return updated.find((request) => request.id === requestId);
};

export const saveProviderDataset = (dataset: ProviderDatasetItem) => {
  const current = getProviderDatasets();
  const existingIndex = current.findIndex((item) => item.id === dataset.id);
  const updated = existingIndex >= 0 ? current.map((item) => (item.id === dataset.id ? dataset : item)) : [...current, dataset];
  saveToStorage(PROVIDER_DATASETS_KEY, updated);
  return dataset;
};

export const getProviderDatasetsByOwner = (owner: string): ProviderDatasetItem[] => {
  return getProviderDatasets().filter((dataset) => dataset.uploadedBy === owner);
};

export const getRequestById = (requestId: string): ConsentRequestItem | undefined => {
  return getRequests().find((request) => request.id === requestId);
};
