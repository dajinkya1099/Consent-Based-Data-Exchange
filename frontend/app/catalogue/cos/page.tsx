import CreateCOSForm from "../../../components/catalogue/cos/CreateCOSForm";


export default function CreateCOSPage() {
  return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="w-full mx-auto max-w-6xl">
  
          <div className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
  
            <div className="mb-8">
              <h1 className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
                Create COS
              </h1>
  
              <p className="mt-3 text-slate-600">
                Register a new Catalogue Operating System (COS) entity in the catalogue.
              </p>
            </div>
  
            <CreateCOSForm />
  
          </div>
  
        </div>
      </main>
    );
}