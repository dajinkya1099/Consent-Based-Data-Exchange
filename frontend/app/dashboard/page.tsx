"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";


import { ProfilePanel } from "../../components/dashboard/ProfilePanel";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { DashboardCharts } from "../../components/dashboard/DashboardCharts";
import { loadUserProfile, saveUserProfile } from "../../lib/localStorage";

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

const stats = [
  { title: "Total Consents", value: 4280, subtitle: "Requests processed this month" },
  { title: "Active Datasets", value: 18, subtitle: "Connected sources" },
  { title: "Models Running", value: 5, subtitle: "Live analytics pipelines" },
  { title: "Pending Approvals", value: 12, subtitle: "Awaiting consent" },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = loadUserProfile<UserProfile>();
    if (storedProfile) setProfile(storedProfile);
  }, []);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const keys = profile.registrationType === "individual"
      ? ["email", "firstName", "lastName", "mobile", "addressLine1", "city", "state", "country", "username"]
      : ["organisationName", "contactPersonName", "contactPersonEmail", "contactPersonMobile", "documentType", "registrationNumber", "organisationAddress", "city", "state", "country", "secondaryContactName", "username"];

    const filled = keys.filter((key) => profile[key as keyof UserProfile]).length;
    return Math.round((filled / keys.length) * 100);
  }, [profile]);

  const handleVerifyMobile = () => {
    if (!profile) return;
    const updated = { ...profile, mobileVerified: true };
    saveUserProfile(updated);
    setProfile(updated);
    setVerifyMessage("Mobile verification completed successfully.");
  };

  const handleVerifyAadhaar = () => {
    if (!profile) return;
    const updated = { ...profile, aadhaarVerified: true };
    saveUserProfile(updated);
    setProfile(updated);
    setVerifyMessage("Aadhaar verification completed successfully.");
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-4 text-slate-600">No saved profile found. Complete registration to see dashboard analytics.</p>
          <div className="mt-8">
            <Link href="/" className="inline-flex rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Go to registration
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        

        <section className="space-y-6">


          {verifyMessage ? (
            <div className="rounded-[32px] border border-sky-200 bg-sky-50 px-6 py-4 text-slate-900 shadow-sm transition duration-300">
              {verifyMessage}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Overview</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back, {profile.firstName || profile.username || "User"}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Monitor analytics, consent requests, dataset activity, and profile completion in a single enterprise-grade workspace.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile.registrationType === "individual" ? "Individual" : "Organisation"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Completion</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{completion}%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile.mobileVerified ? "Verified" : "Pending"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Health score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{completion + 12}%</p>
                </div>
                <div className="rounded-3xl bg-sky-100 px-4 py-3 text-sm font-semibold text-sky-700">+12% improvement</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Aadhaar Verified</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{profile.aadhaarVerified ? "Yes" : "No"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Document Validated</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{profile.documentValidated ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <DashboardCard key={item.title} title={item.title} value={item.value} subtitle={item.subtitle} />
            ))}
          </div>

          <div className="grid gap-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Quick summary</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Live platform metrics</h2>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Updated just now</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Consent approvals</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">84%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Data sources</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">12</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">User requests</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">1.2k</p>
                </div>
              </div>
            </div>
            <DashboardCharts />
          </div>

          <ProfilePanel
            isOpen={profileOpen}
            profile={profile}
            completion={completion}
            onClose={() => setProfileOpen(false)}
            onVerifyMobile={handleVerifyMobile}
            onVerifyAadhaar={handleVerifyAadhaar}
          />
        </section>
      </div>
    </main>
  );
}
