import { AppShell } from "@/components/layout/AppShell";

export default function ReferensiTSLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
