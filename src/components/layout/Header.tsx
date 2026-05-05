"use client";

import Image from "next/image";
import { UserCircle, Menu, Bell } from "lucide-react";
import LogoIcon from "@/assets/icon/Logo.svg";
import { useEffect, useState } from "react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<{ nama: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatRole = (role: string) => {
    if (!role) return "Admin Pusat";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayName = user?.nama || "John Doe";
  const displayRole = formatRole(user?.role || "");
  const initials = getInitials(displayName);

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
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
          <Bell className="h-6 w-6" strokeWidth={1.5} />
        </button>

        {/* Account Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[14px] font-bold text-[#111111]">
              {displayName}
            </span>
            <span className="text-[12px] text-[#8E8E8E]">
              {displayRole}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E7EB] border border-gray-100 overflow-hidden">
            <div className="flex h-full w-full items-center justify-center bg-[#595959] text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
