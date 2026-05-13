"use client";

import { useEffect, useState } from "react";
import { loadUserProfile } from "../../../lib/localStorage";
import { ConsentRequestItem, getUserRequests } from "../../../lib/dataStore";
import Link from "next/link";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<ConsentRequestItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const profile = loadUserProfile<Record<string, string | undefined>>();
    if (profile?.username) {
      setUsername(profile.username);
      setRequests(getUserRequests(profile.username));
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">My Requests</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Track your dataset access requests</h1>
              <p className="mt-3 text-slate-600">Review request status and see request history for datasets you asked access to.</p>
            </div>
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          {username ? (
            requests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-slate-700">
                      <th className="px-4 py-3">Dataset</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Request Type</th>
                      <th className="px-4 py-3">Created Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-4 font-semibold text-slate-900">{request.datasetName}</td>
                        <td className="px-4 py-4 text-slate-600">{request.accessType}</td>
                        <td className="px-4 py-4 text-slate-600">{request.requestType}</td>
                        <td className="px-4 py-4 text-slate-600">{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${request.status === "Pending" ? "bg-amber-100 text-amber-800" : request.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                <p className="text-lg font-medium text-slate-900">No requests found yet.</p>
                <p className="mt-3">Submit a new dataset request from the Datasets page to see status here.</p>
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <p className="text-lg font-medium text-slate-900">No active profile found.</p>
              <p className="mt-3">Please login or register to view your requests.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
