import ResourceGroupForm from "../../../components/catalogue/resource-group/ResourceGroupForm";


export default function Page() {
  return (
    <main className="min-h-screen bg-slate-100 p-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
            <h1 className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
              Create Resource Group
            </h1>

            <p className="mt-3 text-slate-600">
              Register a new Resource Group entity in the catalogue.
            </p>
          </div>
        <ResourceGroupForm />
      </div>
    </main>
  );
}