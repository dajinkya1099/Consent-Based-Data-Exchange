import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export const verifyAadhaar = async (aadhaar_number: string) => {
  const response = await axios.post(`${BASE_URL}/verify/aadhaar`, { aadhaar_number });
  return response.data;
};

export const verifyOtp = async (contact_type: "email" | "mobile", contact: string, otp: string) => {
  const response = await axios.post(`${BASE_URL}/verify/otp`, { contact_type, contact, otp });
  return response.data;
};

export const validateOrganisationDocument = async (document_type: string, registration_number: string) => {
  const response = await axios.post(`${BASE_URL}/verify/organisation-document`, {
    document_type,
    registration_number,
  });
  return response.data;
};

export const submitConsentRequest = async (payload: {
  dataset_id: string;
  dataset_name: string;
  access_type: string;
  request_type: string;
  purpose: string[];
  agreed_to_terms: boolean;
  requester_email?: string;
}) => {
  const response = await axios.post(`${BASE_URL}/consent/requests`, payload);
  return response.data;
};
