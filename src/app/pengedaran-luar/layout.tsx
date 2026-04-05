import { AppShell } from "@/components/layout/AppShell";

export default function PengedaranLuarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
