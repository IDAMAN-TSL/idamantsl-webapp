import Image from "next/image";
import { UserCircle, Menu } from "lucide-react";
import LogoIcon from "@/assets/icon/Logo.svg";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
      {/* Left: Burger + Logo (mobile only) */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo + Brand (mobile only) */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#FAFCF5] to-[#E2ECD4] border border-[#f0f4e9] shadow-sm p-1">
            <Image
              src={LogoIcon}
              alt="IDAMAN TSL Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-extrabold text-[#111111] tracking-tight text-[16px]">
            IDAMAN TSL
          </span>
        </div>
      </div>

      {/* Desktop spacer: nothing on left */}
      <div className="hidden md:block" />

      {/* Account Button */}
      <button className="flex items-center gap-2 rounded-[14px] bg-[#446B2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#385926]">
        <UserCircle className="h-5 w-5" />
        Akun
      </button>
    </header>
  );
}
