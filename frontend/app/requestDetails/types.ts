export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface FormValues {
  name: string;
  email: string;
  dataset: string;
  resources: string;
  phone: string;
  purpose: string;
  duration: string;
  description: string;
  fileName: string;
}

export interface InputFieldProps {
  label: string;
  name: keyof FormValues;
  type?: string;
  value: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  onChange: (name: keyof FormValues, value: string) => void;
}

export interface TextAreaFieldProps {
  label: string;
  name: keyof FormValues;
  value: string;
  placeholder: string;
  maxLength: number;
  error?: string;
  onChange: (name: keyof FormValues, value: string) => void;
}

export interface UploadBoxProps {
  fileName: string;
  error?: string;
  onFileChange: (file: File | null) => void;
}
