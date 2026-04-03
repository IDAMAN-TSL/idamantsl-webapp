import { AppShell } from "@/components/layout/AppShell";

export default function PenangkaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
