import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 xl:flex-row">
        <div className="xl:w-[320px]"> 
          <Sidebar activeId="access-request" />
        </div>

        <section className="flex-1 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.25)] xl:p-10">
          <div className="flex-1 rounded-[32px] border border-slate-200 bg-sky-200 p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.25)] xl:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create a New Access Request</h1>
              </div>
              
            </div>
           
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
