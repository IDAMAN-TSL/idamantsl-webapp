import { UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-[88px] items-center justify-end border-b border-gray-200 bg-white px-8">
      {/* Account Button */}
      <button className="flex items-center gap-2 rounded-lg bg-[#446B2F] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#385926]">
        <UserCircle className="h-5 w-5" />
        Akun
      </button>
    </header>
  );
}
