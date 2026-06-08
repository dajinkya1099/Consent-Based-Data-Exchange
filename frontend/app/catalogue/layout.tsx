import AppLayout from "../../components/layouts/AppLayout";

export default function CatalogueOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
