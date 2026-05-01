"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoIcon from "@/assets/icon/Logo.svg";
import {
  LayoutDashboard,
  Leaf,
  Globe,
  Building,
  FileText,
  BadgeCheck,
  UserCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Penangkar", href: "/penangkaran", icon: Leaf },
  {
    name: "Pengedar Dalam Negeri",
    href: "/pengedaran-dalam",
    icon: Globe,
  },
  {
    name: "Pengedar Luar Negeri",
    href: "/pengedaran-luar",
    icon: Globe,
  },
  {
    name: "Lembaga Konservasi",
    href: "/lembaga-konservasi",
    icon: Building,
  },
  { name: "Referensi TSL", href: "/referensi-tsl", icon: FileText },
  { 
    name: "Verifikasi", 
    href: "/dashboard/verifikasi", 
    icon: BadgeCheck,
    badge: 3 
  },
  {
    name: "Manajemen Pengguna",
    href: "/dashboard/manajemen-pengguna",
    icon: UserCircle,
  },
];

export function Sidebar({ 
  isOpen = false, 
  setIsOpen 
}: { 
  isOpen?: boolean; 
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[280px] md:w-72 flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Logo Area */}
      <div className="flex h-[88px] items-center px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-[14px] shadow-sm p-1.5 w-[56px] h-[56px] bg-gradient-to-br from-[#FAFCF5] to-[#E2ECD4] border border-[#f0f4e9]">
            {/* We will use a placeholder or the actual logo if it exists. In the previous conversation, it mentioned using Logo.svg from local folder. I'll use Image tag but provide a fallback if it errors. */}
            <Image
              src={LogoIcon}
              alt="IDAMAN TSL Logo"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-extrabold text-[#111111] tracking-tight text-xl">
            IDAMAN TSL
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen?.(false)}
              className={`group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#446B2F] text-white shadow-md shadow-[#446B2F]/20"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      </div>
    </>
  );
}
