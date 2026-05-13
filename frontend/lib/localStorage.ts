export const STORAGE_KEYS = {
  individual: "consent-exchange-individual-registration",
  organisation: "consent-exchange-organisation-registration",
  userProfile: "consent-exchange-user-profile",
  userSession: "consent-exchange-user-session",
};

export const saveFormData = (key: string, data: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
};

export const loadFormData = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const clearFormData = (key: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};

export const saveUserProfile = (data: unknown) => saveFormData(STORAGE_KEYS.userProfile, data);
export const loadUserProfile = <T>() => loadFormData<T>(STORAGE_KEYS.userProfile);
export const clearUserProfile = () => clearFormData(STORAGE_KEYS.userProfile);

export const saveUserSession = (data: unknown) => saveFormData(STORAGE_KEYS.userSession, data);
export const loadUserSession = <T>() => loadFormData<T>(STORAGE_KEYS.userSession);
export const clearUserSession = () => clearFormData(STORAGE_KEYS.userSession);
