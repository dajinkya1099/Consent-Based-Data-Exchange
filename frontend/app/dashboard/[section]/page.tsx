import Link from "next/link";

interface SectionPageProps {
  params: {
    section: string;
  };
}

const titleMap: Record<string, string> = {
  about: "About Project",
  datasets: "Datasets",
  models: "Models",
  usecases: "Usecases",
  sandbox: "Sandbox",
  leaderboard: "Leaderboard",
  challenges: "Challenges",
  discussions: "Discussions",
  resources: "Resources",
};

export default function SectionPage({ params }: SectionPageProps) {
  const title = titleMap[params.section] ?? params.section;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-4 text-slate-600">This area highlights the selected dashboard section. Build rich content and details here for {title.toLowerCase()}.</p>
          <div className="mt-8 grid gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <p>Use this page to display the {title.toLowerCase()} content and workflows in the dashboard.</p>
            <p>Navigate back to the main dashboard using the sidebar.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
