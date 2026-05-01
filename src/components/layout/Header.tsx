import Image from "next/image";
import { UserCircle, Menu, Bell } from "lucide-react";
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

      {/* Right Section: Notification + Account */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-yellow-400 rounded-full"></span>
        </button>

        {/* Account Info */}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900">
              John Doe
            </span>
            <span className="text-xs text-gray-500">
              Pusat BBKSDA Jabar
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
            <UserCircle className="h-6 w-6 text-gray-600" />
          </div>
        </button>
      </div>
    </header>
  );
}
