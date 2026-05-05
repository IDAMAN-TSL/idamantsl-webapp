"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import LogoIcon from "@/assets/icon/Logo.svg";
import {
  LayoutDashboard,
  Leaf,
  Globe,
  Building,
  FileText,
  BadgeCheck,
  UserCircle,
  LogOut,
  Bell,
} from "lucide-react";
import { LogoutModal } from "./LogoutModal";

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
    href: "/verifikasi",
    icon: BadgeCheck,
  },
  {
    name: "Manajemen Pengguna",
    href: "/manajemen-pengguna",
    icon: UserCircle,
  },
];

export function Sidebar({
  isOpen = false,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [pendingVerifikasiCount, setPendingVerifikasiCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUserRole(parsed.role || "");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const token = localStorage.getItem("token");

    const fetchPendingVerifikasiCount = async () => {
      if (!token) {
        setPendingVerifikasiCount(0);
        return;
      }

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setPendingVerifikasiCount(0);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const role: string = user?.role || "";
        const currentUserId: number | null =
          typeof user?.id === "number" ? user.id : null;

        if (role === "admin_pusat") {
          const res = await fetch(`${API_URL}/api/verifikasi/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();

          const referensiCount = Array.isArray(result?.data?.referensi_tsl)
            ? result.data.referensi_tsl.length
            : 0;
          const penangkaranCount = Array.isArray(result?.data?.penangkaran)
            ? result.data.penangkaran.length
            : 0;

          setPendingVerifikasiCount(referensiCount + penangkaranCount);
          return;
        }

        if (role === "bidang_wilayah" || role === "seksi_wilayah") {
          if (currentUserId === null) {
            setPendingVerifikasiCount(0);
            return;
          }

          const [resReferensi, resPenangkaran] = await Promise.all([
            fetch(`${API_URL}/api/referensi-tsl`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/api/penangkaran`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const [resultReferensi, resultPenangkaran] = await Promise.all([
            resReferensi.json(),
            resPenangkaran.json(),
          ]);

          const referensiPending = Array.isArray(resultReferensi?.data)
            ? resultReferensi.data.filter(
                (item: any) =>
                  item?.createdBy === currentUserId &&
                  item?.statusVerifikasi === "pending",
              ).length
            : 0;

          const penangkaranPending = Array.isArray(resultPenangkaran?.data)
            ? resultPenangkaran.data.filter((item: any) => {
                const createdById =
                  typeof item?.createdBy === "object"
                    ? item?.createdBy?.id
                    : item?.createdBy;

                return (
                  createdById === currentUserId &&
                  item?.statusVerifikasi === "pending"
                );
              }).length
            : 0;

          setPendingVerifikasiCount(referensiPending + penangkaranPending);
          return;
        }

        setPendingVerifikasiCount(0);
      } catch {
        setPendingVerifikasiCount(0);
      }
    };

    fetchPendingVerifikasiCount();
    window.addEventListener("focus", fetchPendingVerifikasiCount);

    return () => {
      window.removeEventListener("focus", fetchPendingVerifikasiCount);
    };
  }, [pathname]);

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
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[280px] md:h-screen md:w-72 md:shrink-0 flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-[88px] items-center px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-[14px] shadow-sm p-1.5 w-[56px] h-[56px] bg-gradient-to-br from-[#FAFCF5] to-[#E2ECD4] border border-[#f0f4e9]">
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
            if (
              item.name === "Manajemen Pengguna" &&
              userRole !== "admin_pusat"
            ) {
              return null;
            }
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen?.(false)}
                className={`group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#8E9E25] text-white shadow-md shadow-[#8E9E25]/20"
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
                {item.name === "Verifikasi" && pendingVerifikasiCount > 0 && (
                  <div className="ml-2 inline-flex items-center gap-1 rounded-[6px] bg-[#D24B4B] px-1.5 py-0.5 text-white shadow-sm">
                    <Bell className="h-2.5 w-2.5 fill-white" strokeWidth={3} />
                    <span className="text-[10px] font-bold">
                      {pendingVerifikasiCount}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-5 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
