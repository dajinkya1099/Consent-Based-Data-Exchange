export interface Dataset {
  id?: string;
  dataset?: string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
  datasetDescription?: string;
  owner?: string;
  provider?: string;
  datasetOwner?: string;
  category?: string;
  domain?: string;
  resourceType?: string;
  status?: string;
  datasetStatus?: string;
  accessPolicy?: string;
  createdAt?: string;
  itemCreatedAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
  modifiedAt?: string;
}

export interface DatasetApiResponse {
  results?: Dataset[];
  data?: Dataset[];
  datasets?: Dataset[];
  items?: Dataset[];
  hits?: {
    hits?: Array<{
      _source?: Dataset;
    }>;
  };
}
