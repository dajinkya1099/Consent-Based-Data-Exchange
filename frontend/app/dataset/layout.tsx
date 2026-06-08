import AppLayout from "../../components/layouts/AppLayout";

export default function DatasetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
