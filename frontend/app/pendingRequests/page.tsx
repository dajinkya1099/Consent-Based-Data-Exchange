"use client";

import { useMemo, useState } from "react";

//const sampleRequests = [
//   {
//     id: "REQ-001",
//     providerName: "HealthGov Research",
//     resource: "Patient care metrics",
//     description: "Request access for compliance analysis and approval reporting.",
//     status: "Pending",
//   },
//   {
//     id: "REQ-002",
//     providerName: "FinanceLabs",
//     resource: "Protected Financial Insights",
//     description: "Request access to sensitive financial datasets for internal review.",
//     status: "Pending",
//   },
//];

interface RequestItem {
  id: string;
  providerName: string;
  resource: string;
  description: string;
  status: string;
}

const sampleRequests: RequestItem[] = [];

export default function PendingRequestsPage() {
  const [search, setSearch] = useState("");

  const filteredRequests = useMemo(
    () =>
      sampleRequests.filter((request) => {
        const query = search.toLowerCase();
        return (
          request.providerName.toLowerCase().includes(query) ||
          request.resource.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.status.toLowerCase().includes(query) ||
          request.id.toLowerCase().includes(query)
        );
      }),
    [search]
  );

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Pending Requests</h1>
              
            </div>

            <div className="flex w-full max-w-md items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <label htmlFor="pending-search" className="sr-only">
                Search pending requests
              </label>
              <input
                id="pending-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by provider, resource, request ID"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Provider Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Resource</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Description</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 text-slate-900">{request.providerName}</td>
                      <td className="px-6 py-4 text-slate-900">{request.resource}</td>
                      <td className="px-6 py-4 text-slate-700">{request.description}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      No pending requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600">
            Showing {filteredRequests.length} pending request{filteredRequests.length === 1 ? "" : "s"}.
          </div>
        </section>
      </div>
    </div>
  );
}
