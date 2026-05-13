"use client";

interface UserProfile {
  registrationType: "individual" | "organisation";
  organisationName?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonMobile?: string;
  email?: string;
  aadhaarNumber?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  addressLine1?: string;
  documentType?: string;
  registrationNumber?: string;
  organisationAddress?: string;
  secondaryContactName?: string;
  secondaryContactEmail?: string;
  secondaryContactMobile?: string;
  username?: string;
  aadhaarVerified?: boolean;
  mobileVerified?: boolean;
  documentValidated?: boolean;
}

interface ProfilePanelProps {
  isOpen: boolean;
  profile: UserProfile | null;
  completion: number;
  onClose: () => void;
  onVerifyMobile: () => void;
  onVerifyAadhaar: () => void;
}

export function ProfilePanel({ isOpen, profile, completion, onClose, onVerifyMobile, onVerifyAadhaar }: ProfilePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
      <div className="m-4 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
            <p className="text-sm text-slate-500">Review saved registration data and verification state.</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Profile Completion</p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-sky-600" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{completion}%</p>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">Verification Status</p>
            <p className="text-sm text-slate-600">Aadhaar: {profile?.aadhaarVerified ? "Verified" : "Not verified"}</p>
            <p className="text-sm text-slate-600">Mobile: {profile?.mobileVerified ? "Verified" : "Not verified"}</p>
            {!profile?.mobileVerified ? (
              <button onClick={onVerifyMobile} className="mt-3 inline-flex rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                Verify Mobile
              </button>
            ) : null}
            {!profile?.aadhaarVerified ? (
              <button onClick={onVerifyAadhaar} className="mt-3 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                Verify Aadhaar
              </button>
            ) : null}
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-6">
          <h3 className="text-sm font-semibold text-slate-900">Saved Details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profile ? Object.entries(profile).map(([key, value]) => {
              if (value === undefined || key === "registrationType") return null;
              return (
                <div key={key} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{String(value)}</p>
                </div>
              );
            }) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
